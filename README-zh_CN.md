<div align="center">
  <a name="readme-top"></a>
  <h1>JesusMail 📧</h1>
  <p><strong>适合邮箱分销场景的自托管邮件运营平台</strong></p>
  <p>版本 5.0.0</p>

[English](README.md) | 简体中文 | [日本語](README-ja.md) | [Türkçe](README-tr.md)
</div>

## JesusMail 是什么？

JesusMail 将邮件服务器、网页邮箱、邮箱管理、激活码交付和邮件营销能力整合在一个自托管系统中。它主要面向通过闲鱼、私域渠道或分销商销售托管邮箱的运营者，让管理员可以统一掌控邮箱创建、激活、到期、回收与售后支持流程。

## 主要功能

- 域名与邮箱管理
- 激活码创建、分组、导出、清除绑定和兑换
- 公开激活页面，可配置邮箱有效期
- 对指定邮箱进行安全的一键登录
- 邮箱回收站，默认保留 30 天
- 邮件营销、联系人、模板、投递统计和预热工具
- 集成 Roundcube 网页邮箱
- 基于 Docker Compose 部署 PostgreSQL、Redis、Postfix、Dovecot 和 Rspamd

## 分销流程

典型的邮箱分销流程如下：

1. 管理员在 JesusMail 后台创建一个或一批激活码。
2. 通过选定的销售渠道把激活码交付给客户。
3. 客户打开公开激活页，选择可用邮箱名和有效期，并使用激活码完成开通。
4. 管理员可在后台查看激活码绑定关系、邮箱来源和到期时间。
5. 用户可使用邮箱凭据登录；管理员在售后支持时可使用安全的一键登录。
6. 清除激活码绑定时，受影响邮箱通过回收站流程删除，激活码恢复为未使用状态。

## 环境要求

- 安装 Docker Engine 和 Docker Compose v2 的 Linux 服务器
- 可控制 DNS 的公网域名，并正确配置 MX、SPF、DKIM 和 DMARC
- 按部署需要开放邮件服务端口和管理端口
- 安装或升级生产环境前准备完整且可验证的备份

## 从已有源码目录安装

本定制版本不会在文档中写死公开仓库地址。请从授权渠道取得 JesusMail 源码，然后执行：

```shell
cd /path/to/JesusMail
cp env_init .env
# 启动前请逐项检查 .env。
docker compose up -d
```

也可以在检查安装脚本的配置和兼容行为后执行：

```shell
cd /path/to/JesusMail
bash install.sh
```

> 未完成数据库、配置文件和邮件数据备份前，不要直接更新生产环境。

## 管理命令

```shell
bm help          # 查看全部命令
bm default       # 查看后台访问信息
bm show-record   # 查看 DNS 记录要求
bm status        # 查看容器状态
bm restart       # 重启 JesusMail 服务
```

为保证已有部署能够安全升级，部分容器服务名、路径、数据库名和环境变量仍保留内部兼容标识。这些内容属于实现细节，不代表产品品牌。

## 网页邮箱

系统集成 Roundcube，通常可通过 `/roundcube/` 访问。JesusMail 可以签发短时、一次性登录票据，让已授权管理员打开指定邮箱，同时避免把邮箱密码放进浏览器 URL。

## 生产安全

修改生产环境前至少备份：

- PostgreSQL 一致性数据库转储
- Maildir 邮件数据
- Redis 及其他必要的持久化服务数据
- `.env`、Compose 文件和完整的 `conf/` 目录
- 反向代理与 TLS 配置
- 当前镜像 ID、标签和容器检查信息

没有完成恢复验证前，不要执行会删除卷或清理 Docker 数据的命令。

## 贡献与支持

提交问题或改动建议时，请使用本仓库的 Issue 与 Pull Request 模板。不要提交密码、激活码、API Token、私钥、客户邮箱地址或生产数据库内容。

## 许可证

JesusMail 使用 [GNU Affero General Public License v3.0](LICENSE) 发布。第三方组件继续遵循各自的许可证和声明。
