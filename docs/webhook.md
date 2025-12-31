---
sidebar_position: 6
---

# Webhook

Webhook 允许 Bubble 平台通过 HTTP POST 请求将事件推送到您的服务器。

## 配置 Webhook

1. 登录 Bubble 平台
2. 进入「机器人管理」
3. 找到「Webhook URL」设置
4. 输入您的接收地址（必须是 HTTPS）
5. 保存配置

## Webhook 请求格式

### 请求头

```http
POST /webhook HTTP/1.1
Host: your-server.com
Content-Type: application/json
X-Bubble-Event: MESSAGE_CREATE
X-Bubble-Signature: sha256=...
```

### 请求体

```json
{
  "type": "MESSAGE_CREATE",
  "data": {
    "id": 1001,
    "channelId": 5,
    "guildId": 10,
    "content": "Hello!",
    "author": {
      "id": 1,
      "name": "user"
    },
    "timestamp": "2025-12-31T12:00:00Z"
  }
}
```

## 接收示例

### Express (Node.js)

```javascript
const express = require('express');
const app = express();

app.use(express.json());

app.post('/webhook', (req, res) => {
  const eventType = req.headers['x-bubble-event'];
  const event = req.body;

  console.log(`收到事件: ${eventType}`);

  // 处理不同类型的事件
  switch (event.type) {
    case 'MESSAGE_CREATE':
      handleMessage(event.data);
      break;
    case 'GUILD_MEMBER_ADD':
      handleMemberJoin(event.data);
      break;
  }

  // 必须返回 200
  res.status(200).send('OK');
});

app.listen(3000);
```

### Flask (Python)

```python
from flask import Flask, request, jsonify

app = Flask(__name__)

@app.route('/webhook', methods=['POST'])
def webhook():
    event_type = request.headers.get('X-Bubble-Event')
    event = request.json

    print(f'收到事件: {event_type}')

    if event['type'] == 'MESSAGE_CREATE':
        handle_message(event['data'])

    return jsonify({'status': 'ok'}), 200

app.run(port=3000)
```

## 推送的事件类型

Webhook 会推送所有事件类型（无法选择性订阅）：

- MESSAGE_CREATE
- MESSAGE_UPDATE
- MESSAGE_DELETE
- DM_MESSAGE_CREATE
- DM_MESSAGE_UPDATE
- DM_MESSAGE_DELETE
- GUILD_MEMBER_ADD
- GUILD_MEMBER_REMOVE

完整列表请参考 [事件参考](./events.md)。

## 安全验证

### 签名验证（即将支持）

验证请求来自 Bubble 平台：

```javascript
const crypto = require('crypto');

function verifySignature(payload, signature, secret) {
  const hmac = crypto.createHmac('sha256', secret);
  const digest = 'sha256=' + hmac.update(payload).digest('hex');
  return crypto.timingSafeEqual(
    Buffer.from(signature),
    Buffer.from(digest)
  );
}

app.post('/webhook', (req, res) => {
  const signature = req.headers['x-bubble-signature'];
  const payload = JSON.stringify(req.body);
  
  if (!verifySignature(payload, signature, BOT_SECRET)) {
    return res.status(401).send('Invalid signature');
  }
  
  // 处理事件...
});
```

## 响应要求

- 必须在 **5 秒内**返回 HTTP 200
- 超时或返回错误状态码会触发重试（1s、5s、15s，最多 3 次）

## 最佳实践

### 异步处理

```javascript
app.post('/webhook', async (req, res) => {
  res.status(200).send('OK'); // 立即响应
  
  setImmediate(() => processEvent(req.body)); // 异步处理
});
```

### 幂等性处理

```javascript
const processedEvents = new Set();

function handleEvent(event) {
  const eventId = `${event.type}-${event.data.id}`;
  if (processedEvents.has(eventId)) return;
  
  processedEvents.add(eventId);
  // 处理事件...
}
```

## Webhook vs WebSocket

| 特性 | Webhook | WebSocket |
|------|---------|-----------|
| 连接方式 | 被动接收 | 主动连接 |
| 实时性 | 略有延迟 | 实时 |
| 事件订阅 | 接收所有事件 | 可选择订阅 |
| 服务器要求 | 需要公网地址 | 无需公网 |
| 适用场景 | 生产环境 | 开发测试 |

## 本地测试

使用 ngrok 等工具将本地服务暴露到公网：

```bash
ngrok http 3000
```

## 常见问题

**Q: 需要公网 IP 吗？**

A: 是的，Webhook URL 必须可以从公网访问。

**Q: 支持 HTTP 吗？**

A: 不支持，必须使用 HTTPS。

**Q: 如何过滤不需要的事件？**

A: 在服务器端根据 event.type 进行过滤。

**Q: 超时会怎样？**

A: 超过 5 秒未响应会触发重试。

更多信息请参考 [架构说明](./architecture.md)。
