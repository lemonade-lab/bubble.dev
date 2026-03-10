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

## 可订阅事件一览

| 事件类型                  | 分类     | 说明              |
| ------------------------- | -------- | ----------------- |
| `MESSAGE_CREATE`          | 频道消息 | 新消息            |
| `MESSAGE_UPDATE`          | 频道消息 | 消息编辑          |
| `MESSAGE_DELETE`          | 频道消息 | 消息删除          |
| `MESSAGE_PIN`             | 频道消息 | 消息设为精华      |
| `MESSAGE_UNPIN`           | 频道消息 | 取消精华          |
| `MESSAGE_REACTION_ADD`    | 频道消息 | 添加表态          |
| `MESSAGE_REACTION_REMOVE` | 频道消息 | 移除表态          |
| `DM_MESSAGE_CREATE`       | 私聊消息 | 新私聊消息        |
| `DM_MESSAGE_UPDATE`       | 私聊消息 | 私聊消息编辑      |
| `DM_MESSAGE_DELETE`       | 私聊消息 | 私聊消息删除      |
| `DM_MESSAGE_PIN`          | 私聊消息 | 私聊设为精华      |
| `DM_MESSAGE_UNPIN`        | 私聊消息 | 私聊取消精华      |
| `GUILD_MEMBER_ADD`        | 成员     | 新成员加入        |
| `GUILD_MEMBER_UPDATE`     | 成员     | 成员信息变更      |
| `GUILD_MEMBER_REMOVE`     | 成员     | 成员离开/被踢     |
| `MENTION_CREATE`          | 通知     | 被 @mention       |
| `READ_STATE_UPDATE`       | 通知     | 红点/未读状态变更 |
| `APPLICATION_CREATE`      | 申请     | 新申请            |
| `APPLICATION_UPDATE`      | 申请     | 申请状态变更      |
| `NOTICE_CREATE`           | 通知     | 新通知            |
| `NOTICE_UPDATE`           | 通知     | 通知更新          |
| `APPLY_CREATE`            | 申请     | 新申请（别名）    |
| `APPLY_UPDATE`            | 申请     | 申请更新（别名）  |
| `GROUP_MESSAGE_CREATE`    | 群聊     | 群聊新消息        |
| `GROUP_MESSAGE_UPDATE`    | 群聊     | 群聊消息编辑      |
| `GROUP_MESSAGE_DELETE`    | 群聊     | 群聊消息删除      |
| `GROUP_MESSAGE_PIN`       | 群聊     | 群聊精华          |
| `GROUP_MESSAGE_UNPIN`     | 群聊     | 群聊取消精华      |
| `GROUP_THREAD_UPDATE`     | 群聊     | 群聊线程更新      |
| `GROUP_MEMBER_ADD`        | 群聊     | 群成员加入        |
| `GROUP_MEMBER_REMOVE`     | 群聊     | 群成员离开        |

---

## 频道消息事件

### MESSAGE_CREATE

频道新消息。

**事件数据**:

```json
{
  "id": 1001,
  "channelId": 123,
  "authorId": 1,
  "author": "username",
  "content": "Hello, world!",
  "type": "text",
  "platform": "web",
  "mentions": [
    {
      "type": "user",
      "id": 42,
      "name": "张三",
      "avatar": "avatar/xxx.jpg"
    }
  ],
  "replyToId": null,
  "createdAt": "2025-12-31T12:00:00Z"
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
  "mentions": [],
  "editedAt": "2025-12-31T12:10:00Z"
}
```

### MESSAGE_DELETE

消息被删除/撤回。

**事件数据**:

```json
{
  "id": 1001,
  "channelId": 123,
  "deleted": true
}
```

### MESSAGE_PIN

消息被设为精华。

**事件数据**:

```json
{
  "id": 1001,
  "channelId": 123
}
```

### MESSAGE_UNPIN

消息取消精华。

**事件数据**: 同 `MESSAGE_PIN`

### MESSAGE_REACTION_ADD

消息被添加表态。

**事件数据**:

```json
{
  "messageId": 1001,
  "channelId": 123,
  "userId": 1,
  "emoji": "👍",
  "user": {
    "id": 1,
    "name": "username",
    "avatar": "avatar/xxx.jpg"
  }
}
```

### MESSAGE_REACTION_REMOVE

表态被移除。

**事件数据**:

