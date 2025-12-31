import useDocusaurusContext from '@docusaurus/useDocusaurusContext'
import Layout from '@theme/Layout'
import HomePage from '@site/src/components/HomePage'
import { useEffectTheme } from '@site/src/core/theme'
import HeaderPage from '@site/src/components/HeaderPage'
import React from 'react'
export default function Home(): JSX.Element {
  const { siteConfig } = useDocusaurusContext()
  // 响应 data-theme 改变，动态切换id=__docusaurus的 dark mode
  useEffectTheme('data-theme', '__docusaurus')
  return (
    <Layout
      title={`Hello from ${siteConfig.title}`}
      description="Description will go into a meta tag in <head />"
    >
      <HeaderPage />
      <HomePage />
    </Layout>
  )
}
