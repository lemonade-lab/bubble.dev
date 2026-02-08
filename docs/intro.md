---
sidebar_position: 1
---

# 简介

欢迎使用 Bubble 机器人开放平台！本文档将帮助您快速了解和使用 Bubble 的机器人 API。

## 什么是 Bubble？

Bubble 是一个现代化的即时通讯和社区平台，提供完整的机器人开发能力。通过 Bubble 机器人 API，您可以创建功能强大的自动化应用，为用户提供丰富的服务体验。

## 核心概念

### 机器人 (Bot)

机器人是 Bubble 平台上的自动化程序，拥有独立的用户身份（Bot User），可以：

- 发送和接收消息
- 管理频道和服务器内容
- 与用户进行私聊交互
- 响应特定事件和命令

### 服务器 (Guild)

服务器是 Bubble 的社区组织形式，包含多个频道和成员。机器人可以加入服务器并在其中提供服务。

### 频道 (Channel)

频道是服务器内的消息通道，机器人可以在频道中：

- 发送和接收消息
- 获取历史消息
- 管理消息内容

### 私聊线程 (DM Thread)

机器人可以与用户建立私聊对话，实现一对一的交互体验。

## 开发方式

Bubble 提供三种主要的开发方式：

### 1. WebSocket

通过 WebSocket 长连接实时接收平台事件。

### 2. Webhook

通过 HTTP 回调接收平台推送的事件。

### 3. HTTP API

主动调用 RESTful API 进行操作。

## API 版本

当前 API 版本：**v1**

- Base URL：`https://bubble.alemonjs.com/api/bot/v1`
- Gateway URL：`wss://bubble.alemonjs.com/api/bot/gateway`

## 认证方式

所有 API 请求都需要通过 Bot Token 进行认证：

```http
Authorization: Bearer YOUR_BOT_TOKEN
```
