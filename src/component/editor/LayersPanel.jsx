// ----------------------------
// src/components/Editor/LayersPanel.jsx
// ----------------------------
import React from 'react'
import { useEditor } from '../../context/EditorContext'

export default function LayersPanel(){
  const { state, selectElement, reorderElements, deleteElement } = useEditor()

  const bringForward = (id)=>{
    const list = [...state.elements]
    const idx = list.findIndex(l=>l.id===id)
    if(idx < list.length -1){
      const a = list[idx]; list.splice(idx,1); list.splice(idx+1,0,a)
      reorderElements(list)
    }
  }

  const sendBackward = (id)=>{
    const list = [...state.elements]
    const idx = list.findIndex(l=>l.id===id)
    if(idx > 0){
      const a = list[idx]; list.splice(idx,1); list.splice(idx-1,0,a)
      reorderElements(list)
    }
  }

  return (
    <div className="p-4 space-y-2">
      <h3 className="font-medium">Layers</h3>
      {state.elements.map((el, i)=> (
        <div key={el.id} className="flex items-center justify-between border rounded p-2">
          <div className="cursor-pointer" onClick={()=>selectElement(el.id)}>{el.type} — {el.id.slice(0,4)}</div>
          <div className="flex gap-1">
            <button onClick={()=>bringForward(el.id)} className="px-2 py-1 border rounded">▲</button>
            <button onClick={()=>sendBackward(el.id)} className="px-2 py-1 border rounded">▼</button>
            <button onClick={()=>deleteElement(el.id)} className="px-2 py-1 border rounded">🗑</button>
          </div>
        </div>
      ))}
    </div>
  )
}
