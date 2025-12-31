---
sidebar_position: 10
---

# 速率限制与配额

了解 Bubble 平台的各项限制，合理使用 API 资源。

## 速率限制

### HTTP API 限制

**全局限制**:
- 速率：**5 请求/秒**
- 突发：**10 请求**

```javascript
// 控制请求速率示例
for (let i = 0; i < 20; i++) {
  await api.post(`/channels/${channelId}/messages`, { content: `Message ${i}` });
  await sleep(200); // 5 请求/秒 = 200ms 间隔
}
```

### WebSocket 限制

**消息发送限制**:
- 速率：**10 消息/秒**
- 突发：**20 消息**

```javascript
setInterval(() => {
  ws.send(JSON.stringify({ op: 1, d: null }));
}, 30000); // 心跳间隔 30 秒
```

**连接限制**:
- 每个机器人最多 **1 个并发连接**
- 断线重连间隔：**最少 1 秒**

### 限流响应

当超过速率限制时：

**HTTP API**:
```json
HTTP/1.1 429 Too Many Requests
X-RateLimit-Limit: 5
X-RateLimit-Remaining: 0
X-RateLimit-Reset: 1735660800

{
  "error": {
    "code": "RATE_LIMIT_EXCEEDED",
    "message": "Rate limit exceeded",
    "retryAfter": 1.5
  }
}
```

**WebSocket**:
```json
{
  "op": 0,
  "t": "ERROR",
  "d": {
    "code": "RATE_LIMIT",
    "message": "Too many messages"
  }
}
```

连接可能被强制断开。

## 文件上传配额

### 文件限制

- **单文件大小**: 最大 **5 MB**
- **支持格式**: 图片（jpg, png, gif）、语音（mp3, wav）、视频（mp4）



### 上传配额

**每日配额**:
- 基础配额：**80 GB/天**
- 额外配额：每发送 1 条消息 +10 MB

**每月配额**:
- 总配额：**2000 GB/月**

**响应示例**:
```json
{
  "dailyUsed": 1073741824,        // 1 GB
  "dailyLimit": 85899345920,      // 80 GB
  "monthlyUsed": 5368709120,      // 5 GB
  "monthlyLimit": 2147483648000   // 2000 GB
}
```

### 配额耗尽

当配额耗尽时：

```json
HTTP/1.1 429 Too Many Requests

{
  "error": {
    "code": "QUOTA_EXCEEDED",
    "message": "Daily upload quota exceeded",
    "resetAt": "2025-12-32T00:00:00Z"
  }
}
```

**解决方案**:
1. 等待配额重置（每日 00:00 UTC）
2. 发送更多消息以获取额外配额
3. 联系管理员申请提额

## 机器人数量限制

每个账号最多创建 **3 个机器人**。

## 消息限制

### 消息长度

- **最大长度**: **2000 字符**

超长消息需分段发送。

### 批量操作限制

- **获取消息**: 单次最多 100 条
- **获取成员**: 单次最多 1000 条

使用分页参数获取更多数据。

## 并发限制

- **WebSocket**: 每个机器人最多 1 个并发连接
- **重连间隔**: 最少 1 秒

## 速率限制处理

当收到 429 错误时，响应头包含 `X-RateLimit-*` 信息和 `retryAfter` 字段，按照提示的时间等待后重试。

## 优化建议

1. **控制请求频率**: 使用队列或限流机制
2. **缓存数据**: 减少重复请求
3. **优先使用 WebSocket**: 实时事件使用 WebSocket，避免轮询

## 常见问题

**Q: 如何知道还剩多少配额？**

A: 调用 `GET /files/quota` 查询。

**Q: 429 错误后多久能恢复？**

A: 查看响应的 `retryAfter` 字段，通常 1-2 秒。

**Q: 可以申请提高限制吗？**

A: 可以联系管理员，说明使用场景。

更多信息请参考 [架构说明](./architecture.md)。
