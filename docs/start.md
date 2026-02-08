---
sidebar_position: 2
---

# 快速开始

本指南将帮助您快速创建并运行第一个 Bubble 机器人。

## 准备工作

在开始之前，您需要：

- 拥有 Bubble 账号
- 创建至少一个服务器 (Guild)
- 基本的编程知识（JavaScript、Python、Go 等）

## 步骤 1：创建机器人

### 1.1 访问开发者平台

登录 [Bubble](https://bubble.alemonjs.com/login) 后，进入「[开发者中心](https://bubble.alemonjs.com/developer/bot/1)」页面。

### 1.2 创建新机器人

点击「创建机器人」，填写基本信息：

- **机器人名称**：为您的机器人取一个独特的名字
- **描述**：（可选）简要说明机器人的功能

:::tip
每个开发者最多可创建 **3 个机器人**。
:::

### 1.3 获取 Bot Token

创建成功后，系统会为您生成一个 **Bot Token**。这是机器人访问 API 的凭证。

:::danger 安全警告

- **切勿**将 Token 提交到公开的代码仓库
- **切勿**在客户端代码中硬编码 Token
- 如果 Token 泄露，请立即在平台重置
  :::

```bash
# 示例 Token（请勿使用）
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJib3RJZCI6MTIzfQ...
```

### 1.4 邀请机器人到服务器

在机器人管理页面，使用「邀请到服务器」功能，将机器人添加到您的服务器。

## 步骤 2：编写第一个机器人

以下示例展示如何使用 WebSocket Gateway 创建一个简单的问答机器人。

### JavaScript

```javascript
import WebSocket from 'ws'

const BOT_TOKEN = 'YOUR_BOT_TOKEN'
const GATEWAY_URL =
  'wss://bubble.alemonjs.com/api/bot/gateway'
const API_BASE = 'https://bubble.alemonjs.com/api/bot/v1'

// 连接到 Gateway
const ws = new WebSocket(GATEWAY_URL, {
  headers: {
    Authorization: `Bearer ${BOT_TOKEN}`
  }
})

let heartbeatInterval

ws.on('open', () => {
  console.log('✅ 已连接到 Gateway')
})

ws.on('message', async data => {
  const msg = JSON.parse(data)

  // 处理 HELLO 消息，开始心跳
  if (msg.op === 10) {
    const interval = msg.d.heartbeat_interval || 30000
    heartbeatInterval = setInterval(() => {
      ws.send(JSON.stringify({ op: 1 }))
    }, interval)
    console.log(`💓 心跳已启动 (${interval}ms)`)
  }

  // 机器人就绪
  if (msg.op === 0 && msg.t === 'BOT_READY') {
    console.log('🤖 机器人已就绪')
    console.log('已加入的服务器:', msg.d.subscribedGuilds)

    // 订阅消息事件
    ws.send(
      JSON.stringify({
        op: 30,
        d: {
          events: ['MESSAGE_CREATE', 'DM_MESSAGE_CREATE']
        }
      })
    )
  }

  // 订阅成功
  if (msg.op === 0 && msg.t === 'EVENTS_SUBSCRIBED') {
    console.log('✅ 已订阅事件:', msg.d.subscribedEvents)
  }

  // 收到频道消息
  if (msg.op === 0 && msg.t === 'MESSAGE_CREATE') {
    const message = msg.d
    console.log(
      `📨 [频道 ${message.channelId}] ${message.author?.name}: ${message.content}`
    )

    // 简单的问答逻辑
    if (message.content === '你好') {
      await sendMessage(
        message.channelId,
        '你好！我是 Bubble 机器人 👋'
      )
    } else if (message.content === '/help') {
      await sendMessage(
        message.channelId,
        '我可以回复：\n- 你好\n- /help\n- /ping'
      )
    } else if (message.content === '/ping') {
      await sendMessage(message.channelId, 'Pong! 🏓')
    }
  }

  // 收到私聊消息
  if (msg.op === 0 && msg.t === 'DM_MESSAGE_CREATE') {
    const message = msg.d
    console.log(
      `💬 [私聊] ${message.author?.name}: ${message.content}`
    )
  }
})

// 发送消息函数
async function sendMessage(channelId, content) {
  try {
    const response = await fetch(
      `${API_BASE}/channels/${channelId}/messages`,
      {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${BOT_TOKEN}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          content: content,
          type: 'text'
        })
      }
    )

    if (response.ok) {
      console.log('✉️ 消息已发送')
    } else {
      const error = await response.text()
      console.error('❌ 发送失败:', error)
    }
  } catch (error) {
    console.error('❌ 网络错误:', error)
  }
}

ws.on('error', error => {
  console.error('❌ WebSocket 错误:', error)
})

ws.on('close', () => {
  console.log('🔌 连接已断开')
  if (heartbeatInterval) {
    clearInterval(heartbeatInterval)
  }
})
```

### Python

```python
import websocket
import json
import requests
import threading
import time

BOT_TOKEN = 'YOUR_BOT_TOKEN'
GATEWAY_URL = 'wss://bubble.alemonjs.com/api/bot/gateway'
API_BASE = 'https://bubble.alemonjs.com/api/bot/v1'

heartbeat_thread = None

def send_message(channel_id, content):
    """发送消息到频道"""
    url = f'{API_BASE}/channels/{channel_id}/messages'
    headers = {
        'Authorization': f'Bearer {BOT_TOKEN}',
        'Content-Type': 'application/json'
    }
    data = {'content': content, 'type': 'text'}

    try:
        response = requests.post(url, json=data, headers=headers)
        if response.status_code == 200:
            print('✉️ 消息已发送')
        else:
            print(f'❌ 发送失败: {response.text}')
    except Exception as e:
        print(f'❌ 网络错误: {e}')

def on_message(ws, message):
    """处理接收到的消息"""
    global heartbeat_thread

    msg = json.loads(message)

    # 处理 HELLO
    if msg.get('op') == 10:
        heartbeat_interval = msg['d'].get('heartbeat_interval', 30000) / 1000
        print(f'💓 心跳已启动 ({heartbeat_interval}s)')

        def heartbeat():
            while True:
                ws.send(json.dumps({'op': 1}))
                time.sleep(heartbeat_interval)

        heartbeat_thread = threading.Thread(target=heartbeat, daemon=True)
        heartbeat_thread.start()

    # 机器人就绪
    if msg.get('op') == 0 and msg.get('t') == 'BOT_READY':
        print('🤖 机器人已就绪')
        print(f'已加入的服务器: {len(msg["d"]["subscribedGuilds"])}')

        # 订阅事件
        ws.send(json.dumps({
            'op': 30,
            'd': {'events': ['MESSAGE_CREATE', 'DM_MESSAGE_CREATE']}
        }))

    # 订阅成功
    if msg.get('op') == 0 and msg.get('t') == 'EVENTS_SUBSCRIBED':
        print(f'✅ 已订阅事件: {msg["d"]["subscribedEvents"]}')

    # 收到消息
    if msg.get('op') == 0 and msg.get('t') == 'MESSAGE_CREATE':
        message_data = msg['d']
        content = message_data['content']
        channel_id = message_data['channelId']
        author = message_data.get('author', {}).get('name', 'Unknown')

        print(f'📨 [{author}]: {content}')

        # 简单的问答逻辑
        if content == '你好':
            send_message(channel_id, '你好！我是 Bubble 机器人 👋')
        elif content == '/help':
            send_message(channel_id, '我可以回复：\n- 你好\n- /help\n- /ping')
        elif content == '/ping':
            send_message(channel_id, 'Pong! 🏓')

def on_open(ws):
    """连接建立"""
    print('✅ 已连接到 Gateway')

def on_error(ws, error):
    """错误处理"""
    print(f'❌ 错误: {error}')

def on_close(ws, close_status_code, close_msg):
    """连接关闭"""
    print('🔌 连接已断开')

# 创建 WebSocket 连接
ws = websocket.WebSocketApp(
    GATEWAY_URL,
    header={'Authorization': f'Bearer {BOT_TOKEN}'},
    on_open=on_open,
    on_message=on_message,
    on_error=on_error,
    on_close=on_close
)

# 运行
ws.run_forever()
```

## 步骤 4：运行和测试

将代码中的 `YOUR_BOT_TOKEN` 替换为您的实际 Token

## 常见问题

### 连接失败

- **检查 Token** - 确保 Token 正确且未过期
- **检查网络** - 确认可以访问 bubble.alemonjs.com
- **查看日志** - 检查控制台的错误信息

### 收不到消息

- **确认已订阅** - 检查是否成功订阅了 `MESSAGE_CREATE` 事件
- **确认机器人已加入** - 确保机器人在目标服务器中
- **查看 BOT_READY** - 检查 BOT_READY 事件中的 subscribedGuilds

### 发送消息失败

- **检查权限** - 确认机器人有发送消息的权限
- **检查请求格式** - 确保 JSON 格式正确
- **查看响应** - 阅读错误响应了解失败原因
