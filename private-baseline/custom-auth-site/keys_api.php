<?php
/**
 * QLU Mail 激活码管理 API（供 JesusMail 后台内嵌管理页 /custom/keys.html 调用）
 * 鉴权：请求头 X-Auth-Token 携带 JesusMail 后台 JWT，服务端回源校验
 * 存储：MySQL mail 库 activation_keys / activation_logs
 */

const BM_API_BASE   = 'https://127.0.0.1:41443';
const DB_DSN  = 'mysql:host=127.0.0.1;port=3306;dbname=mail;charset=utf8mb4';
const DB_USER = 'mail';
define('DB_PASS', getenv('QLU_MAIL_DB_PASSWORD') ?: '');

/* ---------- CORS ---------- */
$origin  = $_SERVER['HTTP_ORIGIN'] ?? '';
$allowed = ['https://<SERVER_IP>:41443'];
header('Content-Type: application/json; charset=utf-8');
if (in_array($origin, $allowed, true)) {
    header('Access-Control-Allow-Origin: ' . $origin);
    header('Vary: Origin');
}
header('Access-Control-Allow-Methods: GET, POST, OPTIONS');
header('Access-Control-Allow-Headers: Content-Type, X-Auth-Token, Authorization');
header('Access-Control-Max-Age: 600');
if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') { http_response_code(204); exit; }

function out(array $data, int $code = 200): never {
    http_response_code($code);
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

/* ---------- 数据库 ---------- */
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

/* ---------- 鉴权：回源校验 JesusMail JWT ---------- */
function auth_admin(): void {
    $token = $_SERVER['HTTP_X_AUTH_TOKEN'] ?? '';
    if ($token === '' && preg_match('/^Bearer\s+(.+)$/i', $_SERVER['HTTP_AUTHORIZATION'] ?? '', $m)) {
        $token = $m[1];
    }
    if ($token === '') { out(['success' => false, 'msg' => '未登录'], 401); }

    $ch = curl_init(BM_API_BASE . '/api/settings/get_version');
    curl_setopt_array($ch, [
        CURLOPT_RETURNTRANSFER => true,
        CURLOPT_HTTPHEADER     => ['Authorization: Bearer ' . $token],
        CURLOPT_TIMEOUT        => 10,
        CURLOPT_CONNECTTIMEOUT => 4,
        CURLOPT_SSL_VERIFYPEER => false,
        CURLOPT_SSL_VERIFYHOST => 0,
    ]);
    $body  = curl_exec($ch);
    $errno = curl_errno($ch);
    curl_close($ch);
    $json = $errno ? null : json_decode((string)$body, true);
    if (!is_array($json) || !($json['success'] ?? false)) {
        out(['success' => false, 'msg' => '登录态无效，请重新登录后台'], 401);
    }
}

/* ---------- 激活码生成 ---------- */
function gen_key(): string {
    $alpha = 'ABCDEFGHJKMNPQRSTUVWXYZ23456789';
    $g = fn() => $alpha[random_int(0, strlen($alpha) - 1)] . $alpha[random_int(0, strlen($alpha) - 1)]
               . $alpha[random_int(0, strlen($alpha) - 1)] . $alpha[random_int(0, strlen($alpha) - 1)];
    return 'QLU-' . $g() . '-' . $g() . '-' . $g();
}

/* ---------- 主逻辑 ---------- */
auth_admin();

$action = $_GET['action'] ?? '';
$input  = [];
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input') ?: '[]', true) ?: [];
}

