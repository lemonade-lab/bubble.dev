---
sidebar_position: 4
---

# 认证与鉴权

本文档详细说明 Bubble 机器人 API 的认证方式和安全最佳实践。

## 认证方式

所有 API 请求（HTTP 和 WebSocket）都需要通过 Bot Token 进行认证。

### Bot Token

Bot Token 是机器人的访问凭证，格式为 JWT（JSON Web Token）。

**生成方式：**

1. 登录 Bubble 平台
2. 进入「机器人管理」
3. 创建或选择机器人
4. 复制显示的 Bot Token

**Token 格式：**

```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib3RJZCI6MTIzLCJpYXQiOjE3MDk3MzI0MDB9.signature
```

## 使用 Token

### HTTP API 请求

在所有 HTTP API 请求的 Header 中添加：

```http
Authorization: Bearer YOUR_BOT_TOKEN
Content-Type: application/json
```

**示例：**

```bash
curl -X GET https://bubble.alemonjs.com/api/bot/v1/me \
  -H "Authorization: Bearer YOUR_BOT_TOKEN"
```

```javascript
const response = await fetch(
  'https://bubble.alemonjs.com/api/bot/v1/me',
  {
    headers: {
      'Authorization': `Bearer ${BOT_TOKEN}`,
      'Content-Type': 'application/json'
    }
  }
)
```

### WebSocket

在建立 WebSocket 连接时，通过 Header 传递 Token：

```javascript
const ws = new WebSocket(
  'wss://bubble.alemonjs.com/api/bot/gateway',
  {
    headers: {
      Authorization: `Bearer ${BOT_TOKEN}`
    }
  }
)
```

:::warning 重要
WebSocket Gateway 仅支持通过 Authorization Header 传递 Token，**不支持**：

- Query 参数（`?token=xxx`）
- WebSocket 子协议
  :::

## 权限验证

### Bot User 身份

每个机器人都关联一个 Bot User：

```json
{
  "id": 123,
  "name": "bot_我的机器人",
  "isBot": true
}
```

机器人的权限取决于 Bot User 在服务器中的角色和权限。

## 错误处理

### 认证错误

| HTTP 状态码 | 说明             | 处理建议            |
| ----------- | ---------------- | ------------------- |
| 401         | Token 无效或缺失 | 检查 Token 是否正确 |
| 403         | 权限不足         | 检查机器人权限      |
| 429         | 请求过多         | 实现速率限制        |

### 错误响应示例

```json
{
  "error": "unauthorized",
  "message": "invalid bot token"
}
```

### 处理代码示例

```javascript
async function apiRequest(url, options = {}) {
  const response = await fetch(url, {
    ...options,
    headers: {
      'Authorization': `Bearer ${BOT_TOKEN}`,
      'Content-Type': 'application/json',
      ...options.headers
    }
  })

  if (response.status === 401) {
    throw new Error('Token 无效，请检查配置')
  }

  if (response.status === 403) {
    throw new Error('权限不足')
  }

  if (response.status === 429) {
    const retryAfter =
      response.headers.get('Retry-After') || 60
    throw new Error(`速率限制，请在 ${retryAfter} 秒后重试`)
  }

  if (!response.ok) {
    const error = await response.text()
    throw new Error(`API 错误: ${error}`)
  }

  return response.json()
}
```

## 常见问题

### Q: Token 会过期吗？

A: 目前 Token 不会自动过期，但建议定期轮换以提高安全性。

### Q: 可以多个程序共用同一个 Token 吗？

A: 可以，但不推荐。建议为不同环境创建不同的机器人。

### Q: Token 泄露后有什么影响？

A: 他人可以完全控制您的机器人，包括发送消息、访问数据等。请立即重置。

### Q: 如何限制 Token 的使用范围？

A: 目前 Token 拥有机器人的全部权限，无法细分。请在应用层实现权限控制。
