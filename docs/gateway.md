---
sidebar_position: 5
---

# WebSocket

WebSocket Gateway 提供实时双向通信能力，让机器人能够即时接收平台事件。

## 连接地址

```
wss://bubble.alemonjs.com/api/bot/gateway
```

## 连接流程

### 1. 建立连接

使用 Bot Token 通过 Authorization Header 连接：

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

### 2. 接收 HELLO

连接成功后会收到 OpHello (op=10) 消息：

```json
{
  "op": 10,
  "d": {
    "heartbeat_interval": 30000
  }
}
```

### 3. 发送心跳

根据 `heartbeat_interval` 定期发送心跳：

```javascript
setInterval(() => {
  ws.send(JSON.stringify({ op: 1 }));
}, 30000);
```

### 4. 接收 BOT_READY

机器人就绪事件包含已订阅的资源和可用事件：

```json
{
  "op": 0,
  "t": "BOT_READY",
  "d": {
    "bot": {
      "id": 1,
      "name": "我的机器人",
      "botUser": { "id": 123, "name": "bot_我的机器人" }
    },
    "subscribedGuilds": [...],
    "subscribedDMs": [...],
    "availableEvents": [...]
  }
}
```

### 5. 订阅事件类型

使用 OpSubscribe (op=30) 订阅感兴趣的事件：

```javascript
ws.send(JSON.stringify({
  op: 30,
  d: {
    events: ['MESSAGE_CREATE', 'DM_MESSAGE_CREATE', 'GUILD_MEMBER_ADD']
  }
}));
```

### 6. 接收事件

订阅成功后，会收到 EVENTS_SUBSCRIBED 确认：

```json
{
  "op": 0,
  "t": "EVENTS_SUBSCRIBED",
  "d": {
    "subscribedEvents": ["MESSAGE_CREATE", "DM_MESSAGE_CREATE"],
    "invalidEvents": []
  }
}
```

之后即可接收订阅的事件：

```json
{
  "op": 0,
  "t": "MESSAGE_CREATE",
  "d": {
    "id": 1001,
    "channelId": 5,
    "content": "Hello Bot!",
    "author": { "id": 1, "name": "user" }
  }
}
```

## OpCode 参考

| OpCode | 名称 | 方向 | 说明 |
|--------|------|------|------|
| 0 | OpDispatch | 服务端→客户端 | 事件分发 |
| 1 | OpHeartbeat | 双向 | 心跳保活 |
| 10 | OpHello | 服务端→客户端 | 握手成功，包含心跳间隔 |
| 11 | OpHeartbeatAck | 服务端→客户端 | 心跳响应 |
| 30 | OpSubscribe | 客户端→服务端 | 订阅事件类型或资源 |
| 31 | OpUnsubscribe | 客户端→服务端 | 取消订阅事件类型 |

## 订阅机制

### 自动订阅（资源）

机器人连接后，系统会**自动订阅**：
- 所有已加入服务器的频道
- 所有私聊线程

这意味着机器人无需手动订阅频道，即可接收这些资源的事件。

### 手动订阅（事件类型）

机器人需要**主动订阅**感兴趣的事件类型：

```javascript
// 订阅消息事件
ws.send(JSON.stringify({
  op: 30,
  d: { events: ['MESSAGE_CREATE', 'MESSAGE_UPDATE', 'MESSAGE_DELETE'] }
}));

// 订阅成员事件
ws.send(JSON.stringify({
  op: 30,
  d: { events: ['GUILD_MEMBER_ADD', 'GUILD_MEMBER_REMOVE'] }
}));
```

### 取消订阅

```javascript
ws.send(JSON.stringify({
  op: 31,
  d: { events: ['MESSAGE_UPDATE'] }
}));
```

## 事件过滤

机器人只会接收满足以下条件的事件：

1. **已订阅资源**（频道/私聊）
2. **已订阅事件类型**

示例：
- ✅ 已订阅 MESSAGE_CREATE + 在已加入的频道 → 接收事件
- ❌ 已订阅 MESSAGE_CREATE + 不在该频道 → **不**接收事件
- ❌ 未订阅 MESSAGE_UPDATE + 在已加入的频道 → **不**接收事件

## 完整示例

