---
sidebar_position: 7
---

# API 参考

完整的 REST API 接口文档。

## 基础信息

**Base URL**:

```
https://bubble.alemonjs.com/api/bot/v1
```

**Base File URL**:

```
https://bubble-oss-files.alemonjs.com
```

**认证方式**: `Authorization: Bearer YOUR_BOT_TOKEN`

**请求头**:

```http
Content-Type: application/json
Authorization: Bearer YOUR_BOT_TOKEN
```

---

## 机器人信息

### 获取机器人信息

```
GET /me
```

**响应示例**:

```json
{
  "id": 123,
  "botUser": {
    "id": 456,
    "name": "bot_MyBot",
    "avatar": "avatar/avatar/xxx.jpg"
  },
  "robotId": 123,
  "ownerId": 1,
  "verified": true
}
```

---

## 消息管理

### 发送频道消息

```
POST /channels/:channelId/messages
```

**路径参数**:

| 参数      | 类型   | 说明    |
| --------- | ------ | ------- |
| channelId | number | 频道 ID |

**请求体**:

```json
{
  "content": "Hello <@42> 你好！",
  "type": "text",
  "replyToId": 1000,
  "notify_mentions": false,
  "embed": {},
  "attachments": [
    {
      "path": "guild-chat-files/xxx.png",
      "url": "guild-chat-files/xxx.png",
      "contentType": "image/png",
      "size": 102400,
      "filename": "image.png",
      "width": 800,
      "height": 600
    }
  ]
}
```

**请求体字段说明**:

| 字段            | 类型    | 必填 | 说明                                                                     |
| --------------- | ------- | ---- | ------------------------------------------------------------------------ |
| content         | string  | 是   | 消息内容，支持 [Markdown](./markdown.md) 和 mention 简写                 |
| type            | string  | 否   | 消息类型：`text`(默认), `image`, `voice`, `file`；不传时根据附件自动推断 |
| replyToId       | number  | 否   | 回复的消息 ID                                                            |
| notify_mentions | boolean | 否   | 是否触发 @mention 通知（红点），默认 `false`                             |
| embed           | object  | 否   | 扩展字段                                                                 |
| attachments     | array   | 否   | 附件列表（需先通过 `/files/upload` 上传获取 path）                       |

:::info Mention 简写格式
消息内容支持以下简写，后端会自动解析并替换为可读文本：

- `<@用户ID>` → @用户名（无效 ID 会被移除）
- `<#频道ID>` → #频道名（无效 ID 会被移除）
- `<@everyone>` → @全体成员
  :::

**响应示例**:

```json
{
  "id": 1001,
  "channelId": 123,
  "content": "Hello @张三 你好！",
  "author": "bot_MyBot",
  "authorId": 456,
  "type": "text",
  "mentions": [
    {
      "type": "user",
      "id": 42,
      "name": "张三",
      "avatar": "avatar/xxx.jpg"
    }
  ],
  "createdAt": "2025-12-31T12:00:00Z"
}
```

### 获取频道消息列表

```
GET /channels/:channelId/messages
```

**路径参数**:

| 参数      | 类型   | 说明    |
| --------- | ------ | ------- |
| channelId | number | 频道 ID |

**查询参数**:

| 参数   | 类型   | 必填 | 说明                        |
| ------ | ------ | ---- | --------------------------- |
| before | number | 否   | 获取此消息 ID 之前的消息    |
| after  | number | 否   | 获取此消息 ID 之后的消息    |
| limit  | number | 否   | 返回数量，默认 50，最大 100 |

**响应示例**:

```json
{
  "messages": [
    {
      "id": 1001,
      "channelId": 123,
      "content": "Hello!",
      "createdAt": "2025-12-31T12:00:00Z"
    }
  ],
  "hasMore": true
}
```

### 获取单条消息

```
GET /channels/:channelId/messages/:messageId
```

**路径参数**:

| 参数      | 类型   | 说明    |
| --------- | ------ | ------- |
| channelId | number | 频道 ID |
| messageId | number | 消息 ID |

**响应示例**:

```json
{
  "id": 1001,
  "channelId": 123,
  "authorId": 456,
  "author": "bot_MyBot",
  "content": "Hello!",
  "type": "text",
  "mentions": [],
  "createdAt": "2025-12-31T12:00:00Z"
}
```

### 编辑频道消息

```
PUT /channels/:channelId/messages/:messageId
```

**路径参数**:

