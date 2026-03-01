---
title: "OpenClaw 服务部署"
published: 2026-03-01
description: "从云服务器选购到平台接入，完整记录 OpenClaw 服务的部署实战过程，包括安全加固、服务配置等关键步骤。"
image: ""
tags: ["实战","Linux","OpenClaw","部署"]
category: ""
draft: true
lang: ""
---

## 前言

如果你和我一样，想把 OpenClaw 跑在自己的云服务器上，并且希望后续配置可追踪、可回滚，这篇文章就是一份完整实战记录。

本文目标不是“最快跑起来”，而是“**先跑通 MVP，再做安全和可维护性收敛**”。

本文覆盖：

- 云服务器选购与资源判断
- Linux 基础安全加固
- OpenClaw 部署与常见报错修复
- Nginx + HTTPS 上线
- 平台/模型接入要点
- 本地配置同步与版本管理

---

## 云服务器选购

### 我的最终的选择

- 平台：DigitalOcean
- 规格：2 vCPU / 4GB RAM / 约 80GB 磁盘
- 域名托管：Cloudflare

原因很简单：先把 MVP 跑通，成本可控，DO 平台的文档和运维体验友好。

### 配置建议（按阶段）

- **仅网关 MVP**：2C4G + 4GB swap 可用
- **长期稳定 + 浏览器自动化**：建议 4C8G 起步

### 快速验收命令

```bash
nproc
free -h
df -h /
```

判断标准：

- `nproc >= 2`
- 可用内存足够（4GB 机型建议配 swap）
- 根分区剩余空间建议 > 20GB

---

## 云服务器基础安全加固

### 1) 系统更新 + 基础工具

```bash
sudo apt update && sudo apt -y upgrade
sudo apt -y install git curl ca-certificates gnupg lsb-release ufw htop jq
```

### 2) 为 2C4G 增加 4GB swap（关键）避免 OOM

```bash
sudo fallocate -l 4G /swapfile
sudo chmod 600 /swapfile
sudo mkswap /swapfile
sudo swapon /swapfile
echo '/swapfile none swap sw 0 0' | sudo tee -a /etc/fstab
echo 'vm.swappiness=10' | sudo tee /etc/sysctl.d/99-swappiness.conf
sudo sysctl --system
free -h
swapon --show
```

### 3) 修改防火墙规则，减少公网暴露面

```bash
sudo ufw allow OpenSSH
sudo ufw allow 80/tcp
sudo ufw allow 443/tcp
sudo ufw --force enable
sudo ufw status verbose
```

### 4) SSH 加固（放在最后）

!!! Warning 
    在进行如下操作之前，确认你的**ssh公钥已经存放于 VPS `.ssh` 目录中**，并且你有至少一个活跃的 SSH 会话在测试新配置。


`/etc/ssh/sshd_config` 推荐项：

```text
PasswordAuthentication no
KbdInteractiveAuthentication no
PermitRootLogin prohibit-password
```

应用：

```bash
sudo sshd -t && sudo systemctl reload sshd
```

!!! Warning 注意事项
    - 先改 SSH 再验证新会话，容易把自己锁死
    - 忘开 80/443，后面证书签发会失败
    - 4GB 机型不加 swap，容易后续启用浏览器自动化的时候发生 OOM 问题
    

---

## OpenClaw 服务部署

### 1) 拉取并初始化

```bash
curl -fsSL https://openclaw.ai/install.sh | bash
```

我在交互式配置中的策略是：

- 先走 QuickStart
- 先把渠道接入 `Skip for now`
- 先把网关和控制台跑通，再接平台

### 2) 启动与验证
启动 OpenClaw 网关：

```bash
openclaw gateway start
openclaw gateway status
```
TUI 验活：

```bash
openclaw tui
```

发一句“你好，回复 ok”即可验证模型链路是否通。

### 3) 我遇到的典型坑与解决


#### 坑 A：`gateway token missing`
现象：网页填写了变量名而不是真实 token，导致未授权。

查看真实 token：

```bash
openclaw config get gateway.auth.token
```

#### 坑 B：改了 token 但服务还在用旧 token
现象：`Config token differs from service token`

修复：

```bash
openclaw gateway install --force
openclaw gateway restart
```

#### 坑 C：认证命令报 `No provider plugins found`
现象：`openclaw models auth login` 报无插件。

先查插件：

```bash
openclaw plugins list
```

