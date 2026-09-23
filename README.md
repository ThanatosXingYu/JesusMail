<div align="center">
  <a name="readme-top"></a>
  <h1>JesusMail 📧</h1>
  <p><strong>面向邮箱分销场景的自托管邮件运营与分发平台</strong></p>
  <p>版本 5.0.0</p>

简体中文 | [English](README-en.md) | [日本語](README-ja.md) | [Türkçe](README-tr.md)
</div>

---

## 目录

- [JesusMail 是什么](#jesusmail-是什么)
- [主要功能](#主要功能)
- [目录结构](#目录结构)
- [技术栈](#技术栈)
- [激活码开通永久邮箱流程](#激活码开通永久邮箱流程)
- [邮箱回收站机制](#邮箱回收站机制)
- [一键登录票据安全设计](#一键登录票据安全设计)
- [环境变量说明](#环境变量说明)
- [部署步骤](#部署步骤)
- [域名与 IP 后台的访问分工](#域名与-ip-后台的访问分工)
- [管理命令](#管理命令)
- [数据迁移说明](#数据迁移说明)
- [生产安全](#生产安全)
- [常见问题 FAQ](#常见问题-faq)
- [贡献与支持](#贡献与支持)
- [许可证](#许可证)

---

## JesusMail 是什么？

JesusMail 是一套自托管的邮件运营与邮箱分发平台，把邮件服务器、网页邮箱、邮箱管理后台、激活码交付和邮件营销能力整合在同一个系统里。它主要面向通过电商平台、私域渠道或分销商销售托管邮箱的运营者：管理员在后台统一创建激活码、交付客户、查看绑定关系与来源、处理售后，同时完整掌握邮箱的开通、到期、回收与数据。

### 主要功能

- **域名与邮箱管理**：域名开关、MX/SPF/DKIM/DMARC 记录查看、邮箱增删改查、配额与启用状态管理
- **激活码体系**：激活码创建、分组、导出、清除绑定、状态总览与明细查询
- **公开激活页面**：客户无需登录后台，打开 `/activate` 即可用激活码开通邮箱
- **永久邮箱**：通过激活码开通的邮箱默认为永久有效，不设置到期时间
- **一键登录**：管理员可签发短时一次性票据，安全进入指定用户的网页邮箱
- **回收站**：删除的邮箱进入回收站，固定保留 30 天（`RecycleRetention`），可还原或彻底删除
- **邮件营销**：邮件营销活动、联系人管理、模板、投递统计与预热工具
- **网页邮箱**：集成 Roundcube，通常通过 `/roundcube/` 访问
- **容器化部署**：Docker Compose 一键编排 PostgreSQL、Redis、Postfix、Dovecot、Rspamd

---

## 目录结构

```text
JesusMail/
├── core/                          # 后端与前端主工程
│   ├── internal/
│   │   ├── cmd/                   # 程序入口、路由注册、中间件
│   │   ├── controller/            # HTTP 处理器（按业务域分目录）
│   │   ├── service/               # 业务逻辑（mail_boxes / activation 等）
│   │   ├── dao/                   # 数据访问层
│   │   └── model/entity/          # ORM 实体定义
│   ├── api/                       # API 路由与请求/响应结构定义
│   ├── frontend/
│   │   └── src/
│   │       ├── views/             # 页面组件（activate / mailbox / login 等）
│   │       ├── components/        # 可复用 UI 组件
│   │       ├── store/             # Pinia 状态管理
│   │       ├── api/modules/       # API 客户端
│   │       ├── router/            # Vue Router 模块
│   │       ├── hooks/             # 组合式函数
│   │       ├── utils/             # 工具函数
│   │       ├── features/          # 特性相关组件
│   │       └── i18n/              # 多语言（en / zh_CN / ja / tr）
│   ├── template/                  # 邮件模板
│   ├── manifest/                  # 应用配置与部署资源
│   └── public/dist/               # 前端构建产物（提交进 git，部署时使用）
├── conf/                          # Postfix、Dovecot、Rspamd、Redis、Webmail 配置
├── Dockerfiles/                   # 各服务容器定义
├── docs/                          # 文档（反向代理、数据迁移等）
│   └── migrations/                # 数据库迁移脚本（含回滚）
├── private-baseline/              # 已文档化的生产基线快照（可维护）
├── bm.sh                          # 管理命令入口
├── install.sh / update.sh         # 安装 / 更新脚本
├── docker-compose.yml             # 服务编排
└── env_init                       # 环境变量模板（复制为 .env 后填写）
```

> 说明：部分容器服务名、路径、数据库名、模块名和环境变量仍保留内部兼容标识（如 `billionmail`），这是为了保证已有部署可安全升级。它们属于实现细节，不代表产品品牌。

---

## 技术栈

| 层 | 技术 |
|---|---|
| 后端 | Go 1.22+、GoFrame v2 |
| 数据库 | PostgreSQL |
| 缓存 | Redis |
| 前端 | Vue 3、TypeScript、Pinia、Naive UI、UnoCSS、Vitest |
| 邮件服务 | Postfix、Dovecot、Rspamd |
| 网页邮箱 | Roundcube |
| 部署 | Docker Compose |

---

## 激活码开通永久邮箱流程

典型的邮箱分销流程：

1. **创建激活码**：管理员在后台「激活码」页面创建一个或一批激活码，可指定分组、备注。
2. **交付激活码**：通过选定的销售渠道（电商、私域、分销商）把激活码发给客户。
3. **客户自助开通**：客户打开公开激活页 `https://你的域名/activate`，填写：
   - 激活密钥（激活码）
   - 邮箱前缀（3-30 位小写字母、数字或 `. _ -`，不能以符号开头结尾）
   - 登录密码（8-64 位，须同时包含字母和数字）
4. **确认开通**：点击「立即开通邮箱」，系统校验激活码未被使用且域名已启用后，创建邮箱。
5. **永久有效**：激活成功后邮箱立即生效，**永久有效、不会过期**（`expires_at` 为空）。
6. **登录使用**：客户通过页面底部的「用户登录」按钮或 `https://你的域名/roundcube/` 进入网页邮箱。
7. **售后支持**：管理员可在后台查看该激活码的绑定邮箱、使用 IP、时间，并可使用「一键登录」进入该邮箱协助排障。

> 清除激活码绑定时，受影响邮箱会通过回收站流程删除，激活码恢复为未使用状态，可再次发放。

---

## 邮箱回收站机制

- **进入回收站**：在后台删除邮箱（包括清除激活码绑定）时，邮箱不会被直接抹掉，而是进入回收站流程。
- **自动清理**：系统每分钟由定时任务 `archiveExpiredMailboxes` 检查，将已到期且仍处于启用状态的邮箱归档进回收站；回收站保留期由代码中的 `RecycleRetention` 规定为 30 天。
- **保留期内**：可在后台「回收站」页面还原邮箱，或手动彻底删除。
- **过期后**：回收站数据按保留策略清理，邮件数据随之移除。
- **注意**：一旦邮箱已被归档/清出回收站，仅修改 `mailbox` 表的到期时间无法让它复活，需要从回收站还原。

---

## 一键登录票据安全设计

一键登录（管理员进入用户网页邮箱）使用**短时、一次性、服务端票据**，URL 中绝不出现邮箱明文密码：

1. 管理员在后台点击「一键登录」，后端生成 32 字节随机票据 ID；
2. 票据 ID 的 SHA-256 哈希存入 Redis，**有效期为 60 秒**；
3. 票据通过 URL 传给 Roundcube，Roundcube 用后端接口消费票据；
4. 消费使用 Lua 脚本保证 `GET` + `DEL` 原子操作，**只能使用一次**；
5. Redis 中只保存哈希值，即使 Redis 泄露也无法反推票据。

---

## 环境变量说明

复制 `env_init` 为 `.env` 后逐项填写。除基础项外，与本项目激活/一键登录相关的关键变量：

| 变量 | 说明 |
|---|---|
| `ADMIN_USERNAME` / `ADMIN_PASSWORD` | 后台管理员初始账号密码 |
| `SafePath` | 后台安全路径（控制台登录入口的路径段） |
| `BILLIONMAIL_HOSTNAME` | 邮件服务主机名 |
| `DBNAME` / `DBUSER` / `DBPASS` | PostgreSQL 数据库名、用户、密码 |
| `REDISPASS` | Redis 密码 |
| `HTTP_PORT` / `HTTPS_PORT` | 对外 HTTP / HTTPS 端口 |
| `RETENTION_DAYS` | 其他数据的保留天数（模板默认 7）；邮箱回收站使用代码中的 `RecycleRetention`（30 天） |
| `IPV4_NETWORK` | 内网网段 |
| `IP_WHITELIST_ENABLE` | 是否启用 IP 白名单 |
| `JESUSMAIL_ACTIVATION_DOMAIN` | 激活域名（旧名 `JESSUSMAIL_ACTIVATION_DOMAIN` 仍兼容） |
| `JESUSMAIL_ACTIVATION_QUOTA` | 激活邮箱默认配额（字节，默认 32 MB） |
| `JESUSMAIL_ROUNDCUBE_SSO_SECRET` | 一键登录票据签名密钥（旧名 `JESSUSMAIL_ROUNDCUBE_SSO_SECRET` 仍兼容） |
| `JESUSMAIL_ROUNDCUBE_SSO_CORE_URL` | 票据消费接口地址 |

> 新名与旧名（`JESUSMAIL_*` / `JESSUSMAIL_*`）同时支持，兼容历史部署。

---

## 部署步骤

### 方式一：Docker Compose

```shell
cd /path/to/JesusMail
cp env_init .env
# 逐项检查并填写 .env（尤其是域名、密码、端口）
docker compose config --no-interpolate --quiet   # 校验编排文件
docker compose up -d
```

### 方式二：安装脚本

```shell
cd /path/to/JesusMail
bash install.sh
```

> 升级或更新生产环境前，务必先完成可验证的数据库、配置和邮件数据备份，且不要直接在生产环境滚动未验证过的版本。

### 前端产物同步

前端在容器内构建完成后，需把构建产物同步到 `core/public/dist` 并提交进 git，部署时直接使用：

```shell
cd core/frontend
npm run build
node build-for-git.js    # 同步 dist 到 core/public/dist
```

---

## 域名与 IP 后台的访问分工

生产环境推荐这样划分访问入口（以 `mail.qlu.edu.kg` 为例，实际替换为你的域名）：

| 入口 | 用途 | 说明 |
|---|---|---|
| `https://IP:41443/` | **管理员后台** | 完整管理控制台，含 SafePath 登录；建议仅管理员使用 |
| `https://域名/activate` | **客户激活页** | 公开激活入口，无需登录后台 |
| `https://域名/roundcube/` | **用户网页邮箱** | 客户登录自己的邮箱 |
| `https://域名/public/activation/*` | 激活接口 | 供激活页调用（激活 / 获取配置） |

**重要说明**：

- **域名下不开放管理后台登录入口**（nginx 不透出 `/login`）。需要使用后台时，请直接通过 `https://IP:41443/` 访问，并输入 `.env` 中的 `SafePath`。
- 激活页需要nginx 透出 `/activate`、`/static/`、`/public/activation/*`（以及 `/api/public/activation/*`）；生产构建的激活页会请求不带 `/api` 前缀的 `/public/activation/...`，**两个前缀都要反代**，否则激活会 404。
- 域名下打开后台后「不跳转、功能异常」通常是访问了不透出的路径导致的，属预期行为，请改用 IP 端口访问后台。

宝塔 nginx 部署中的实际激活路由在 `nginx/extension/mail.qlu.edu.kg/jesusmail-native-activation.conf`；更新该扩展文件，不要在主站重复定义 `location`。仓库的 `private-baseline/server-config/nginx/mail.qlu.edu.kg.conf` 是主站历史参考快照（现已移除与扩展文件重复的激活路由），**不可直接覆盖线上主站配置**；先检查现网配置、备份，再逐项合并和执行 `nginx -t`。完整反向代理说明见 [`docs/REVERSE_PROXY.md`](docs/REVERSE_PROXY.md)。

---

## 管理命令

`bm` 是对常用运维操作的封装（`bm.sh`）：

```shell
bm help          # 查看全部可用命令
bm default       # 查看后台访问信息（地址、账号、SafePath）
bm show-record   # 查看需要配置的 DNS 记录
bm status        # 查看容器运行状态
bm restart       # 重启 JesusMail 相关服务
```

---

## 数据迁移说明

### 激活邮箱永久化迁移（2026-09-23）

自本版本起，通过激活码开通的邮箱一律**永久有效**。为了把历史数据中所有来源的有限期邮箱一并修正为永久，提供了迁移脚本：

```text
docs/migrations/20260923-permanent-activation-mailboxes.sql
```

脚本特性：

- **安全备份**：先把受影响行备份到 `mailbox_expires_at_migration_20260923` 表，任何时候可回滚；
- **覆盖所有有限期邮箱**：按本次要求处理 `mailbox.expires_at IS NOT NULL` 的所有来源，不区分 activation、manual、batch、import、legacy；执行前应先完成数据库备份；
- **幂等**：可重复执行，不会重复备份或重复更新；
- **带回滚**：文件末尾附带回滚 SQL（注释形式）。

执行方式（在数据库容器内或通过 psql）：

```shell
# 1. 先做好完整备份
# 2. 执行迁移
psql -U billionmail -d billionmail -f docs/migrations/20260923-permanent-activation-mailboxes.sql
```

脚本默认已经覆盖所有来源的有限期邮箱；如需只迁移激活来源，请先在测试库增加 `source_type = 'activation'` 条件并验证。

---

## 生产安全

修改生产环境前，至少备份：

- PostgreSQL 一致性数据库转储
- Maildir 邮件数据
- Redis 及其他必要的持久化服务数据
- `.env`、Compose 文件和完整的 `conf/` 目录
- 反向代理与 TLS 配置
- 当前镜像 ID、标签和容器检查信息

未完成恢复验证前，不要执行会删除卷或清理 Docker 数据的命令。替换镜像 / 迁移数据 / 变更邮件生命周期前，先做一次可验证备份，并只滚动替换受影响的服务。

---

## 常见问题 FAQ

**Q：激活页能打开，但点「立即开通邮箱」提示 404？**
A：检查 nginx 是否透出了 `/public/activation/activate` 与 `/public/activation/config`（以及带 `/api` 前缀的同名路径）。生产构建的激活页请求的是不带 `/api` 前缀的地址。

**Q：域名下能打开激活页，但登录后台异常/不跳转？**
A：域名侧刻意不开放管理后台入口。请改用 `https://IP:41443/` 访问后台，并输入 SafePath。

**Q：激活成功的邮箱会过期吗？**
A：不会。激活开通的邮箱为永久有效，`expires_at` 为空。如需给历史邮箱改成永久，执行数据迁移脚本。

**Q：一键登录链接能给别人用吗？**
A：不能。票据 60 秒过期且只能消费一次，且与签名密钥绑定，请勿外传。

**Q：删除的邮箱怎么找回？**
A：在回收站保留期内（默认 30 天）可从后台还原；一旦已被彻底清理则无法恢复。

**Q：页面图标不显示 / 按钮挤在一起？**
A：请确认部署的是最新构建的 `core/public/dist`（图标规则与布局样式依赖该产物）。

---

## 贡献与支持

提交问题或改动建议时，请使用本仓库的 Issue 与 Pull Request 模板。不要提交密码、激活码、API Token、私钥、客户邮箱地址或生产数据库内容。

## 许可证

JesusMail 使用 [GNU Affero General Public License v3.0](LICENSE) 发布。第三方组件继续遵循各自的许可证和声明。
