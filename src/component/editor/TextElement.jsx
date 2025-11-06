import React, { useState, useRef, useEffect } from 'react'
import { useEditor } from '../../context/EditorContext'

export default function TextElement({ element }) {
  const { updateElement } = useEditor()
  const [editing, setEditing] = useState(false)
  const [text, setText] = useState(element.text)
  const inputRef = useRef(null)

  useEffect(() => {
    if (editing && inputRef.current) {
      inputRef.current.focus()
    }
  }, [editing])

  const handleDoubleClick = () => {
    setEditing(true)
  }

  const handleBlur = () => {
    setEditing(false)
    updateElement(element.id, { text })
  }

  const style = {
    fontSize: element.fontSize,
    fontFamily: element.fontFamily,
    color: element.color,
    fontWeight: element.fontWeight || 'normal',
    fontStyle: element.fontStyle || 'normal',
    textAlign: element.textAlign || 'center',
    opacity: element.opacity ?? 1,
    width: '100%',
    height: '100%',
    cursor: 'text',
    userSelect: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent:
      element.textAlign === 'left'
        ? 'flex-start'
        : element.textAlign === 'right'
        ? 'flex-end'
        : 'center',
    padding: '4px',
  }

  return (
    <div style={style} onDoubleClick={handleDoubleClick}>
      {editing ? (
        <textarea
          ref={inputRef}
          value={text}
          onChange={(e) => setText(e.target.value)}
          onBlur={handleBlur}
          className="w-full h-full resize-none bg-transparent outline-none"
          style={{
            fontSize: element.fontSize,
            fontFamily: element.fontFamily,
            color: element.color,
            fontWeight: element.fontWeight || 'normal',
            fontStyle: element.fontStyle || 'normal',
            textAlign: element.textAlign || 'center',
          }}
        />
      ) : (
        <span
          style={{
            width: '100%',
            textAlign: element.textAlign || 'center',
            fontWeight: element.fontWeight || 'normal',
            fontStyle: element.fontStyle || 'normal',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
        >
          {element.text}
        </span>
      )}
    </div>
  )
}