| 参数      | 类型   | 说明    |
| --------- | ------ | ------- |
| channelId | number | 频道 ID |
| messageId | number | 消息 ID |

**请求体**:

```json
{
  "content": "Updated message content"
}
```

**响应**: 编辑后的消息对象

### 删除频道消息

```
DELETE /channels/:channelId/messages/:messageId
```

**路径参数**:

| 参数      | 类型   | 说明    |
| --------- | ------ | ------- |
| channelId | number | 频道 ID |
| messageId | number | 消息 ID |

**响应**: `204 No Content`

### 批量删除频道消息

```
POST /channels/:channelId/messages/batch-delete
```

**路径参数**:

| 参数      | 类型   | 说明    |
| --------- | ------ | ------- |
| channelId | number | 频道 ID |

**请求体**:

```json
{
  "messageIds": [1001, 1002, 1003]
}
```

> 单次最多 100 条

**响应示例**:

```json
{
  "succeeded": [1001, 1002],
  "failed": [{ "messageId": 1003, "error": "权限不足" }]
}
```

---

## 表态 (Reactions)

### 获取消息表态

```
GET /channels/:channelId/messages/:messageId/reactions
```

**路径参数**:

| 参数      | 类型   | 说明    |
| --------- | ------ | ------- |
| channelId | number | 频道 ID |
| messageId | number | 消息 ID |

**响应示例**:

```json
[
  { "emoji": "👍", "count": 3, "users": [1, 2, 3] },
  { "emoji": "❤️", "count": 1, "users": [1] }
]
```

### 添加表态

```
PUT /channels/:channelId/messages/:messageId/reactions/:emoji
```

**路径参数**:

| 参数      | 类型   | 说明                      |
| --------- | ------ | ------------------------- |
| channelId | number | 频道 ID                   |
| messageId | number | 消息 ID                   |
| emoji     | string | Emoji 字符（需 URL 编码） |

**响应**: 表态对象

**触发事件**: `MESSAGE_REACTION_ADD`

### 移除表态

```
DELETE /channels/:channelId/messages/:messageId/reactions/:emoji
```

**路径参数**:

| 参数      | 类型   | 说明                      |
| --------- | ------ | ------------------------- |
| channelId | number | 频道 ID                   |
| messageId | number | 消息 ID                   |
| emoji     | string | Emoji 字符（需 URL 编码） |

**响应**: `204 No Content`

**触发事件**: `MESSAGE_REACTION_REMOVE`

---

## 精华消息 (Pins)

### 获取精华消息列表

```
GET /channels/:channelId/pins
```

**路径参数**:

| 参数      | 类型   | 说明    |
| --------- | ------ | ------- |
| channelId | number | 频道 ID |

**响应**: 精华消息数组

### 设为精华消息

```
POST /channels/:channelId/pins
```

**路径参数**:

| 参数      | 类型   | 说明    |
| --------- | ------ | ------- |
| channelId | number | 频道 ID |

**请求体**:

```json
{
  "messageId": 1001
}
```

**响应**: 精华消息对象

**触发事件**: `MESSAGE_PIN`

### 取消精华

```
DELETE /channels/:channelId/pins/:messageId
```

**路径参数**:

| 参数      | 类型   | 说明    |
| --------- | ------ | ------- |
| channelId | number | 频道 ID |
| messageId | number | 消息 ID |

**响应**: `204 No Content`

**触发事件**: `MESSAGE_UNPIN`

---

## 频道管理

### 获取频道列表

```
GET /guilds/:guildId/channels
```

**路径参数**:

| 参数    | 类型   | 说明      |
| ------- | ------ | --------- |
| guildId | number | 服务器 ID |

**响应示例**:

```json
[
  {
    "id": 123,
    "guildId": 10,
    "name": "general",
    "type": "text",
    "categoryId": 1,
    "sortOrder": 0
  }
]
```

### 获取频道详情

```
GET /channels/:channelId
```

**路径参数**:

| 参数      | 类型   | 说明    |
| --------- | ------ | ------- |
| channelId | number | 频道 ID |

**响应示例**:

```json
{
  "id": 123,
  "guildId": 10,
  "name": "general",
  "type": "text",
  "categoryId": 1,
  "sortOrder": 0,
  "createdAt": "2025-01-01T00:00:00Z"
}
```

### 创建频道

```
POST /guilds/:guildId/channels
```

**路径参数**:

| 参数    | 类型   | 说明      |
| ------- | ------ | --------- |
| guildId | number | 服务器 ID |

