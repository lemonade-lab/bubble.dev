---
sidebar_position: 9
---

# 事件参考

所有可以通过 WebSocket Gateway 或 Webhook 接收的事件类型。

## 事件订阅

- **WebSocket**: 需要手动订阅事件类型（参考 [Gateway](./gateway.md)）
- **Webhook**: 自动接收所有事件类型

## 事件结构

所有事件遵循统一格式：

```json
{
  "op": 0,
  "t": "MESSAGE_CREATE",
  "d": {
    // 事件数据
  }
}
```

- `op`: OpCode，事件分发固定为 `0`
- `t`: 事件类型
- `d`: 事件数据

## 消息事件

### MESSAGE_CREATE

频道新消息。

**事件数据**:

```json
{
  "id": 1001,
  "channelId": 123,
  "guildId": 10,
  "content": "Hello, world!",
  "msgType": 0,
  "author": {
    "id": 1,
    "name": "username",
    "avatar": "https://..."
  },
  "timestamp": "2025-12-31T12:00:00Z",
  "mentions": [456],
  "mentionRoles": [100]
}
```

### MESSAGE_UPDATE

消息被编辑。

**事件数据**:

```json
{
  "id": 1001,
  "channelId": 123,
  "content": "Updated content",
  "editedTimestamp": "2025-12-31T12:10:00Z"
}
```

### MESSAGE_DELETE

消息被删除。

**事件数据**:

```json
{
  "id": 1001,
  "channelId": 123,
  "guildId": 10
}
```

## 私信事件

### DM_MESSAGE_CREATE

私信新消息。

**事件数据**:

```json
{
  "id": 2001,
  "channelId": 456,
  "content": "Private message",
  "author": {
    "id": 1,
    "name": "username",
    "avatar": "https://..."
  },
  "timestamp": "2025-12-31T12:00:00Z"
}
```

### DM_MESSAGE_UPDATE

私信被编辑。

**事件数据**: 同 MESSAGE_UPDATE

### DM_MESSAGE_DELETE

私信被删除。

**事件数据**: 同 MESSAGE_DELETE

## 成员事件

### GUILD_MEMBER_ADD

新成员加入服务器。

**事件数据**:

```json
{
  "guildId": 10,
  "user": {
    "id": 999,
    "name": "newuser",
    "avatar": "https://..."
  },
  "joinedAt": "2025-12-31T12:00:00Z"
}
```

### GUILD_MEMBER_UPDATE

成员信息更新（昵称、角色等）。

**事件数据**:

```json
{
  "guildId": 10,
  "user": {
    "id": 1,
    "name": "username"
  },
  "roles": [100, 101],
  "nick": "New Nickname"
}
```

### GUILD_MEMBER_REMOVE

成员离开或被踢出服务器。

**事件数据**:

```json
{
  "guildId": 10,
  "user": {
    "id": 1,
    "name": "username"
  }
}
```

## 频道事件

### CHANNEL_CREATE

新频道创建。

**事件数据**:

```json
{
  "id": 789,
  "guildId": 10,
  "name": "new-channel",
  "type": 0,
  "position": 5
}
```

### CHANNEL_UPDATE

频道信息更新。

**事件数据**: 同 CHANNEL_CREATE

### CHANNEL_DELETE

频道被删除。

**事件数据**:

```json
{
  "id": 789,
  "guildId": 10
}
```

## 服务器事件

### GUILD_CREATE

机器人加入新服务器或服务器信息初始化。

**事件数据**:

```json
{
  "id": 10,
  "name": "My Server",
  "ownerId": 1,
  "channels": [{ "id": 123, "name": "general" }],
  "members": [{ "user": { "id": 1, "name": "owner" } }]
}
```

### GUILD_UPDATE

服务器信息更新。

**事件数据**: 同 GUILD_CREATE（部分字段）

### GUILD_DELETE

机器人被移除或服务器被删除。

**事件数据**:

```json
{
  "id": 10
}
```

## 角色事件

### GUILD_ROLE_CREATE

新角色创建。

**事件数据**:

```json
{
  "guildId": 10,
  "role": {
    "id": 100,
    "name": "Moderator",
    "color": "#3498db",
    "permissions": 8
  }
}
```

### GUILD_ROLE_UPDATE

角色更新。

**事件数据**: 同 GUILD_ROLE_CREATE

### GUILD_ROLE_DELETE

角色删除。

**事件数据**:

```json
{
  "guildId": 10,
  "roleId": 100
}
```

## 特殊事件

### BOT_READY

机器人连接成功并准备就绪（仅 WebSocket）。

**事件数据**:

```json
{
  "bot": {
    "id": 123,
    "name": "MyBot"
  },
  "guilds": [{ "id": 10, "name": "Server 1" }]
}
```

## 事件订阅示例

### 订阅单个事件

```javascript
ws.send(
  JSON.stringify({
    op: 30, // Subscribe
    d: {
      event_types: ['MESSAGE_CREATE']
    }
  })
)
```

### 订阅多个事件

```javascript
ws.send(
  JSON.stringify({
    op: 30,
    d: {
      event_types: [
        'MESSAGE_CREATE',
        'MESSAGE_UPDATE',
        'MESSAGE_DELETE',
        'GUILD_MEMBER_ADD'
      ]
    }
  })
)
```

### 取消订阅

```javascript
ws.send(
  JSON.stringify({
    op: 31, // Unsubscribe
    d: {
      event_types: ['MESSAGE_DELETE']
    }
  })
)
```
