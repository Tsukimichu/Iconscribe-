// ----------------------------
// src/components/Editor/ImageElement.jsx
// ----------------------------
import React from 'react'

export default function ImageElement({element}){
  return (
    <img src={element.src} alt="user" className="w-full h-full object-cover" />
  )
}
