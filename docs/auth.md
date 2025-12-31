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
curl -X GET https://bubble.alemonjs.com/api/robot/v1/bot/me \
  -H "Authorization: Bearer YOUR_BOT_TOKEN"
```

```javascript
const response = await fetch(
  'https://bubble.alemonjs.com/api/robot/v1/bot/me',
  {
    headers: {
      'Authorization': `Bearer ${BOT_TOKEN}`,
      'Content-Type': 'application/json'
    }
  }
);
```

### WebSocket

在建立 WebSocket 连接时，通过 Header 传递 Token：

```javascript
const ws = new WebSocket(
  'wss://bubble.alemonjs.com/api/bot/gateway',
  {
    headers: {
      'Authorization': `Bearer ${BOT_TOKEN}`
    }
  }
);
```

:::warning 重要
WebSocket Gateway 仅支持通过 Authorization Header 传递 Token，**不支持**：
- Query 参数（`?token=xxx`）
- WebSocket 子协议
:::

## Token 安全

### 存储建议

✅ **推荐做法：**

```javascript
// 使用环境变量
const BOT_TOKEN = process.env.BOT_TOKEN;

// 使用配置文件（不提交到版本控制）
const config = require('./config.json');
const BOT_TOKEN = config.botToken;

// 使用密钥管理服务
const BOT_TOKEN = await secretsManager.getSecret('BOT_TOKEN');
```

❌ **避免：**

```javascript
// ❌ 硬编码在代码中
const BOT_TOKEN = 'eyJhbGciOiJIUzI1N...';

// ❌ 提交到 Git 仓库
// config.json (committed to git)
{
  "botToken": "eyJhbGciOiJIUzI1N..."
}

// ❌ 暴露在客户端代码
<script>
const BOT_TOKEN = 'eyJhbGciOiJIUzI1N...';
</script>
```

### .gitignore 配置

确保敏感文件不被提交：

```gitignore
# Environment variables
.env
.env.local

# Config files with secrets
config.json
secrets.yml

# Token files
*.token
bot-token.txt
```

### 环境变量使用

```bash
# .env 文件
BOT_TOKEN=your_bot_token_here
API_BASE=https://bubble.alemonjs.com/api/robot/v1
```

```javascript
// 加载环境变量
require('dotenv').config();

const BOT_TOKEN = process.env.BOT_TOKEN;

if (!BOT_TOKEN) {
  throw new Error('BOT_TOKEN is required');
}
```

## Token 管理

### 获取 Token

1. 登录 Bubble 平台
2. 进入「机器人管理」
3. 点击机器人
4. 复制 Token

### 重置 Token

如果 Token 泄露，立即重置：

1. 进入机器人管理页面
2. 点击「重置 Token」
3. 确认操作
4. 更新所有使用旧 Token 的代码

:::danger Token 泄露后果
- 他人可以冒充您的机器人
- 可能发送垃圾消息
- 可能泄露用户数据
- 可能违反平台规则导致封禁
:::

### Token 轮换

建议定期轮换 Token（如每 90 天）：

```javascript
// 支持多个 Token 的过渡期
const TOKENS = [
  process.env.BOT_TOKEN_PRIMARY,
  process.env.BOT_TOKEN_SECONDARY
];

async function tryRequest(url, options) {
  for (const token of TOKENS) {
    try {
      const response = await fetch(url, {
        ...options,
        headers: {
          ...options.headers,
          'Authorization': `Bearer ${token}`
        }
      });
      
      if (response.status !== 401) {
        return response;
      }
    } catch (error) {
      continue;
    }
  }
  
  throw new Error('All tokens failed');
}
```

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

### 检查权限

发送消息前，确保机器人有相应权限：

```javascript
async function canSendMessage(guildId, channelId) {
  try {
    const channel = await getChannel(channelId);
    
    // 检查频道是否存在
    if (!channel) {
      return false;
    }
    
    // 检查是否在正确的服务器
    if (channel.guildId !== guildId) {
      return false;
    }
    
    return true;
  } catch (error) {
    console.error('权限检查失败:', error);
    return false;
  }
}
```

## 错误处理

### 认证错误

| HTTP 状态码 | 说明 | 处理建议 |
|-----------|------|---------|
| 401 | Token 无效或缺失 | 检查 Token 是否正确 |
| 403 | 权限不足 | 检查机器人权限 |
| 429 | 请求过多 | 实现速率限制 |

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
  });

  if (response.status === 401) {
    throw new Error('Token 无效，请检查配置');
  }

  if (response.status === 403) {
    throw new Error('权限不足');
  }

  if (response.status === 429) {
    const retryAfter = response.headers.get('Retry-After') || 60;
    throw new Error(`速率限制，请在 ${retryAfter} 秒后重试`);
  }

  if (!response.ok) {
    const error = await response.text();
    throw new Error(`API 错误: ${error}`);
  }

  return response.json();
}
```

## 安全最佳实践

### 1. 最小权限原则

只请求必要的权限，避免过度授权。

### 2. Token 隔离

不同环境使用不同的 Token：

```javascript
const BOT_TOKEN = process.env.NODE_ENV === 'production'
  ? process.env.BOT_TOKEN_PROD
  : process.env.BOT_TOKEN_DEV;
```

### 3. 日志脱敏

记录日志时隐藏敏感信息：

```javascript
function maskToken(token) {
  if (!token) return '';
  return token.slice(0, 10) + '***' + token.slice(-10);
}

console.log('使用 Token:', maskToken(BOT_TOKEN));
```

### 4. HTTPS Only

始终使用 HTTPS 传输敏感数据：

```javascript
const API_BASE = 'https://bubble.alemonjs.com/api/robot/v1';

// ❌ 不要使用 HTTP
// const API_BASE = 'http://bubble.alemonjs.com/api/robot/v1';
```

### 5. 定期审计

定期检查：
- Token 使用情况
- 异常请求日志
- 权限变更记录

## 调试技巧

### 验证 Token

```javascript
async function validateToken() {
  try {
    const response = await fetch(
      'https://bubble.alemonjs.com/api/robot/v1/bot/me',
      {
        headers: {
          'Authorization': `Bearer ${BOT_TOKEN}`
        }
      }
    );

    if (response.ok) {
      const bot = await response.json();
      console.log('✅ Token 有效，机器人:', bot.name);
      return true;
    } else {
      console.error('❌ Token 无效');
      return false;
    }
  } catch (error) {
    console.error('❌ 验证失败:', error);
    return false;
  }
}
```

### 检查权限

```javascript
async function checkPermissions() {
  try {
    const bot = await apiRequest(`${API_BASE}/bot/me`);
    console.log('机器人信息:', bot);
    console.log('Bot User ID:', bot.botUser?.id);
    console.log('Bot ID:', bot.id);
    return bot;
  } catch (error) {
    console.error('权限检查失败:', error);
    return null;
  }
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
