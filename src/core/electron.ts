import yaml from 'js-yaml'
import axios from 'axios'

type VerionConfigType = {
  version: string
  files: {
    url: string
    sha512: string
    size: number
  }[]
  path: string
  sha512: string
  releaseDate: string
}

/**
 *
 * @param baseURL
 * @param url
 * @returns
 */
export const getYml = async ({ baseURL, url }) => {
  return await axios({
    method: 'get',
    baseURL: baseURL,
    url: `/${url}`,
    headers: {
      'Cache-Control': 'no-cache',
      'Pragma': 'no-cache',
      'Expires': '0'
    }
  })
    .then(res => res.data)
    .then(res => {
      const data: VerionConfigType | null = yaml.load(
        res
      ) as any
      return data
    })
}

export const useDownloadLink = (url: string) => {
  const downloadLink = document.createElement('a')
  downloadLink.setAttribute('href', url)
  document.body.appendChild(downloadLink)
  downloadLink.click()
  document.body.removeChild(downloadLink)
}

/**
 *
 * @param param0
 * @returns
 */
export const useElectronDownload = <T extends string>({
  baseURL,
  ymls
}: {
  baseURL: string
  ymls: {
    [key: string]: string
  }
}) => {
  /**
   * @param platform
   */
  const handleDownloadClick = async (
    platform: T,
    arch: 'x64' | 'arm64'
  ) => {
    let url = ''
    await axios({
      method: 'get',
      baseURL: baseURL,
      url: `/${ymls[platform]}`,
      headers: {
        'Cache-Control': 'no-cache',
        'Pragma': 'no-cache',
        'Expires': '0'
      }
    })
      .then(res => res.data)
      .then(res => {
        const data: VerionConfigType | null = yaml.load(
          res
        ) as any
        if (data?.path) {
          // 找到匹配架构
          const item = data.files.find(item =>
            item.url.includes(arch)
          )
          if (item.url) {
            url = `${baseURL}/${item.url}`
          }
        }
      })
    useDownloadLink(url)
  }
  return handleDownloadClick
}
