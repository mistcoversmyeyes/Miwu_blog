---
title: "让 cc-switch 随 WSL2 自动启动：systemd 实战"
published: 2026-02-26
description: "记录使用 systemd 用户服务在 WSL2 中自动启动 GTK 应用的完整过程，包括 WSLg 环境变量配置和常见陷阱。"
image: ""
tags: ["WSL2","systemd","Linux","GUI","实战"]
draft: false
lang: ""
---

最近尝试了一个很有意思的小工具 [cc-switch](https://github.com/ryuuzake/cc-switch)，这是一个用 GTK 编写的 WSLg 应用，用于快速切换 Claude Code 等 AI 编程工具的模型供应商。由于 Openrouter 对于请求的字段校验非常的严格，配合 Claude Code 使用的时候经常出现 400 错误，我就只能配合 cc-switch 自己的本地代理服务功能，将 Openrouter 原生提供的 OpenAI 兼容接口转换为 Anthropic 兼容接口，这样就能正常使用了。

但是代理服务需要 cc-switch 一直在后台运行，最初我都是手动打开 cc-switch 来启动代理的。后来觉得麻烦，就想让它随 WSL2 自动启动。
听起来很简单？我一开始也这么以为。

## 背景：WSLg 应用的"不归路"

cc-switch 是一个典型的 WSLg 应用。WSLg（Windows Subsystem for Linux GUI）是微软为 WSL2 添加的图形界面支持，它允许 Linux 应用直接调用 Windows 的 Wayland/X11  compositor 来显示窗口。

但 WSLg 应用有个特点：它们和启动它们的终端会话绑在一起。一旦关掉终端，应用就跟着没了。这不是 cc-switch 的问题，而是所有 Linux 进程都面临的"不归路"。

## 初探：nohup 为何不行

我的第一反应是 `nohup`——这个老朋友不是用来让进程免疫 SIGHUP 信号的吗？

```bash
nohup cc-switch 2>&1 &
```

关掉终端，cc-switch 果然还在。关掉窗口进程并没有结束，这听起来挺好的，也符合 nohup 的预期。

然后我试着将它加入到 `~/zprofile` 中，让它每次登录到终端的时候启动这个工作。但是每次打开一个新的 WSL2 终端，都会启动一个新的 cc-switch 实例，这显然不是我想要的。
**分析一下原因：** 每个新的 wsl 终端都会登录一次，导致 `zprofile` 中的命令被执行多次。`nohup` 只是让进程不受 SIGHUP 信号影响，但它并没有解决多实例启动的问题。

## 转机：systemd 用户服务

既然用户态的 hack 不行，那就上系统级的方案。WSL2 从某个版本开始支持 systemd，这让事情有了转机。

 systemd 用户服务（user service）正好适合这种场景——不需要 root 权限，随用户会话启动，能管理进程生命周期。

先确认系统已经启用 systemd：

```bash
$ cat /etc/wsl.conf
[boot]
systemd=true
```

然后创建用户服务文件：

```bash
mkdir -p ~/.config/systemd/user
vim ~/.config/systemd/user/cc-switch.service
```

我最初的配置长这样：

```ini
[Unit]
Description=cc-switch
After=graphical-session.target

[Service]
ExecStart=/usr/bin/cc-switch
Environment=DISPLAY=:0
Environment=WAYLAND_DISPLAY=wayland-0
Restart=on-failure

[Install]
WantedBy=graphical-session.target
```

解释一下关键部分：

- `DISPLAY=:0` 和 `WAYLAND_DISPLAY=wayland-0`：WSLg 的显示环境变量，告诉 GTK 应用去哪里找图形服务器
- `graphical-session.target`：标准 Linux 桌面环境的图形会话目标
- `systemctl --user daemon-reload`：让 systemd 重新加载配置
- `systemctl --user enable cc-switch.service`：设置开机自启
- `systemctl --user start cc-switch.service`：立即启动

看起来万无一失？我重启了 WSL：`wsl --terminate Ubuntu`，然后重新进入。

```bash
$ systemctl --user status cc-switch
○ cc-switch.service - cc-switch
     Loaded: loaded (/home/yuming/.config/systemd/user/cc-switch.service; enabled; vendor preset: enabled)
     Active: inactive (dead)
```

**inactive (dead)**。

这也太难搞了。

## 坑点 1：graphical-session.target 的陷阱

问题出在 `graphical-session.target`。

在标准 Linux 桌面环境（GNOME、KDE 等）中，登录后会启动一个图形会话，systemd 会达到 `graphical-session.target`。但 WSL2 不一样——它**没有传统意义上的图形会话**。

WSLg 是独立的组件，它不负责通知 systemd "现在开始图形会话"了。所以 `graphical-session.target` 在 WSL2 里永远是 inactive 状态，依赖于它的服务自然也就不会启动。

解决方案是把 `graphical-session.target` 换成 `default.target`：

```ini
[Unit]
Description=cc-switch
After=default.target

[Service]
ExecStart=/usr/bin/cc-switch
Environment=DISPLAY=:0
Environment=WAYLAND_DISPLAY=wayland-0
Restart=on-failure

[Install]
WantedBy=default.target
```

`default.target` 是 systemd 的基本目标，在 WSL2 中一定会达到。重新加载、重启测试——cc-switch 终于自动启动了！

但还没完。

## 坑点 2：被忽略的环境变量

我打开 cc-switch，发现界面小得离谱。文字和图标都像被压缩过一样，显然没有应用我配置的缩放比例。

在 `.zshrc` 里，我设置了：

```bash
export GDK_DPI_SCALE=1.8
```

这是为了解决 WSLg 在高 DPI 显示器下的缩放问题。但从 systemd 启动的服务，**不会读取 `.zshrc`**。它有自己的环境变量空间。

得在 service 文件中显式声明：

```ini
[Unit]
Description=cc-switch
After=default.target

[Service]
ExecStart=/usr/bin/cc-switch
Environment=DISPLAY=:0
Environment=WAYLAND_DISPLAY=wayland-0
Environment=GDK_DPI_SCALE=1.8
Restart=on-failure

[Install]
WantedBy=default.target
```

重新加载服务，重启 WSL。

舒服了，现在非常的完美。

## 最终方案

总结一下完整的配置：

**`~/.config/systemd/user/cc-switch.service`**：

```ini
[Unit]
Description=cc-switch
After=default.target

[Service]
ExecStart=/usr/bin/cc-switch
Environment=DISPLAY=:0
Environment=WAYLAND_DISPLAY=wayland-0
Environment=GDK_DPI_SCALE=1.8
Restart=on-failure

[Install]
WantedBy=default.target
```

**常用命令**：

```bash
# 重新加载配置
systemctl --user daemon-reload

# 设置开机自启
systemctl --user enable cc-switch.service

# 立即启动
systemctl --user start cc-switch.service

# 查看状态
systemctl --user status cc-switch.service

# 停止
systemctl --user stop cc-switch.service
```

## 总结

这次踩坑让我对 WSL2 的特殊性有了更深的认识。它介于完整 Linux 桌面和轻量容器之间：有 systemd，但没有完整的图形会话；能跑 GUI 应用，但环境变量得手动管理。

几个要点：

1. **WSL2 用 `default.target`**，不是 `graphical-session.target`
2. **环境变量要在 service 文件里显式设置**，别指望它能自动读取 `.zshrc` 中的环境变量。
3. `nohup` 救不了 WSLg 应用，还是得靠 systemd

如果你是偶尔用用 WSL2，这些细节可能无关紧要。但如果你想把它当成主力开发环境，理解这些边界情况还是很有必要的。

通过这次尝试，我学习了 systemd 用户服务的配置方法，了解到了不同的 shell 配置文件的作用范围。对于如何在 Linux 服务器环境下配置稳定的后台服务也有了更深入的理解。希望这篇文章能帮到同样想在 WSL2 中自动启动某些进程的朋友们。

## 迭代记录
| 日期       | 版本 | 更新说明               |
| ---------- | ---- | ---------------------- |
| 2026-02-25 | v0.1 | 初始版本：创建文章骨架 |
| 2026-02-25 | v1.0 | 完成初稿               |
| 2026-02-26 | v1.1 | 补充 cc-switch 背景介绍和 zprofile 多实例问题分析 |