**请求体**:

```json
{
  "name": "new-channel",
  "type": "text",
  "parentId": 0,
  "categoryId": 1
}
```

| 字段       | 类型   | 必填 | 说明                                     |
| ---------- | ------ | ---- | ---------------------------------------- |
| name       | string | 是   | 频道名称                                 |
| type       | string | 否   | 频道类型：`text`(默认), `media`, `forum` |
| parentId   | number | 否   | 父频道 ID                                |
| categoryId | number | 否   | 所属分类 ID                              |

**权限**: 需要 `MANAGE_CHANNELS`

**响应**: 创建的频道对象

### 更新频道信息

```
PUT /channels/:channelId/settings
```

**路径参数**:

| 参数      | 类型   | 说明    |
| --------- | ------ | ------- |
| channelId | number | 频道 ID |

**请求体**（所有字段可选）:

```json
{
  "name": "renamed-channel",
  "banner": "guild-chat-files/banner.png"
}
```

**响应**: `{ "success": true }`

### 删除频道

```
DELETE /channels/:channelId
```

**路径参数**:

| 参数      | 类型   | 说明    |
| --------- | ------ | ------- |
| channelId | number | 频道 ID |

**响应**: `204 No Content`

---

## 频道分类

### 获取频道分类列表

```
GET /guilds/:guildId/channel-categories
```

**路径参数**:

| 参数    | 类型   | 说明      |
| ------- | ------ | --------- |
| guildId | number | 服务器 ID |

**响应**: 分类数组

### 创建频道分类

```
POST /guilds/:guildId/channel-categories
```

**路径参数**:

| 参数    | 类型   | 说明      |
| ------- | ------ | --------- |
| guildId | number | 服务器 ID |

**请求体**:

```json
{
  "name": "游戏频道"
}
```

**响应**: 创建的分类对象

### 更新频道分类

```
PUT /guilds/:guildId/channel-categories/:categoryId
```

**路径参数**:

| 参数       | 类型   | 说明      |
| ---------- | ------ | --------- |
| guildId    | number | 服务器 ID |
| categoryId | number | 分类 ID   |

**请求体**:

```json
{
  "name": "新名称"
}
```

**响应**: 更新后的分类对象

### 删除频道分类

```
DELETE /guilds/:guildId/channel-categories/:categoryId
```

**路径参数**:

| 参数       | 类型   | 说明      |
| ---------- | ------ | --------- |
| guildId    | number | 服务器 ID |
| categoryId | number | 分类 ID   |

**响应**: `204 No Content`

---

## 成员管理

### 获取成员列表

```
GET /guilds/:guildId/members
```

**路径参数**:

| 参数    | 类型   | 说明      |
| ------- | ------ | --------- |
| guildId | number | 服务器 ID |

**查询参数**:

| 参数  | 类型   | 必填 | 说明                          |
| ----- | ------ | ---- | ----------------------------- |
| after | number | 否   | 从此用户 ID 之后开始          |
| limit | number | 否   | 返回数量，默认 100，最大 1000 |

**响应示例**:

```json
{
  "members": [
    {
      "user": {
        "id": 1,
        "name": "user1",
        "avatar": "avatar/avatar/xxx.jpg"
      },
      "joinedAt": "2025-01-01T00:00:00Z"
    }
  ],
  "hasMore": false
}
```

### 获取成员信息

```
GET /guilds/:guildId/members/:userId
```

**路径参数**:

| 参数    | 类型   | 说明      |
| ------- | ------ | --------- |
| guildId | number | 服务器 ID |
| userId  | number | 用户 ID   |

**响应示例**:

```json
{
  "user": {
    "id": 1,
    "name": "user1",
    "avatar": "avatar/avatar/xxx.jpg"
  },
  "roles": [100, 101],
  "joinedAt": "2025-01-01T00:00:00Z"
}
```

### 踢出成员

```
DELETE /guilds/:guildId/members/:userId
```

**路径参数**:

| 参数    | 类型   | 说明      |
| ------- | ------ | --------- |
| guildId | number | 服务器 ID |
| userId  | number | 用户 ID   |

**响应**: `{ "success": true }`

**触发事件**: `GUILD_MEMBER_REMOVE`

### 禁言成员

```
PUT /guilds/:guildId/members/:userId/mute
```

**路径参数**:

| 参数    | 类型   | 说明      |
| ------- | ------ | --------- |
| guildId | number | 服务器 ID |
| userId  | number | 用户 ID   |

