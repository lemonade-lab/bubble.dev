import React from 'react'

export default function Image({ src }) {
  return (
    <img
      style={{ height: '100%', width: '100%' }}
      src={src?.default ?? src}
    />
  )
}
