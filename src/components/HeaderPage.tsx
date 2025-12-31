import Link from '@docusaurus/Link'
import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Translate from '@docusaurus/Translate'
import TextReveal from '@site/src/components/TextReveal'
import React from 'react'

export default function HeaderPage(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()
  return (
    <header className="flex flex-col items-center justify-center pt-12 relative">
      <img
        className="w-64 md:w-80 lg:w-96"
        src={require('@site/static/img/alemon.png').default}
        alt={siteConfig.title}
      />
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto">
        <p className="text-sm md:text-xl xl:text-2xl mb-4">
          <TextReveal text="泡泡聊天开放平台" />
        </p>
        <div className="flex justify-center my-4">
          <a
            className="hidden sm:block bg-blue-500 text-white rounded-md px-4 py-2 mx-2 hover:bg-blue-600 transition"
            onClick={() => {
              window.open(
                'https://bubble.alemonjs.com/developer',
                '_self'
              )
            }}
          >
            <Translate> ⚡️创建机器人</Translate>
          </a>
          <Link
            className="bg-white text-blue-500 border border-blue-500 rounded-md px-4 py-2 mx-2 hover:bg-gray-200 transition"
            to="docs/intro"
          >
            <Translate> 🚀快速开始</Translate>
          </Link>
        </div>
      </div>
    </header>
  )
}