**请求体**:

```json
{
  "duration": 3600
}
```

| 字段     | 类型   | 必填 | 说明                       |
| -------- | ------ | ---- | -------------------------- |
| duration | number | 是   | 禁言时长（秒），必须为正数 |

**响应**: `{ "success": true }`

### 解除禁言

```
DELETE /guilds/:guildId/members/:userId/mute
```

**路径参数**:

| 参数    | 类型   | 说明      |
| ------- | ------ | --------- |
| guildId | number | 服务器 ID |
| userId  | number | 用户 ID   |

**响应**: `{ "success": true }`

**触发事件**: `GUILD_MEMBER_UPDATE`

### 设置成员昵称

```
PUT /guilds/:guildId/members/:userId/nickname
```

**路径参数**:

| 参数    | 类型   | 说明      |
| ------- | ------ | --------- |
| guildId | number | 服务器 ID |
| userId  | number | 用户 ID   |

**请求体**:

```json
{
  "nickname": "新昵称"
}
```

| 字段     | 类型   | 必填 | 说明                                   |
| -------- | ------ | ---- | -------------------------------------- |
| nickname | string | 是   | 昵称，最多 32 字符；空字符串可清除昵称 |

**响应**: `{ "success": true }`

**触发事件**: `GUILD_MEMBER_UPDATE`

---

## 角色管理

### 获取角色列表

```
GET /guilds/:guildId/roles
```

**路径参数**:

| 参数    | 类型   | 说明      |
| ------- | ------ | --------- |
| guildId | number | 服务器 ID |

**响应**: 角色数组

### 创建角色

```
POST /guilds/:guildId/roles
```

**路径参数**:

| 参数    | 类型   | 说明      |
| ------- | ------ | --------- |
| guildId | number | 服务器 ID |

**请求体**:

```json
{
  "name": "Moderator",
  "permissions": 8,
  "color": "#3498db"
}
```

| 字段        | 类型   | 必填 | 说明       |
| ----------- | ------ | ---- | ---------- |
| name        | string | 是   | 角色名称   |
| permissions | number | 否   | 权限位掩码 |
| color       | string | 否   | 颜色值     |

**响应**: 创建的角色对象

### 更新角色

```
PUT /guilds/:guildId/roles/:roleId
```

**路径参数**:

| 参数    | 类型   | 说明      |
| ------- | ------ | --------- |
| guildId | number | 服务器 ID |
| roleId  | number | 角色 ID   |

**请求体**（所有字段可选，支持部分更新）:

```json
{
  "name": "Admin",
  "permissions": 16,
  "color": "#e74c3c"
}
```

**响应**: 更新后的角色对象

### 删除角色

```
DELETE /guilds/:guildId/roles/:roleId
```

**路径参数**:

| 参数    | 类型   | 说明      |
| ------- | ------ | --------- |
| guildId | number | 服务器 ID |
| roleId  | number | 角色 ID   |

**响应**: `204 No Content`

### 分配角色

```
POST /guilds/:guildId/roles/:roleId/assign/:userId
```

**路径参数**:

| 参数    | 类型   | 说明      |
| ------- | ------ | --------- |
| guildId | number | 服务器 ID |
| roleId  | number | 角色 ID   |
| userId  | number | 用户 ID   |

**响应**: `204 No Content`

**触发事件**: `GUILD_MEMBER_UPDATE`

### 移除成员角色

```
POST /guilds/:guildId/roles/:roleId/remove/:userId
```

**路径参数**:

| 参数    | 类型   | 说明      |
| ------- | ------ | --------- |
| guildId | number | 服务器 ID |
| roleId  | number | 角色 ID   |
| userId  | number | 用户 ID   |

**响应**: `204 No Content`

**触发事件**: `GUILD_MEMBER_UPDATE`

---

## 私信管理

### 获取私信频道

```
GET /users/:userId/dm
```

**路径参数**:

| 参数   | 类型   | 说明    |
| ------ | ------ | ------- |
| userId | number | 用户 ID |

**响应示例**:

```json
{
  "channelId": 456,
  "recipientId": 1
}
```

### 发送私信消息

```
POST /dm/threads/:threadId/messages
```

**路径参数**:

| 参数     | 类型   | 说明        |
| -------- | ------ | ----------- |
| threadId | number | 私信线程 ID |

**请求体**:

```json
{
  "content": "Private message"
}
```

### 获取私信消息列表

```
GET /dm/threads/:threadId/messages
```

