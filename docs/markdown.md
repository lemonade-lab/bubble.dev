---
sidebar_position: 10
---

# Markdown

Bubble 平台支持标准 Markdown 语法，并提供了一组自定义标签用于构建交互式消息界面。

## 文本组件

### `<txt>` - 文本样式

控制文本大小的标签。

**属性**:
- `size`: 文本大小，可选值：`sm` | `md` | `lg` | `xl` | `2xl` | `3xl`

**示例**:
```markdown
<txt size="xl">大号文字</txt>
<txt size="sm">小号文字</txt>
<txt size="3xl">超大标题</txt>
```

## 布局组件

### `<flex>` - 弹性布局容器

用于控制子元素的排列方向。

**属性**:
- `v`: 是否垂直布局（从上到下），省略或 `false` 为水平布局（从左到右）

**示例**:
```markdown
<!-- 水平布局（左到右） -->
<flex>
  <txt size="lg">左侧</txt>
  <txt size="lg">右侧</txt>
</flex>

<!-- 垂直布局（上到下） -->
<flex v>
  <txt size="lg">第一行</txt>
  <txt size="lg">第二行</txt>
</flex>
```

### `<box>` - 容器盒子

带边框和背景的容器组件，支持自定义间距。

**属性**:
- `variant`: 样式变体，可选值 `borderless`（无边框）
- `classWind`: 自定义间距类名，支持 Tailwind CSS 间距语法

**间距语法**:
- `m-{1-6}`: 外边距（margin）
- `p-{1-6}`: 内边距（padding）
- 方向：`t`（top）、`r`（right）、`b`（bottom）、`l`（left）、`x`（水平）、`y`（垂直）

**示例**:
```markdown
<!-- 默认样式 -->
<box>
  <txt size="lg">内容区域</txt>
</box>

<!-- 自定义内边距 -->
<box classWind="p-3">
  <txt size="lg">较大内边距</txt>
</box>

<!-- 自定义外边距和内边距 -->
<box classWind="m-2 pt-4">
  <txt size="lg">上内边距为 4</txt>
</box>

<!-- 无边框样式 -->
<box variant="borderless">
  <txt size="lg">无边框盒子</txt>
</box>
```

## 交互组件

### `<btn>` - 按钮

可点击的按钮组件，支持触发命令。

**属性**:
- `command`: 点击时执行的命令
- `reply`: 是否带引用回复，默认 `false`
- `enter`: 是否自动发送，默认 `false`
- `variant`: 按钮样式变体

**样式变体**:
- `default`: 默认样式（黑边黑字）
- `borderless`: 无边框样式（蓝字）
- `underlined`: 下划线样式
- `filled-blue`: 蓝色填充
- `filled-green`: 绿色填充
- `filled-red`: 红色填充
- `filled-yellow`: 黄色填充

**示例**:
```markdown
<!-- 基础按钮 -->
<btn command="/help">帮助</btn>

<!-- 带引用回复 -->
<btn command="/info" reply="true">查看信息</btn>

<!-- 自动发送 -->
<btn command="/start" enter="true">开始</btn>

<!-- 不同样式变体 -->
<btn variant="borderless" command="/menu">无边框按钮</btn>
<btn variant="filled-blue" command="/confirm">确认</btn>
<btn variant="filled-red" command="/cancel">取消</btn>
```

### `<inp>` - 输入框

输入框组件，支持多种样式。

**属性**:
- `variant`: 输入框样式变体

**样式变体**:
- `default`: 默认样式（灰边白底）
- `borderless`: 无边框透明背景
- `underlined`: 下划线样式
- `filled-blue` / `filled-green` / `filled-red` / `filled-yellow`: 填充样式

**示例**:
```markdown
<!-- 默认输入框 -->
<inp />

<!-- 下划线样式 -->
<inp variant="underlined" />

<!-- 填充样式 -->
<inp variant="filled-blue" />
```

## 特殊功能

### Mention（提及）

支持提及用户、频道和所有人。

**语法**:
- `<@用户ID>`: 提及用户
- `<#频道ID>`: 提及频道
- `@everyone`: 提及所有人

**示例**:
```markdown
欢迎 <@123> 加入 <#456> 频道！
@everyone 请注意公告
```

### 图片

支持标准 Markdown 图片语法和 `<img>` 标签。

**示例**:
```markdown
![图片描述](https://example.com/image.png)
```

## 协议链接

### Bubble 协议

使用 `bbapi://` 协议创建可点击的命令链接。

**语法**:
```
bbapi://win/md/input?command={命令}&reply={true|false}&enter={true|false}
```

**参数**:
- `command`: 要执行的命令
- `reply`: 是否带引用回复
- `enter`: 是否自动发送

**示例**:
```markdown
[点击查看帮助](bbapi://win/md/input?command=/help&reply=false&enter=false)
[发送问候](bbapi://win/md/input?command=你好&reply=false&enter=true)
```

## 综合示例

### 欢迎消息

```markdown
<box>
  <flex v>
    <txt size="2xl">欢迎加入服务器！</txt>
    <txt size="md">请选择以下操作：</txt>
  </flex>
</box>

<flex>
  <btn variant="filled-blue" command="/profile">查看资料</btn>
  <btn variant="filled-green" command="/rules">阅读规则</btn>
</flex>
```

### 表单界面

```markdown
<box classWind="p-3">
  <flex v>
    <txt size="lg">用户信息</txt>
    
    <flex v>
      <txt size="sm">昵称：</txt>
      <inp variant="underlined" />
    </flex>
    
    <flex v>
      <txt size="sm">简介：</txt>
      <inp variant="underlined" />
    </flex>
    
    <flex>
      <btn variant="filled-blue" command="/submit">提交</btn>
      <btn variant="borderless" command="/cancel">取消</btn>
    </flex>
  </flex>
</box>
```

### 菜单面板

```markdown
<box>
  <txt size="xl">功能菜单</txt>
</box>

<flex v>
  <btn command="/help" reply="false">📖 帮助文档</btn>
  <btn command="/settings" reply="false">⚙️ 设置</btn>
  <btn command="/about" reply="false">ℹ️ 关于</btn>
</flex>
```

## 注意事项

1. **标签闭合**: 所有自定义标签必须正确闭合
2. **属性格式**: 属性值建议使用双引号包裹
3. **嵌套限制**: 避免过深的组件嵌套，保持结构清晰
4. **样式一致性**: 在同一界面中保持样式风格统一
5. **安全性**: 自定义标签会自动过滤 HTML 标签，防止 XSS 攻击

## 最佳实践

- **语义化**: 使用 `<box>` 划分功能区域
- **响应式**: 使用 `<flex>` 实现自适应布局
- **视觉层次**: 通过 `<txt size>` 建立清晰的信息层级
- **交互反馈**: 为按钮选择合适的样式变体
- **简洁明了**: 避免过度使用样式和嵌套