switch ($action) {
    case 'stats':
        $row = db()->query('SELECT COUNT(*) total,
                                   SUM(status=0) unused,
                                   SUM(status=1) used,
                                   SUM(status=2) disabled
                            FROM activation_keys')->fetch();
        out(['success' => true, 'data' => array_map('intval', $row)]);

    case 'list':
        $page  = max(1, (int)($_GET['page'] ?? 1));
        $size  = min(200, max(5, (int)($_GET['page_size'] ?? 50)));
        $status = $_GET['status'] ?? '';
        $group  = $_GET['group'] ?? '';
        $conds  = [];
        if ($status !== '' && in_array($status, ['0', '1', '2'], true)) { $conds[] = 'status = ' . (int)$status; }
        if ($group === '__none__') {
            $conds[] = "group_name = ''";
        } elseif ($group !== '') {
            $conds[] = 'group_name = ' . db()->quote($group);
        }
        $where = $conds ? 'WHERE ' . implode(' AND ', $conds) : '';
        $total = (int)db()->query("SELECT COUNT(*) FROM activation_keys $where")->fetchColumn();
        $st = db()->query("SELECT id, keycode, status, email, used_ip, used_at, note, group_name, created_at
                           FROM activation_keys $where ORDER BY id ASC LIMIT $size OFFSET " . ($page - 1) * $size);
        $groups = db()->query("SELECT DISTINCT group_name FROM activation_keys WHERE group_name != '' ORDER BY group_name")->fetchAll(PDO::FETCH_COLUMN);
        out(['success' => true, 'data' => [
            'total' => $total,
            'page'  => $page,
            'page_size' => $size,
            'groups' => $groups,
            'list'  => $st->fetchAll(),
        ]]);

    case 'export':
        $status = $_GET['status'] ?? '';
        $group  = $_GET['group'] ?? '';
        $conds  = [];
        if ($status !== '' && in_array($status, ['0', '1', '2'], true)) { $conds[] = 'status = ' . (int)$status; }
        if ($group === '__none__') {
            $conds[] = "group_name = ''";
        } elseif ($group !== '') {
            $conds[] = 'group_name = ' . db()->quote($group);
        }
        $where = $conds ? 'WHERE ' . implode(' AND ', $conds) : '';
        $rows = db()->query("SELECT id, keycode, status, group_name, email, used_ip, used_at, note, created_at
                             FROM activation_keys $where ORDER BY id ASC")->fetchAll();
        $map = [0 => '未使用', 1 => '已使用', 2 => '已禁用'];
        header('Content-Type: text/csv; charset=utf-8');
        header('Content-Disposition: attachment; filename="qlu_keys_' . date('Ymd_His') . '.csv"');
        $fp = fopen('php://output', 'w');
        fwrite($fp, "\xEF\xBB\xBF");   // UTF-8 BOM，保证 Excel 打开不乱码
        fputcsv($fp, ['ID', '激活码', '状态', '分组', '关联邮箱', '使用IP', '使用时间', '备注', '创建时间']);
        foreach ($rows as $r) {
            fputcsv($fp, [
                $r['id'], $r['keycode'], $map[(int)$r['status']] ?? $r['status'],
                $r['group_name'] ?: '未分组', $r['email'], $r['used_ip'],
                $r['used_at'], $r['note'], $r['created_at'],
            ]);
        }
        fclose($fp);
        exit;

    case 'add':
        $count = (int)($input['count'] ?? 0);
        $note  = trim((string)($input['note'] ?? ''));
        $group = mb_substr(trim((string)($input['group'] ?? '')), 0, 100);
        if ($count < 1 || $count > 500) { out(['success' => false, 'msg' => '生成数量需在 1-500 之间']); }
        $st = db()->prepare('INSERT IGNORE INTO activation_keys (keycode, note, group_name) VALUES (?, ?, ?)');
        $made = 0; $guard = 0;
        while ($made < $count && $guard++ < $count * 5) {
            $st->execute([gen_key(), $note, $group]);
            $made += $st->rowCount();
        }
        out(['success' => true, 'data' => ['created' => $made]]);

    case 'set_group':
        $ids   = array_values(array_filter(array_map('intval', $input['ids'] ?? [])));
        $group = mb_substr(trim((string)($input['group'] ?? '')), 0, 100);
        if (!$ids) { out(['success' => false, 'msg' => '未选择激活码']); }
        $in = implode(',', $ids);
        $n  = db()->exec("UPDATE activation_keys SET group_name = " . db()->quote($group) . " WHERE id IN ($in)");
        out(['success' => true, 'data' => ['updated' => $n]]);

    case 'delete':
        $ids = array_values(array_filter(array_map('intval', $input['ids'] ?? [])));
        if (!$ids) { out(['success' => false, 'msg' => '未选择要删除的激活码']); }
        $force = !empty($input['force']);   // force=true 时连已使用的激活码一并删除
        $in = implode(',', $ids);
        $pdo = db();
        $cond = $force ? '' : ' AND status = 0';
        $used = $force ? 0 : (int)$pdo->query("SELECT COUNT(*) FROM activation_keys WHERE id IN ($in) AND status != 0")->fetchColumn();
        $del  = $pdo->exec("DELETE FROM activation_keys WHERE id IN ($in)$cond");
        // 同步清理已无对应激活码的孤儿流水
        if ($force) {
            $pdo->exec("DELETE FROM activation_logs WHERE keycode NOT IN (SELECT keycode FROM activation_keys)");
        }
        out(['success' => true, 'data' => ['deleted' => $del, 'skipped_used' => $used]]);

    default:
        out(['success' => false, 'msg' => '未知操作']);
}
