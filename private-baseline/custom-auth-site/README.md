# QLU Mail 站点交付文档（README / Handoff）

> 最后更新：2026-09-04
> 服务器环境与连接信息：见私密运维记录（不纳入 Git）
> 生产域名与服务器 IP：<REDACTED>

---

## 一、这套东西是什么

面向学生/用户的自助邮箱系统：

- **登录页**：`https://mail.qlu.edu.kg/roundcube/`（Roundcube 网页邮箱，已去 JesusMail 品牌化，改名 QLU Mail）
- **激活页**：`https://mail.qlu.edu.kg/activate.php`（用户凭一次性激活码自助注册邮箱，自定义前缀 + 自设密码）
- **激活码管理页**：内嵌在 JesusMail 管理后台（`https://<SERVER_IP>:41443/`）左侧菜单"激活码管理"，负责激活码的生成/分组/删除/导出
- **管理后台**：JesusMail 原生后台（域名/邮箱/群发管理），8080 端口已关闭，仅保留 41443（HTTPS）

## 二、请求路由（关键！改动前先看这个）

Nginx 站点配置：`/www/server/panel/vhost/nginx/mail.qlu.edu.kg.conf`（自定义部分用 `#QLU-MAIL-START/END` 注释块标出）

| URL | 去向 |
|---|---|
| `http://*.qlu.edu.kg/*` | 301 强制跳 HTTPS |
| `https://mail.qlu.edu.kg/` | 301 → `/roundcube/`（登录页） |
| `/roundcube/...` | 反向代理 → `https://127.0.0.1:41443`（JesusMail core 容器） |
| `/activate.php`、`/keys_api.php`、`/assets/*` | 宿主机 PHP 8.2 / 静态文件（**不进 Docker**） |
| `/activate_data/...` | 一律 404（数据目录禁止 HTTP 访问） |
| `README.md` 等敏感文件 | 404（宝塔默认规则自带拦截，所以本文档公网下载不到） |

## 三、文件清单（都在哪、干什么）

### 网站目录 `/www/wwwroot/mail.qlu.edu.kg/`
| 文件/目录 | 说明 |
|---|---|
| `activate.php` | 激活页全部逻辑（表单+校验+调 API 开户），配置常量在文件顶部 |
| `keys_api.php` | 激活码管理页的后端 API（stats/list/add/delete/set_group/export），鉴权靠后台 JWT 回源校验 |
| `assets/` | 激活页用的 logo.svg、favicon.ico |
| `activate_data/keys.txt.migrated.bak` | 历史 TXT 密钥池归档（已全部迁入 MySQL，仅留档） |
| `README.md` | 本文档 |

### JesusMail Docker 目录 `/www/dk_project/dk_app/jesusmail/jesusmail_P4xa/`
| 文件 | 说明 |
|---|---|
| `docker-compose.yml` | **改动过三处**：① 删掉 core 服务的 8080 端口映射（只留 41443）；② 增加 `conf/custom-ui` 目录挂载 + `conf/custom-ui/index.html` 挂载为后台首页；③ webmail 服务增加 4 个**单文件只读挂载**（login.html / menu.html / logo.svg / favicon.ico，见下）。原始备份：`/root/jesusmail-compose.bak.20260903174048.yml` |
| `conf/webmail-skin/` | **持久化皮肤目录（关键）**：`templates/login.html`（激活入口）、`templates/includes/menu.html`（删关于按钮）、`images/logo.svg`、`images/favicon.ico`。以**单文件只读 bind mount** 挂进 webmail 容器，重启/重建都不被覆盖。改这些文件后 `docker compose restart webmail-jesusmail` 生效 |
| `.env` | 容器环境变量（PostgreSQL/Redis 密码等）。⚠️ `JESUSMAIL_HOSTNAME=mail.maill.qlu.edu.kg` 有拼写错误（多一个 l），暂未改 |
| `conf/webmail/custom.inc.php` | Roundcube 品牌/插件/改密配置（product_name=QLU Mail，display_product_info=0） |
| `conf/webmail/extra.php` | 品牌持久化兜底（防 custom.inc.php 被后台重写还原） |
| `conf/custom-ui/index.html` | 后台首页（原版 + 注入了一行 `<script src="/custom/inject.js?v=2">`） |
| `conf/custom-ui/inject.js` | 侧边栏菜单注入：克隆一个菜单项"激活码管理"，点击在内容区内嵌 iframe（不再跳新页面），点其他菜单自动收回 |
| `conf/custom-ui/keys.html` | 激活码管理页本体（支持 `?embed=1` 内嵌模式，隐藏自身顶栏） |
| `conf/custom-ui/logo.svg` | 管理页用的 logo |
| `data/webmail-data/skins/elastic/templates/login.html` | 登录页模板：加了"没有账号？立即激活邮箱 »"渐变按钮。**注意：链接必须写完整域名（https://...），写 /activate.php 会被 Roundcube 模板引擎改写成皮肤路径导致 404（踩过的坑）** |
| `data/webmail-data/skins/elastic/templates/includes/menu.html` | 删除了原"关于"按钮 |
| `data/webmail-data/skins/elastic/templates/about.html.disabled` | 原"关于"弹窗页（改名停用，留档） |
| `data/webmail-data/skins/elastic/images/logo.svg`、`favicon.ico` | 替换后的蓝青渐变信封图标 |