**路径参数**:

| 参数     | 类型   | 说明        |
| -------- | ------ | ----------- |
| threadId | number | 私信线程 ID |

**查询参数**: 同 `GET /channels/:channelId/messages`

### 编辑私信消息

```
PUT /dm/messages/:messageId
```

**路径参数**:

| 参数      | 类型   | 说明    |
| --------- | ------ | ------- |
| messageId | number | 消息 ID |

**请求体**:

```json
{
  "content": "Updated DM content"
}
```

**响应**: 编辑后的私信消息对象

**触发事件**: `DM_MESSAGE_UPDATE`

### 删除私信消息

```
DELETE /dm/messages/:messageId
```

**路径参数**:

| 参数      | 类型   | 说明    |
| --------- | ------ | ------- |
| messageId | number | 消息 ID |

**响应**: `204 No Content`

**触发事件**: `DM_MESSAGE_DELETE`

---

## 交互消息

### 获取交互消息

```
GET /interactions
```

**查询参数**:

| 参数      | 类型   | 必填 | 说明                        |
| --------- | ------ | ---- | --------------------------- |
| channelId | number | 否   | 按频道过滤                  |
| limit     | number | 否   | 返回数量，默认 50，最大 100 |
| after     | number | 否   | 获取 ID 大于此值的消息      |
| before    | number | 否   | 获取 ID 小于此值的消息      |

**响应示例**:

```json
[
  {
    "id": 5001,
    "channelId": 123,
    "authorId": 1,
    "content": "/help",
    "createdAt": "2025-12-31T12:00:00Z",
    "timestamp": 1735646400000,
    "user": {
      "id": 1,
      "name": "username",
      "avatar": "avatar/xxx.jpg",
      "isBot": false
    },
    "guildId": 10
  }
]
```

---

## 服务器管理

### 获取服务器列表

```
GET /guilds
```

**查询参数**:

| 参数     | 类型   | 必填 | 说明                                     |
| -------- | ------ | ---- | ---------------------------------------- |
| limit    | number | 否   | 返回数量，默认 10，最大 100              |
| page     | number | 否   | 页码，默认 1（与 beforeId/afterId 互斥） |
| beforeId | number | 否   | 游标分页：ID 小于此值                    |
| afterId  | number | 否   | 游标分页：ID 大于此值                    |

**响应示例（页码模式）**:

```json
{
  "data": [
    {
      "id": 10,
      "name": "My Server",
      "ownerId": 1,
      "icon": "covers/xxx.jpg"
    }
  ],
  "total": 3,
  "page": 1,
  "limit": 10
}
```

**响应示例（游标模式）**:

```json
{
  "data": [...]
}
```

---

## 公告管理

### 获取公告列表

```
GET /guilds/:guildId/announcements
```

**路径参数**:

| 参数    | 类型   | 说明      |
| ------- | ------ | --------- |
| guildId | number | 服务器 ID |

**查询参数**:

| 参数     | 类型   | 必填 | 说明                        |
| -------- | ------ | ---- | --------------------------- |
| limit    | number | 否   | 返回数量，默认 10，最大 100 |
| page     | number | 否   | 页码，默认 1                |
| beforeId | number | 否   | 游标分页                    |
| afterId  | number | 否   | 游标分页                    |

**响应示例**:

```json
{
  "data": [
    {
      "id": 1,
      "guildId": 10,
      "authorId": 1,
      "title": "Welcome",
      "content": "Welcome to the server!",
      "isPinned": true,
      "createdAt": "2025-12-31T12:00:00Z"
    }
  ],
  "pagination": {
    "page": 1,
    "limit": 10,
    "total": 5,
    "hasMore": false
  }
}
```

### 创建公告

```
POST /guilds/:guildId/announcements
```

**路径参数**:

| 参数    | 类型   | 说明      |
| ------- | ------ | --------- |
| guildId | number | 服务器 ID |

**请求体**:

```json
{
  "title": "重要通知",
  "content": "公告内容...",
  "images": [
    {
      "path": "guild-chat-files/img.png",
      "url": "guild-chat-files/img.png"
    }
  ]
}
```

| 字段    | 类型   | 必填 | 说明                |
| ------- | ------ | ---- | ------------------- |
| title   | string | 是   | 公告标题            |
| content | string | 是   | 公告内容            |
| images  | array  | 否   | 图片列表，最多 9 张 |

**响应**: 创建的公告对象

### 获取公告详情