```javascript
import WebSocket from 'ws';

const BOT_TOKEN = process.env.BOT_TOKEN;
const GATEWAY_URL = 'wss://bubble.alemonjs.com/api/bot/gateway';

function connect() {
  const ws = new WebSocket(GATEWAY_URL, {
    headers: { 'Authorization': `Bearer ${BOT_TOKEN}` }
  });

  let heartbeatInterval;

  ws.on('open', () => {
    console.log('✅ 已连接');
  });

  ws.on('message', (data) => {
    const msg = JSON.parse(data);

    // HELLO - 启动心跳
    if (msg.op === 10) {
      const interval = msg.d.heartbeat_interval || 30000;
      heartbeatInterval = setInterval(() => {
        ws.send(JSON.stringify({ op: 1 }));
      }, interval);
      console.log(`💓 心跳已启动 (${interval}ms)`);
    }

    // BOT_READY - 订阅事件
    if (msg.op === 0 && msg.t === 'BOT_READY') {
      console.log('🤖 机器人已就绪');
      console.log('服务器:', msg.d.subscribedGuilds?.length);
      console.log('私聊:', msg.d.subscribedDMs?.length);
      
      // 订阅感兴趣的事件
      ws.send(JSON.stringify({
        op: 30,
        d: {
          events: [
            'MESSAGE_CREATE',
            'MESSAGE_UPDATE',
            'MESSAGE_DELETE',
            'DM_MESSAGE_CREATE',
            'GUILD_MEMBER_ADD'
          ]
        }
      }));
    }

    // EVENTS_SUBSCRIBED - 订阅成功
    if (msg.op === 0 && msg.t === 'EVENTS_SUBSCRIBED') {
      console.log('✅ 已订阅:', msg.d.subscribedEvents);
    }

    // MESSAGE_CREATE - 频道消息
    if (msg.op === 0 && msg.t === 'MESSAGE_CREATE') {
      console.log('📨 新消息:', msg.d.content);
    }

    // DM_MESSAGE_CREATE - 私聊消息
    if (msg.op === 0 && msg.t === 'DM_MESSAGE_CREATE') {
      console.log('💬 私聊:', msg.d.content);
    }

    // GUILD_MEMBER_ADD - 成员加入
    if (msg.op === 0 && msg.t === 'GUILD_MEMBER_ADD') {
      console.log('👋 新成员加入:', msg.d.user?.name);
    }
  });

  ws.on('error', (error) => {
    console.error('❌ 错误:', error);
  });

  ws.on('close', () => {
    console.log('🔌 连接关闭');
    if (heartbeatInterval) {
      clearInterval(heartbeatInterval);
    }
    
    // 5秒后重连
    setTimeout(() => {
      console.log('🔄 重新连接...');
      connect();
    }, 5000);
  });
}

connect();
```

## 速率限制

WebSocket 消息受以下限制：

- **速率**：10 次/秒
- **突发**：最多 20 条消息
- **心跳**：不计入限制

超过限制会导致连接被关闭。

## 心跳机制

### 发送心跳

```javascript
setInterval(() => {
  ws.send(JSON.stringify({ op: 1 }));
}, heartbeatInterval);
```

### 接收 ACK

服务器会响应 OpHeartbeatAck (op=11)：

```json
{
  "op": 11
}
```

### 超时处理

如果心跳超时（默认 60 秒），服务器会主动断开连接。

## 重连策略

建议实现指数退避重连：

```javascript
let reconnectDelay = 1000;
const maxDelay = 60000;

function connect() {
  const ws = new WebSocket(/* ... */);

  ws.on('close', () => {
    setTimeout(() => {
      reconnectDelay = Math.min(reconnectDelay * 2, maxDelay);
      connect();
    }, reconnectDelay);
  });

  ws.on('open', () => {
    reconnectDelay = 1000; // 重置延迟
  });
}
```

## 注意事项

:::tip 自动订阅
机器人连接后会自动订阅所有频道和私聊，无需手动调用 OpSubscribe 订阅资源。
:::

:::warning 事件订阅
必须手动订阅事件类型（如 MESSAGE_CREATE），否则不会收到任何事件。
:::

:::danger 心跳超时
必须按时发送心跳，否则连接会被服务器关闭。
:::

## 调试技巧

### 日志记录

```javascript
ws.on('message', (data) => {
  const msg = JSON.parse(data);
  console.log('[收到]', JSON.stringify(msg, null, 2));
});

ws.on('send', (data) => {
  console.log('[发送]', data);
});
```

### 验证订阅

检查 BOT_READY 事件中的数据：

```javascript
if (msg.t === 'BOT_READY') {
  console.log('已加入服务器:', msg.d.subscribedGuilds);
  console.log('可用事件:', msg.d.availableEvents);
}
```

## 常见问题

**Q: 为什么收不到消息事件？**

A: 检查是否已订阅 MESSAGE_CREATE 事件类型。

**Q: 可以订阅特定频道的消息吗？**

A: 可以，但资源订阅已自动完成，您只需订阅事件类型即可。

**Q: 重连后需要重新订阅吗？**

A: 是的，重连后需要重新订阅事件类型。

**Q: 如何减少不需要的事件？**

A: 只订阅需要的事件类型，避免订阅所有事件。

更多事件类型请参考 [事件参考](./events.md)。