再启用对应 provider 插件后重试登录。

---

## HTTPS 反代上线（Nginx + Certbot）

### 1. 安装组件

```bash
sudo apt -y install nginx certbot python3-certbot-nginx
```

### 2. Nginx 配置

`/etc/nginx/sites-available/{your_domain}.com`：

```nginx
server {
    listen 80;
    server_name {your_domain}.com;

    location / {
        proxy_pass http://127.0.0.1:18789;
        proxy_http_version 1.1;
        proxy_set_header Host $host;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
    }
}
```

启用并重载：

```bash
sudo ln -sf /etc/nginx/sites-available/{your_domain}.com /etc/nginx/sites-enabled/{your_domain}.com
sudo nginx -t
sudo systemctl reload nginx
```

### 3. 证书签发（Cloudflare 先灰云）

```bash
sudo certbot --nginx -d {your_domain}.com --redirect -m <YOUR_EMAIL> --agree-tos --no-eff-email
```

验证：

```bash
curl -I https://{your_domain}.com
```

!!! warning 注意事项：
    - Cloudflare 开橙云直接签证书，容易失败（先灰云）
    - 直接暴露 18789 到公网，不必要地增加攻击面


---

## 接入聊天平台 (待实践)

我在部署阶段故意后置这一步，原因是先把基础设施打稳。

通用流程：

1. 查看可用插件  
2. 启用目标平台插件  
3. 完成 provider 认证  
4. 绑定到指定 agent  
5. 做端到端测试

示例命令：

```bash
openclaw plugins list
openclaw plugins enable <plugin-id>
openclaw models auth login --provider <provider-id>
openclaw models status --json
openclaw models auth order set --agent coding --provider <provider-id> <profile-id>
```

---

## 多 Agent 与模型管理

我新增了一个 `coding` agent，用于和 `main` 隔离职责。  
`agents.list` 在某些版本的 UI 中不能表单化编辑，需要 Raw 模式。

示例结构：

```json
"agents": {
  "defaults": {
    "model": { "primary": "bailian/qwen3.5-plus" }
  },
  "list": [
    { "id": "main", "default": true, "workspace": "/root/.openclaw/workspace" },
    { "id": "coding", "default": false, "workspace": "/root/.openclaw/workspace-coding" }
  ]
}
```

注意：  
如果 UI 提示 `Unsupported schema node. Use Raw mode.`，这是版本能力限制，不是你配错。

---

## 配置同步与版本管理（实战可用）

为了避免“云端改完忘记落地”，我做了：

- 使用 Unison 双向同步云端
- 本地保存 `.openclaw` 副本
- 本地 Git 管理配置变更

### Unison 安装

```bash
sudo apt -y install unison
``` 

### Unison 配置示例

`~/.unison/openclaw-live.prf`：

```text
root = /root/.openclaw                      # host 本地路径
root = ssh://digital-claw//root/.openclaw   # remote 服务器路径
# 只同步核心配置，避免日志等大文件
ignore = <Name of logs>
```

### 常用命令

```bash
# 日常双向
unison openclaw-live -batch

# 全量（建议停服务）
ssh digital-claw 'openclaw gateway stop'
unison openclaw-full -batch
ssh digital-claw 'openclaw gateway start'
```

### 冲突处理

出现 `conflict_on_*.json` 文件，代表该文件是远程和本地都有修改但不一致。需要手动对比内容，确认哪个版本是正确的，然后覆盖另一个版本。

!!! Note 
    更多 Unison 冲突处理的信息请参照官方文档。

!!! Warning 
    `openclaw.json` 含 token / API key，避免公开仓库明文提交。

---

## 后记

这次最大的经验不是“会用了某些工具/命令”，而是部署策略：

1. 先跑通 MVP（TUI 可对话、控制台可连）
2. 再做边界（防火墙、HTTPS、白名单、token）
3. 最后再扩展（多 agent、多平台、同步策略）

按这个顺序，遇到问题会好定位很多，也更容易回滚。

---

## 迭代记录

| 日期       | 版本   | 更新说明                              |
| ---------- | ------ | ------------------------------------- |
| 2026-03-01 | v0.1.0 | 初始化文章骨架                        |
| 2026-03-05 | v0.2.0 | 补充实战命令、踩坑修复与多 agent 配置 |
| 2026-03-10 | v0.3.0 | 补充配置同步章节，调整其他章节排版  |
