import React from 'react'

export default function ShapeElement({ element }) {
  const {
    shape = 'rectangle',
    background = '#000000',
    borderColor = '#000000',
    borderWidth = 0,
    borderRadius = 0,
    opacity = 1,
  } = element

  const baseStyle = {
    background:
      shape === 'line'
        ? 'none'
        : background,
    border:
      borderWidth > 0
        ? `${borderWidth}px solid ${borderColor}`
        : 'none',
    borderRadius: shape === 'circle' ? '50%' : borderRadius,
    opacity,
    width: '100%',
    height: '100%',
  }

  if (shape === 'line') {
    return (
      <div
        className="w-full"
        style={{
          height: `${borderWidth || 2}px`,
          background: borderColor,
          opacity,
        }}
      />
    )
  }

  return <div style={baseStyle} />
}
