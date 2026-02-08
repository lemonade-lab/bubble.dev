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
const express = require('express')
const app = express()

app.use(express.json())

app.post('/webhook', (req, res) => {
  const eventType = req.headers['x-bubble-event']
  const event = req.body

  console.log(`收到事件: ${eventType}`)

  // 处理不同类型的事件
  switch (event.type) {
    case 'MESSAGE_CREATE':
      handleMessage(event.data)
      break
    case 'GUILD_MEMBER_ADD':
      handleMemberJoin(event.data)
      break
  }

  // 必须返回 200
  res.status(200).send('OK')
})

app.listen(3000)
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

完整列表请参考 [事件参考](./events.md)。

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
