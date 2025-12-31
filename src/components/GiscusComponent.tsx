import React from 'react'
import Giscus from '@giscus/react'
import { useColorMode } from '@docusaurus/theme-common'
export default function GiscusComponent() {
  const { colorMode } = useColorMode()
  return (
    <Giscus
      // 仓库的路径，评论将被关联到这个仓库。
      repo="lemonade-lab/bubble.dev"
      /// 该仓库的唯一标识符。
      repoId=""
      // 评论的分类名，例如“General”。
      category="General"
      // 分类的唯一标识符，用于区分不同的评论类别。
      categoryId=""
      // 用于将评论映射到特定 URL 的属性，这里使用标题。
      mapping="title"
      // 初始的欢迎词或主题。
      term=""
      // 是否严格匹配标题（0 表示不严格）。
      strict="0"
      // 是否启用表情反应功能（1 表示启用）。
      reactionsEnabled="1"
      // 是否发送元数据（1 表示启用）。
      emitMetadata="1"
      // 评论输入框的位置（“top”表示在上方）。
      inputPosition="top"
      // 评论组件的主题，基于当前的颜色模式。
      theme={colorMode}
      // 设置评论组件的语言，这里是英语（“en”）。
      lang="en"
      //  设置加载方式，这里使用懒加载（“lazy”）。
      loading="lazy"
    />
  )
}