## 四、数据库（MySQL · 库名 mail）

- 连接：`127.0.0.1:3306`，用户 `mail`，密码通过环境变量 `QLU_MAIL_DB_PASSWORD` 注入
- `activation_keys`：激活码主表。字段：`id, keycode(唯一), status(0未用/1已用/2禁用), used_at, used_ip, email(关联邮箱), note(备注), group_name(分组), created_at`
- `activation_logs`：激活流水（keycode, email, ip, created_at），强制删除激活码时自动清理孤儿流水
- 当前状态（2026-09-04）：共 102 个码，未使用 101，已使用 1；其中"闲鱼"分组 99 个

## 五、JesusMail 后台 API（激活页/管理页依赖的接口）

基地址 `https://127.0.0.1:41443/api`，鉴权 `Authorization: Bearer <JWT>`：

| 接口 | 用途 |
|---|---|
| `POST /api/login` | 账密换 token（body: username/password，**现带验证码，脚本不可用**） |
| `POST /api/mailbox/create` | 开户。字段：local_part(前缀), domain, password, quota(字节), full_name, isAdmin, active, quota_active。**后端只校验密码≥8位，不强制大写** |
| `POST /api/mailbox/delete` | 删邮箱（body: `{"emails":["x@y"]}`，注意是 emails 不是 usernames） |
| `GET /api/mailbox/list?page=&page_size=&keyword=` | 列表/查重（keyword 精确到完整地址） |
| `GET /api/settings/get_version` | 轻量接口，keys_api.php 用它验证 token 有效性 |

**重要：激活页使用独立 API Token，不再用账密登录**。Token 存在 JesusMail 的 PostgreSQL 表 `jesusmail.bm_options`（name=`API_TOKEN`），无过期时间（payload 无 exp）。代码通过环境变量 `BM_API_TOKEN` 读取。管理页（keys.html）仍从后台 localStorage 取用户登录态 JWT，keys_api.php 用它做鉴权。**后台管理密码已改为 `<REDACTED>` / `<REDACTED>`（通过私密配置管理）**，与 API Token 解耦。

## 六、业务规则（激活页现行规则）

- **激活码**：格式 `QLU-XXXX-XXXX-XXXX`（去易混淆字符），一码一次，事务核销防并发双花，创建失败自动回滚
- **密码**：8-64 位，须同时含字母（大小写均可）和数字（2026-09-04 放宽，原先强制大写）
- **前缀**：3-30 位小写字母/数字/`. _ -`，字母数字开头结尾，有保留词黑名单（admin、postmaster 等），提交前实时调后台 API 查重
- **配额**：新邮箱 32MB（2026-09-04 从 1GB 下调）
- **防护**：CSRF token；同会话失败 8 次锁 10 分钟；`/activate_data/` 全目录 404

## 七、激活码管理页功能（后台内嵌）

生成（1-500个/次，可带分组+备注）· 列表（ID 升序=从旧到新）· 分组筛选/未分组筛选 · 状态筛选 · 批量分组（可移出分组）· 批量删除（仅未使用）· **批量删除（含已使用，会清流水，红色警告确认）** · 单行删除/删除记录 · 点击激活码复制 · 导出 CSV（按当前筛选条件，UTF-8 BOM，Excel 不乱码）· 统计卡

