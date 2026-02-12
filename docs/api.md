---
sidebar_position: 7
---

# API 参考

完整的 REST API 接口文档。

## 基础信息

**Base URL**: `https://bubble.alemonjs.com/api/bot/v1`

**Base File URL**: `https://bubble-oss-files.alemonjs.com`

**认证方式**: `Authorization: Bearer YOUR_BOT_TOKEN`

**请求头**:

```http
Content-Type: application/json
Authorization: Bearer YOUR_BOT_TOKEN
```

## 机器人信息

### GET /bot/me

获取当前机器人信息。

**响应示例**:

```json
{
  "id": 123,
  "name": "MyBot",
  "avatar": "avatar/avatar/xxx.jpg",
  "description": "Bot description"
}
```

## 消息管理

### POST /channels/:channelId/messages

在频道中发送消息。

**路径参数**:

- `channelId` (number): 频道 ID

**请求体**:

```json
{
  "content": "Hello, world!",
  "msgType": 0
}
```

**响应示例**:

```json
{
  "id": 1001,
  "channelId": 123,
  "content": "Hello!",
  "author": {
    "id": 456,
    "name": "MyBot"
  },
  "timestamp": "2025-12-31T12:00:00Z"
}
```

### GET /channels/:channelId/messages

获取频道消息列表（分页）。

**路径参数**:

- `channelId` (number): 频道 ID

**查询参数**:

- `before` (number, 可选): 获取此消息 ID 之前的消息
- `after` (number, 可选): 获取此消息 ID 之后的消息
- `limit` (number, 可选): 返回数量，默认 50，最大 100

**响应示例**:

```json
{
  "messages": [
    {
      "id": 1001,
      "channelId": 123,
      "content": "Hello!",
      "timestamp": "2025-12-31T12:00:00Z"
    }
  ],
  "hasMore": true
}
```

### DELETE /channels/:channelId/messages/:messageId

删除消息（仅限机器人自己发送的消息）。

**路径参数**:

- `channelId` (number): 频道 ID
- `messageId` (number): 消息 ID

**响应**: 204 No Content

### PUT /channels/:channelId/messages/:messageId

编辑消息（仅限机器人自己发送的消息）。

**路径参数**:

- `channelId` (number): 频道 ID
- `messageId` (number): 消息 ID

**请求体**:

```json
{
  "content": "Updated message content"
}
```

**响应示例**:

```json
{
  "id": 1001,
  "channelId": 123,
  "content": "Updated!",
  "editedTimestamp": "2025-12-31T12:10:00Z"
}
```

## 频道管理

### GET /guilds/:guildId/channels

获取服务器的频道列表。

**路径参数**:

- `guildId` (number): 服务器 ID

**响应示例**:

```json
{
  "channels": [
    {
      "id": 123,
      "guildId": 10,
      "name": "general",
      "type": 0
    }
  ]
}
```

### GET /channels/:channelId

获取频道详细信息。

**路径参数**:

- `channelId` (number): 频道 ID

**响应示例**:

```json
{
  "id": 123,
  "guildId": 10,
  "name": "general",
  "type": 0,
  "topic": "General discussion"
}
```

## 成员管理

### GET /guilds/:guildId/members

获取服务器成员列表（分页）。

**路径参数**:

- `guildId` (number): 服务器 ID

**查询参数**:

- `after` (number, 可选): 从此用户 ID 之后开始
- `limit` (number, 可选): 返回数量，默认 100，最大 1000

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

### GET /guilds/:guildId/members/:userId

获取特定成员信息。

**路径参数**:

- `guildId` (number): 服务器 ID
- `userId` (number): 用户 ID

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

## 私信管理

### POST /users/:userId/dm

创建或获取与用户的私信频道。

**路径参数**:

- `userId` (number): 用户 ID

**响应示例**:

```json
{
  "channelId": 456,
  "recipientId": 1
}
```

### POST /dm/channels/:channelId/messages

在私信频道中发送消息。

**路径参数**:

- `channelId` (number): 私信频道 ID

**请求体**:

```json
{
  "content": "Private message"
}
```

