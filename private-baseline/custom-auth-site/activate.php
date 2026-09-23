<?php
/**
 * QLU Mail 邮箱账号激活页
 * 流程：用户输入一次性激活密钥 + 自定义前缀 + 自设密码 → 调 JesusMail API 创建邮箱
 * 存储：MySQL（mail 库 activation_keys / activation_logs），不依赖 TXT
 */

/* ==================== 配置 ==================== */
const BM_API_BASE   = 'https://127.0.0.1:41443'; // JesusMail 管理后台（容器内端口）
define('BM_API_TOKEN', getenv('BM_API_TOKEN') ?: '');
const MAIL_DOMAIN   = 'mail.qlu.edu.kg';         // 邮箱后缀（须与后台已添加的域名一致）
const MAILBOX_QUOTA = 33554432;                  // 新邮箱配额：32MB

const DB_DSN  = 'mysql:host=127.0.0.1;port=3306;dbname=mail;charset=utf8mb4';
const DB_USER = 'mail';
define('DB_PASS', getenv('QLU_MAIL_DB_PASSWORD') ?: '');

const MAX_FAILS    = 8;            // 允许的失败次数
const LOCK_SECONDS = 600;          // 超限后锁定时长（秒）

const RESERVED_PREFIX = [
    'admin', 'administrator', 'root', 'abuse', 'postmaster', 'webmaster',
    'hostmaster', 'mailer-daemon', 'noreply', 'no-reply', 'support', 'info',
    'billing', 'contact', 'security', 'mail', 'test', 'activate',
];

/* ==================== 初始化 ==================== */
session_start();
error_reporting(E_ALL & ~E_DEPRECATED);
ini_set('display_errors', '0');

$state = 'form';        // form | success
$error = '';
$success_email = '';
$prefix_value  = '';

/* ==================== 数据库 ==================== */

function db(): PDO {
    static $pdo = null;
    if (!$pdo) {
        $pdo = new PDO(DB_DSN, DB_USER, DB_PASS, [
            PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
            PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
        ]);
    }
    return $pdo;
}

function key_is_used(string $key): bool {
    $st = db()->prepare('SELECT status FROM activation_keys WHERE keycode = ?');
    $st->execute([$key]);
    $row = $st->fetch();
    return !$row || (int)$row['status'] !== 0;   // 不存在、已用、禁用均视为不可用
}

/** 事务内核销密钥（SELECT FOR UPDATE 防并发双花） */
function consume_key(string $key, string $email, string $ip): bool {
    $pdo = db();
    $pdo->beginTransaction();
    try {
        $st = $pdo->prepare('SELECT id, status FROM activation_keys WHERE keycode = ? FOR UPDATE');
        $st->execute([$key]);
        $row = $st->fetch();
        if (!$row || (int)$row['status'] !== 0) { $pdo->rollBack(); return false; }
        $pdo->prepare('UPDATE activation_keys SET status = 1, used_at = NOW(), used_ip = ?, email = ? WHERE id = ?')
            ->execute([$ip, $email, $row['id']]);
        $pdo->prepare('INSERT INTO activation_logs (keycode, email, ip) VALUES (?, ?, ?)')
            ->execute([$key, $email, $ip]);
        $pdo->commit();
        return true;
    } catch (Throwable $e) {
        if ($pdo->inTransaction()) { $pdo->rollBack(); }
        return false;
    }
}

/** 邮箱创建失败时回滚密钥，允许重试 */
function release_key(string $key, string $email): void {
    try {
        db()->prepare('UPDATE activation_keys SET status = 0, used_at = NULL, used_ip = NULL, email = NULL WHERE keycode = ? AND email = ?')
            ->execute([$key, $email]);
        db()->prepare('DELETE FROM activation_logs WHERE keycode = ? AND email = ?')
            ->execute([$key, $email]);
    } catch (Throwable $e) { /* 回滚失败仅影响该码可用性，不阻塞 */ }
}

/* ==================== JesusMail API ==================== */

