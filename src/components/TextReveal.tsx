import React from 'react'
import { HTMLAttributes } from 'react'
import { useEffect, useState } from 'react'
/**
 *
 * @param param0
 * @returns
 */
export default function TextReveal({
  text,
  className
}: {
  text: string
  className?: HTMLAttributes<HTMLSpanElement>['className']
}) {
  const [displayedText, setDisplayedText] = useState('')
  useEffect(() => {
    const Arr = text.split('')
    const length = Arr.length
    let index = Arr.length
    const TXT: string[] = []
    const interval = setInterval(() => {
      if (displayedText.length >= Arr.length - 1) {
        return
      }
      if (index > 0 && index <= Arr.length) {
        // push
        TXT.push(Arr[length - index])
        // set
        setDisplayedText(TXT.join(''))
      } else {
        clearInterval(interval)
      }
      // --
      index--
      //
    }, 150) // 每 200 毫秒显示一个字
    return () => clearInterval(interval) // 清理定时器
  }, [])
  return (
    <span className={className}>「 {displayedText} 」</span>
  )
}