### GET /dm/channels/:channelId/messages

获取私信频道消息列表（查询参数同普通频道）。

## 文件上传

### POST /files/upload

上传文件（图片、语音等）。

**限制**:

- 单文件最大 15 MB
- 每日配额：80 GB
- 每月配额：2000 GB
- 每月无限额度：10GB

**请求方式**: `multipart/form-data`

**例子**:

```ts
import axios from 'axios'
import FormData from 'form-data'

// 请求参数
type ExtraParams = {
  // 可选 频道、线程、群聊
  channelId?: string | number
  threadId?: string | number
  messageId?: string | number
  groupThreadId?: string | number
}

/**
 * 文件信息接口
 */
interface FileInfo {
  path: string // 文件路径
  url: string // 访问地址
  // 需要拼接成可访问路径 `https://bubble-oss-files.alemonjs.com/${url}`
  category: string // 文件类型
  size: number // 文件大小
  contentType: string // MIME类型
  filename: string // 文件名
  channelId: string // 频道ID
  threadId: string // 线程ID
  groupThreadId: string // 群组线程ID
  messageId: string // 消息ID
  width?: number // 宽度（图片/视频）
  height?: number // 高度（图片/视频）
}

/**
 * 上传响应接口
 */
interface UploadResponse {
  data: {
    file: FileInfo
  }
}

/**
 * 上传配置接口
 */
interface UploadConfig {
  token: string
  request_proxy?: string
  request_config?: Record<string, any>
}

/**
 * ============ 单例文件服务 ============
 * 萌新直接用，不用管new
 */
class FileService {
  private static instance: FileService
  private baseURL = 'https://bubble.alemonjs.com/api/bot/v1'

  private constructor() {}

  // 获取单例
  static getInstance(): FileService {
    if (!FileService.instance) {
      FileService.instance = new FileService()
    }
    return FileService.instance
  }

  /**
   * 上传文件
   * @param file 文件对象 (Buffer/Stream)
   * @param filename 文件名
   * @param extra 额外参数 (channelId/threadId/messageId)
   */
  async upload(
    file: File,
    filename?: string,
    extra?: ExtraParams = {}
  ) {
    // 1. 创建FormData
    const form = new FormData()
    form.append('file', file, filename || 'file')

    if (extra.channelId)
      form.append('channelId', String(extra.channelId))
    if (extra.threadId)
      form.append('threadId', String(extra.threadId))
    if (extra.messageId)
      form.append('messageId', String(extra.messageId))
    if (extra.groupThreadId)
      form.append(
        'groupThreadId',
        String(extra.groupThreadId)
      )

    // 2. 获取配置（这里改成你的配置获取方式）
    const config: UploadConfig = {
      token: 'your-token' // 改成从环境变量/配置读取
    }

    // 3. 创建请求客户端
    const client = axios.create({
      baseURL: this.baseURL,
      timeout: 60000,
      headers: {
        Authorization: `Bearer ${config.token}`,
        ...form.getHeaders()
      },
      ...(config.request_config || {})
    })

    // 5. 发送请求
    const response = await client.post<UploadResponse>(
      '/files/upload',
      form
    )
    return response.data
  }
}

const fileService = FileService.getInstance()

export default fileService
```

### GET /files/quota

查询当前文件上传配额。

**响应示例**:

```json
{
  "dailyUsed": 1073741824,
  "dailyLimit": 85899345920,
  "monthlyUsed": 5368709120,
  "monthlyLimit": 2147483648000
}
```

## 错误响应

**响应格式**:

```json
{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded"
  }
}
```

**常见错误码**:

| HTTP 状态码 | 错误码              | 说明             |
| ----------- | ------------------- | ---------------- |
| 401         | UNAUTHORIZED        | Token 无效或过期 |
| 403         | FORBIDDEN           | 无权限执行此操作 |
| 404         | NOT_FOUND           | 资源不存在       |
| 429         | RATE_LIMIT_EXCEEDED | 超过速率限制     |
| 500         | INTERNAL_ERROR      | 服务器内部错误   |