```json
{
  "messageId": 1001,
  "channelId": 123,
  "userId": 1,
  "emoji": "👍"
}
```

---

## 私信事件

### DM_MESSAGE_CREATE

私信新消息。

**事件数据**:

```json
{
  "id": 2001,
  "threadId": 456,
  "authorId": 1,
  "content": "Private message",
  "type": "text",
  "createdAt": "2025-12-31T12:00:00Z"
}
```

### DM_MESSAGE_UPDATE

私信被编辑。

**事件数据**: 同 `MESSAGE_UPDATE`（字段为 `threadId` 而非 `channelId`）

### DM_MESSAGE_DELETE

私信被删除。

**事件数据**: 同 `MESSAGE_DELETE`（字段为 `threadId`）

### DM_MESSAGE_PIN

私信设为精华。

**事件数据**:

```json
{
  "id": 2001,
  "threadId": 456
}
```

### DM_MESSAGE_UNPIN

私信取消精华。

**事件数据**: 同 `DM_MESSAGE_PIN`

---

## 成员事件

### GUILD_MEMBER_ADD

新成员加入服务器。

**事件数据**:

```json
{
  "guildId": 10,
  "userId": 999,
  "user": {
    "id": 999,
    "name": "newuser",
    "avatar": "avatar/xxx.jpg"
  },
  "joinedAt": "2025-12-31T12:00:00Z"
}
```

### GUILD_MEMBER_UPDATE

成员信息更新（昵称、角色、禁言/解禁等）。

**事件数据**:

```json
{
  "guildId": 10,
  "userId": 1,
  "action": "nickname",
  "nickname": "New Nickname",
  "operatorId": 456
}
```

`action` 可能的值：

- `nickname` — 昵称变更
- `unmuted` — 解除禁言
- `roles_added` — 分配角色（附带 `roleId`）
- `roles_removed` — 移除角色（附带 `roleId`）

### GUILD_MEMBER_REMOVE

成员离开或被踢出服务器。

**事件数据**:

```json
{
  "guildId": 10,
  "userId": 1,
  "operatorId": 456
}
```

---

## 通知事件

### READ_STATE_UPDATE

未读状态/红点变更。

**事件数据**:

```json
{
  "type": "channel",
  "id": 123,
  "lastReadMessageId": 1000,
  "unreadCount": 5,
  "mentionCount": 1
}
```

`type` 可选值：`channel` | `guild` | `dm`

### MENTION_CREATE

被 @mention 通知。

**事件数据**:

```json
{
  "channelId": 123,
  "messageId": 1001,
  "authorId": 1
}
```

---

## 特殊事件（不可订阅，自动接收）

### BOT_READY

机器人连接成功并准备就绪（仅 WebSocket）。

**事件数据**:

```json
{
  "bot": {
    "id": 123,
    "name": "我的机器人",
    "botUser": { "id": 456, "name": "bot_我的机器人" }
  },
  "subscribedGuilds": [{ "id": 10, "name": "Server 1" }],
  "subscribedDMs": [],
  "availableEvents": [
    "MESSAGE_CREATE",
    "MESSAGE_UPDATE",
    "..."
  ]
}
```

### EVENTS_SUBSCRIBED

事件订阅成功确认。

**事件数据**:

```json
{
  "subscribedEvents": [
    "MESSAGE_CREATE",
    "DM_MESSAGE_CREATE"
  ],
  "invalidEvents": []
}
```

### EVENTS_UNSUBSCRIBED

事件取消订阅确认。

**事件数据**:

```json
{
  "unsubscribedEvents": ["MESSAGE_DELETE"]
}
```

---

## 事件订阅示例

### 订阅消息和成员事件

```javascript
ws.send(
  JSON.stringify({
    op: 30,
    d: {
      events: [
        'MESSAGE_CREATE',
        'MESSAGE_UPDATE',
        'MESSAGE_DELETE',
        'MESSAGE_REACTION_ADD',
        'MESSAGE_REACTION_REMOVE',
        'DM_MESSAGE_CREATE',
        'GUILD_MEMBER_ADD',
        'GUILD_MEMBER_REMOVE',
        'READ_STATE_UPDATE'
      ]
    }
  })
)
```

### 取消订阅

```javascript
ws.send(
  JSON.stringify({
    op: 31,
    d: {
      events: ['MESSAGE_DELETE']
    }
  })
)
```