```
GET /announcements/:announcementId
```

**路径参数**:

| 参数           | 类型   | 说明    |
| -------------- | ------ | ------- |
| announcementId | number | 公告 ID |

**响应**: 公告对象

### 更新公告

```
PUT /announcements/:announcementId
```

**路径参数**:

| 参数           | 类型   | 说明    |
| -------------- | ------ | ------- |
| announcementId | number | 公告 ID |

**请求体**（所有字段可选）:

```json
{
  "title": "新标题",
  "content": "更新内容",
  "images": []
}
```

**响应**: 更新后的公告对象

### 删除公告

```
DELETE /announcements/:announcementId
```

**路径参数**:

| 参数           | 类型   | 说明    |
| -------------- | ------ | ------- |
| announcementId | number | 公告 ID |

**响应**: `204 No Content`

### 置顶公告

```
PUT /announcements/:announcementId/pin
```

**路径参数**:

| 参数           | 类型   | 说明    |
| -------------- | ------ | ------- |
| announcementId | number | 公告 ID |

**响应**: 更新后的公告对象

### 取消置顶

```
DELETE /announcements/:announcementId/pin
```

**路径参数**:

| 参数           | 类型   | 说明    |
| -------------- | ------ | ------- |
| announcementId | number | 公告 ID |

**响应**: `204 No Content`

---

## 加入申请

### 获取加入申请列表

```
GET /guilds/:guildId/join-requests
```

**路径参数**:

| 参数    | 类型   | 说明      |
| ------- | ------ | --------- |
| guildId | number | 服务器 ID |

**查询参数**:

| 参数  | 类型   | 必填 | 说明                        |
| ----- | ------ | ---- | --------------------------- |
| page  | number | 否   | 页码，默认 1                |
| limit | number | 否   | 返回数量，默认 20，最大 100 |

**响应示例**:

```json
{
  "data": [...],
  "total": 5,
  "page": 1,
  "limit": 20
}
```

### 批准加入申请

```
POST /guilds/:guildId/join-requests/:requestId/approve
```

**路径参数**:

| 参数      | 类型   | 说明      |
| --------- | ------ | --------- |
| guildId   | number | 服务器 ID |
| requestId | number | 申请 ID   |

**响应**: `{ "success": true }`

**触发事件**: `GUILD_MEMBER_ADD`

### 拒绝加入申请

```
POST /guilds/:guildId/join-requests/:requestId/reject
```

**路径参数**:

| 参数      | 类型   | 说明      |
| --------- | ------ | --------- |
| guildId   | number | 服务器 ID |
| requestId | number | 申请 ID   |

**响应**: `{ "success": true }`

---

## 文件上传

### 上传文件

```
POST /files/upload
```

**限制**:

- 单文件最大 15 MB
- 每日配额：80 GB
- 每月配额：2000 GB

**请求方式**: `multipart/form-data`

**表单字段**:

| 字段          | 类型   | 必填 | 说明            |
| ------------- | ------ | ---- | --------------- |
| file          | File   | 是   | 文件内容        |
| channelId     | string | 否   | 关联频道 ID     |
| threadId      | string | 否   | 关联私聊线程 ID |
| messageId     | string | 否   | 关联消息 ID     |
| groupThreadId | string | 否   | 关联群聊线程 ID |

**响应示例**:

```json
{
  "file": {
    "path": "guild-chat-files/xxx.png",
    "url": "guild-chat-files/xxx.png",
    "category": "image",
    "size": 102400,
    "contentType": "image/png",
    "filename": "photo.png",
    "width": 800,
    "height": 600
  }
}
```

:::tip 文件访问
上传成功后，可通过以下方式拼接完整 URL：

```
https://bubble-oss-files.alemonjs.com/{file.url}
```

:::

### 查询上传配额

```
GET /files/quota
```

**响应示例**:

```json
{
  "dailyUsed": 1073741824,
  "dailyLimit": 85899345920,
  "monthlyUsed": 5368709120,
  "monthlyLimit": 2147483648000
}
```

---

## 错误响应

所有接口在出错时返回统一格式：

```json
{
  "error": "错误描述信息"
}
```

**常见 HTTP 状态码**:

| 状态码 | 说明             |
| ------ | ---------------- |
| 400    | 请求参数错误     |
| 401    | Token 无效或过期 |
| 403    | 无权限执行此操作 |
| 404    | 资源不存在       |
| 429    | 超过速率限制     |
| 500    | 服务器内部错误   |
