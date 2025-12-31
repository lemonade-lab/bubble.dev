import { useEffect } from 'react'
export const useEffectTheme = (
  Attribute: string,
  id: string
) => {
  useEffect(() => {
    const updateBodyClass = () => {
      const theme =
        document.documentElement.getAttribute(Attribute)
      const docusaurusDiv = document.getElementById(id)
      if (theme === 'dark') {
        if (docusaurusDiv) {
          docusaurusDiv.classList.add('dark')
        }
      } else {
        if (docusaurusDiv) {
          docusaurusDiv.classList.remove('dark')
        }
      }
    }
    updateBodyClass()
    const observer = new MutationObserver(() => {
      updateBodyClass()
    })
    observer.observe(document.documentElement, {
      attributes: true,
      attributeFilter: [Attribute]
    })
    return () => {
      observer.disconnect()
    }
  }, [])
}