## 八、运维注意事项（重要）

1. **宝塔 Docker 应用商店升级/重装 JesusMail 会重写 compose**：8080 端口映射会回来、custom-ui 挂载和 webmail-skin 单文件挂载都会丢。恢复：对照 `/root/jesusmail-compose.bak.*` 把挂载加回去、删 8080 行，然后 `cd /www/dk_project/dk_app/jesusmail/jesusmail_P4xa && docker compose up -d` 重建全部容器
2. **改 inject.js / keys.html 立即生效**（目录挂载）；**改 custom-ui/index.html 需强制重建 core 容器**才生效（单文件挂载绑 inode，sed -i 换 inode 后容器内不变）。改 inject.js 后记得把 index.html 里的 `?v=2` 版本号 +1 防浏览器缓存
3. **改 Roundcube 皮肤（conf/webmail-skin 下 4 个文件）后**：`docker compose restart webmail-jesusmail` 即可，**不用清模板缓存**（这些是源模板不是缓存）；若改了 Roundcube 编辑器内编的配置才需要清 core 容器缓存 `docker exec jesusmail_p4xa-jesusmail_P4xa-1 sh -c 'rm -rf /tmp/roundcube-temp/*'`
4. **后台账号密码已移至私密配置（.env 的 ADMIN_*）**；激活页开户走的是独立 API Token（见第五节），与后台密码解耦，改后台密码不影响激活页
5. **管理页依赖后台 DOM 类名**（.n-menu / .n-menu-item / .n-layout-sider / .n-layout-header）。JesusMail 大版本升级若改前端结构，菜单注入可能失效——届时直接访问 `/custom/keys.html` 仍可用，再适配 inject.js 即可
6. **登录页模板里的链接必须写完整域名**（见第三节），Roundcube 会给 `/` 开头的相对链接自动加皮肤前缀
7. `.env` 里 `JESUSMAIL_HOSTNAME=mail.maill.qlu.edu.kg` 拼写错误未修（当前 SMTP 横幅显示正常，但建议改回 mail.qlu.edu.kg 后重建 postfix）
8. 服务器 3.8G 内存无 Swap，Docker 邮件栈空载约 375MB，高峰期偏紧，建议加 2G Swap
9. 激活码 CSV 导出文件含明文激活码（如 `/root/闲鱼分组激活码_20260903.csv`），外发注意保管
10. **网站 PHP 文件属主必须是 www:www（权限 640 即可）**，否则 PHP-FPM（以 www 用户运行）读不到文件会 403 "Access denied"；README.md、activate_data 归 root（600/700），不让 PHP 进程读写，仅 root 可读

## 九、已完成改动时间线

- **09-03 下午**：绑定域名 mail.qlu.edu.kg（Nginx 反代 /roundcube → 41443）；Roundcube 去 JesusMail 品牌（QLU Mail + 新 logo/favicon）；登录页加激活入口；激活页 v1（TXT 存储，一码一次）；抓取并实测 JesusMail API
- **09-03 傍晚**：关闭 8080 端口映射；重建容器后 SMTP 横幅恢复正常（mail.qlu.edu.kg）
- **09-03 晚**：左侧菜单删"关于"；激活码迁 MySQL（mail 库两张表，TXT 归档）；后台内嵌激活码管理页 v1（生成/删除/关联邮箱）
- **09-04 凌晨**：管理页改内嵌模式（不弹新页）；排序改 ID 升序；分组功能（生成带组/筛选/批量分组）；修复登录页激活链接 404（Roundcube 模板引擎路径改写坑）
- **09-04**：新增批量删除（含已使用）；配额 1GB→32MB；密码规则放宽（不再强制大写）；导出 CSV 功能；导出闲鱼分组 99 个码
- **09-04 重启排查**：发现重启 Docker 后 Roundcube 登录页激活入口、logo 被容器 entrypoint 的 `installto.sh` 用官方原版覆盖回滚，且后台密码被改为 `<REDACTED>` / `<REDACTED>`、账密登录接口加了验证码。修复：① 用永久 API_TOKEN（存于 postgres `bm_options`）替代账密登录；② 恢复 4 个皮肤文件并改为 compose **单文件只读 bind mount** 持久化，重启/重建不再丢失；③ 修复 PHP 文件属主误改导致 403 的问题