function http_api(string $method, string $path, array $payload = [], ?string $token = null): array {
    $ch = curl_init(BM_API_BASE . $path);
    $headers = ['Content-Type: application/json'];
    if ($token) { $headers[] = 'Authorization: Bearer ' . $token; }
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_CUSTOMREQUEST  => $method,
        CURLOPT_HTTPHEADER     => $headers,
        CURLOPT_TIMEOUT        => 15,
        CURLOPT_CONNECTTIMEOUT => 5,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => 0,
    ]);
    if ($payload) { curl_setopt($ch, CURLOPT_POSTFIELDS, json_encode($payload)); }
    $body = curl_exec($ch);
    $errno = curl_errno($ch);
    curl_close($ch);
    if ($errno || !$body) { return ['success' => false, 'msg' => 'API_UNREACHABLE']; }
    $json = json_decode($body, true);
    return is_array($json) ? $json : ['success' => false, 'msg' => 'API_BAD_RESPONSE'];
}

function api_login(): ?string {
    // 使用永久 API Token（无过期时间），避免后台账号密码变动导致失效
    $r = http_api('GET', '/api/settings/get_version', [], BM_API_TOKEN);
    return ($r['success'] ?? false) ? BM_API_TOKEN : null;
}

/** 与后台比对前缀是否已被占用（keyword 检索 + 精确匹配） */
function mailbox_exists(string $token, string $local): bool {
    $kw = $local . '@' . MAIL_DOMAIN;
    $r = http_api('GET', '/api/mailbox/list?page=1&page_size=50&keyword=' . urlencode($kw), [], $token);
    if (!($r['success'] ?? false)) { return false; }
    foreach (($r['data']['list'] ?? []) as $box) {
        if (strcasecmp($box['username'] ?? '', $kw) === 0) { return true; }
    }
    return false;
}

/* ==================== 防护 ==================== */

function too_fast_fails(): bool {
    $locked_at = $_SESSION['act_locked_at'] ?? 0;
    if ($locked_at && time() - $locked_at < LOCK_SECONDS) { return true; }
    if ($locked_at) { $_SESSION['act_locked_at'] = 0; $_SESSION['act_fails'] = 0; }
    return false;
}

function mark_fail(): void {
    $_SESSION['act_fails'] = ($_SESSION['act_fails'] ?? 0) + 1;
    if ($_SESSION['act_fails'] >= MAX_FAILS) {
        $_SESSION['act_locked_at'] = time();
        $_SESSION['act_fails'] = 0;
    }
}

