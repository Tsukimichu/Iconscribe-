// ----------------------------
// src/components/ui/Button.jsx
// (simple button used in toolbar; included for completeness)
// ----------------------------
import React from 'react'
export default function Button({children, onClick, className=''}){
  return <button onClick={onClick} className={`px-3 py-1 rounded ${className}`}>{children}</button>
}