/* ==================== 主流程 ==================== */
if (empty($_SESSION['act_csrf'])) {
    $_SESSION['act_csrf'] = bin2hex(random_bytes(16));
}

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $post_key     = strtoupper(trim($_POST['key'] ?? ''));
    $prefix_value = strtolower(trim($_POST['prefix'] ?? ''));
    $pass         = (string)($_POST['pass'] ?? '');
    $pass2        = (string)($_POST['pass2'] ?? '');
    $client_ip    = $_SERVER['REMOTE_ADDR'] ?? '-';

    do {
        if (too_fast_fails()) { $error = '尝试次数过多，请 10 分钟后再试。'; mark_fail(); break; }
        if (!hash_equals($_SESSION['act_csrf'], $_POST['csrf'] ?? '')) { $error = '页面已过期，请刷新重试。'; mark_fail(); break; }

        // 1. 密钥格式 + 状态
        if ($post_key === '') { $error = '请输入激活密钥。'; mark_fail(); break; }
        if (!preg_match('/^QLU-[A-Z2-9]{4}-[A-Z2-9]{4}-[A-Z2-9]{4}$/', $post_key)) { $error = '激活密钥格式不正确。'; mark_fail(); break; }
        if (key_is_used($post_key)) { $error = '该激活密钥无效或已被使用。'; mark_fail(); break; }

        // 2. 前缀合法性
        if ($prefix_value === '') { $error = '请输入邮箱前缀。'; mark_fail(); break; }
        if (!preg_match('/^[a-z0-9]([a-z0-9._-]{1,28})[a-z0-9]$/', $prefix_value) || strpos($prefix_value, '..') !== false) {
            $error = '前缀需为 3-30 位小写字母、数字或 . _ -，且以字母/数字开头结尾。'; mark_fail(); break;
        }
        if (in_array($prefix_value, RESERVED_PREFIX, true)) { $error = '该前缀为系统保留，请换一个。'; mark_fail(); break; }

        // 3. 密码规则：8-64 位，须同时包含字母（大小写均可）和数字
        if (strlen($pass) < 8 || strlen($pass) > 64 || !preg_match('/^(?=.*[a-zA-Z])(?=.*\d).+$/', $pass)) {
            $error = '密码需 8-64 位，且同时包含字母和数字。'; mark_fail(); break;
        }
        if ($pass !== $pass2) { $error = '两次输入的密码不一致。'; mark_fail(); break; }

        // 4. 调 API 与后台比对：前缀是否已被占用
        $token = api_login();
        if (!$token) { $error = '系统繁忙（无法连接邮箱服务），请稍后再试。'; mark_fail(); break; }
        if (mailbox_exists($token, $prefix_value)) { $error = '该邮箱前缀已被占用，请换一个。'; mark_fail(); break; }

        // 5. 先核销密钥（事务防并发），再创建邮箱
        $email = $prefix_value . '@' . MAIL_DOMAIN;
        if (!consume_key($post_key, $email, $client_ip)) { $error = '该激活密钥无效或已被使用。'; mark_fail(); break; }

        $r = http_api('POST', '/api/mailbox/create', [
            'full_name'    => $prefix_value,
            'local_part'   => $prefix_value,
            'domain'       => MAIL_DOMAIN,
            'password'     => $pass,
            'quota'        => MAILBOX_QUOTA,
            'isAdmin'      => false,
            'active'       => true,
            'quota_active' => 1,
        ], $token);

        if ($r['success'] ?? false) {
            $success_email = $email;
            $state = 'success';
            unset($_SESSION['act_fails'], $_SESSION['act_locked_at']);
        } else {
            release_key($post_key, $email);
            $error = '创建失败（邮箱可能刚被他人注册），请换一个前缀重试。';
            mark_fail();
        }
    } while (false);
}
?>
<!doctype html>
<html lang="zh-CN">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>邮箱账号激活 · QLU Mail</title>
<link rel="shortcut icon" href="/assets/favicon.ico" type="image/x-icon">
<style>
    * { margin:0; padding:0; box-sizing:border-box; }
    body {
        min-height:100vh; display:flex; align-items:center; justify-content:center;
        font-family:-apple-system,"Segoe UI","PingFang SC","Microsoft YaHei",sans-serif;
        background:linear-gradient(135deg,#2b3d47 0%,#404f54 55%,#35505c 100%);
        padding:20px;
    }
    .card {
        width:100%; max-width:420px; background:#fff; border-radius:14px;
        box-shadow:0 18px 50px rgba(0,0,0,.35); padding:34px 34px 28px;
    }
    .brand { display:flex; flex-direction:column; align-items:center; gap:10px; margin-bottom:22px; }
    .brand img { width:64px; height:64px; }
    .brand h1 { font-size:22px; color:#243746; font-weight:600; }
    .brand p { font-size:13px; color:#7d8a94; }
    label { display:block; font-size:13px; color:#51606b; margin:14px 0 6px; }
    .suffix-wrap { display:flex; align-items:stretch; }
    .suffix-wrap input { flex:1; border-top-right-radius:0; border-bottom-right-radius:0; }
    .suffix-wrap .suffix {
        display:flex; align-items:center; padding:0 12px; background:#eef2f5;
        border:1px solid #ccd5db; border-left:none; border-radius:0 8px 8px 0;
        color:#51606b; font-size:14px; white-space:nowrap;
    }
    input[type=text], input[type=password] {
        width:100%; padding:10px 12px; font-size:14px; color:#243746;
        border:1px solid #ccd5db; border-radius:8px; outline:none; background:#fff;
    }
    input:focus { border-color:#1e6fd9; box-shadow:0 0 0 3px rgba(30,111,217,.15); }
    .btn {
        display:block; width:100%; margin-top:22px; padding:11px; font-size:15px;
        color:#fff; background:linear-gradient(135deg,#1e6fd9,#0aa2c0);
        border:none; border-radius:8px; cursor:pointer; text-align:center; text-decoration:none;
    }
    .btn:hover { filter:brightness(1.06); }
    .btn.ghost { background:#eef2f5; color:#243746; margin-top:10px; }
    .msg-error {
        margin-top:16px; padding:10px 12px; font-size:13px; border-radius:8px;
        background:#fdecec; color:#b42318; border:1px solid #f5c6c2;
    }
    .ok-box { text-align:center; }
    .ok-box .icon { font-size:44px; }
    .ok-box h2 { font-size:19px; color:#243746; margin:10px 0 6px; }
    .ok-box .email {
        display:inline-block; margin:12px 0 4px; padding:10px 18px; font-size:17px; font-weight:600;
        color:#1e6fd9; background:#eef4fd; border:1px dashed #9cc0ef; border-radius:8px;
        user-select:all;
    }
    .ok-box p { font-size:13px; color:#7d8a94; line-height:1.8; text-align:left; margin-top:14px; }
    .tip { margin-top:16px; font-size:12px; color:#98a4ad; text-align:center; }
    .tip a { color:#1e6fd9; text-decoration:none; }
</style>
</head>
<body>
<div class="card">
    <div class="brand">
        <img src="/assets/logo.svg" alt="QLU Mail">
        <h1>QLU Mail</h1>
        <p><?= $state === 'success' ? '账号激活成功' : '使用激活密钥开通你的邮箱' ?></p>
    </div>

<?php if ($state === 'success'): ?>
    <div class="ok-box">
        <div class="icon">✅</div>
        <h2>你的邮箱已就绪</h2>
        <div class="email"><?= htmlspecialchars($success_email) ?></div>
        <p>
            · 登录密码为你刚才设置的密码，请妥善保管；<br>
            · 本次使用的激活密钥已作废，请勿重复使用；<br>
            · 建议立即登录一次，熟悉邮箱界面。
        </p>
        <a class="btn" href="/roundcube/">前往登录邮箱</a>
    </div>
<?php else: ?>
    <?php if ($error): ?><div class="msg-error"><?= htmlspecialchars($error) ?></div><?php endif; ?>
    <form method="post" action="/activate.php" autocomplete="off">
        <input type="hidden" name="csrf" value="<?= htmlspecialchars($_SESSION['act_csrf']) ?>">
        <label for="key">激活密钥</label>
        <input type="text" id="key" name="key" placeholder="QLU-XXXX-XXXX-XXXX" maxlength="19"
               value="<?= htmlspecialchars(strtoupper(trim($_POST['key'] ?? ''))) ?>" required>
        <label for="prefix">邮箱前缀</label>
        <div class="suffix-wrap">
            <input type="text" id="prefix" name="prefix" placeholder="如：zhang.san" maxlength="30"
                   value="<?= htmlspecialchars($prefix_value) ?>" required>
            <span class="suffix">@<?= MAIL_DOMAIN ?></span>
        </div>
        <label for="pass">设置登录密码</label>
        <input type="password" id="pass" name="pass" placeholder="8-64 位，需包含字母和数字" maxlength="64" required>
        <label for="pass2">确认密码</label>
        <input type="password" id="pass2" name="pass2" placeholder="再次输入密码" maxlength="64" required>
        <button class="btn" type="submit">立即激活</button>
    </form>
    <div class="tip">已有邮箱？<a href="/roundcube/">直接登录 &raquo;</a></div>
<?php endif; ?>
</div>
</body>
</html>
