import React, { useState, useCallback, useMemo, useEffect } from "react";
import { useEditor } from "../../context/EditorContext";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { GripVertical, Trash2, Pencil, Layers } from "lucide-react";

export default function LayersPanel() {
  const { state, selectElement, reorderElements, deleteElement, renameElement } =
    useEditor();

  const selectedId =
    state.selectedElementId || state.selectedId || state.activeElementId;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

  // Visual order for the list
  const visualOrder = useMemo(() => [...state.elements].reverse(), [state.elements]);

  const handleDragEnd = useCallback(
    (event) => {
      const { active, over } = event;
      if (over && active.id !== over.id) {
        const reversed = [...state.elements].reverse();
        const oldIndex = reversed.findIndex((el) => el.id === active.id);
        const newIndex = reversed.findIndex((el) => el.id === over.id);
        const newReversed = arrayMove(reversed, oldIndex, newIndex);
        reorderElements(newReversed.reverse());
      }
    },
    [state.elements, reorderElements]
  );

  return (
    <div className="bg-white border border-gray-200 rounded-xl shadow-xl overflow-hidden flex flex-col h-full">
      {/* HEADER */}
      <div className="bg-white px-5 py-4 border-b border-gray-100 flex items-center justify-between">
        <div className="flex items-center gap-2 text-gray-800">
          <Layers size={18} className="text-blue-600" />
          <h3 className="font-bold text-base tracking-tight">Layers</h3>
        </div>
        <span className="text-xs font-semibold bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">
          {state.elements.length}
        </span>
      </div>

      {/* LIST AREA */}
      <div className="flex-1 overflow-y-auto p-3 custom-scrollbar">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={visualOrder.map((el) => el.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-1">
              {visualOrder.map((el) => (
                <SortableLayerItem
                  key={el.id}
                  el={el}
                  isSelected={selectedId === el.id}
                  selectElement={selectElement}
                  deleteElement={deleteElement}
                  renameElement={renameElement}
                />
              ))}
            </div>
          </SortableContext>
        </DndContext>
        
        {visualOrder.length === 0 && (
          <div className="text-center py-10 text-gray-400 text-sm">
            No layers yet
          </div>
        )}
      </div>
    </div>
  );
}

// ----------------------------------
// Sortable + Editable Layer Item
// ----------------------------------
const SortableLayerItem = React.memo(function SortableLayerItem({
  el,
  isSelected,
  selectElement,
  deleteElement,
  renameElement,
}) {
  const { attributes, listeners, setNodeRef, transform, transition, isDragging } =
    useSortable({ id: el.id });

  const [isEditing, setIsEditing] = useState(false);
  const [tempName, setTempName] = useState(el.name || el.type);

  // Sync with external updates
  useEffect(() => {
    if (!isEditing) setTempName(el.name || el.type);
  }, [el.name, el.type, isEditing]);

  const handleRename = useCallback(() => {
    const newName = tempName.trim();
    if (newName && newName !== el.name) renameElement(el.id, newName);
    setIsEditing(false);
  }, [tempName, el.id, el.name, renameElement]);

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    zIndex: isDragging ? 50 : "auto",
    opacity: isDragging ? 0.8 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => selectElement(el.id)}
      className={`
        group relative flex items-center justify-between 
        px-3 py-2.5 rounded-lg text-sm cursor-pointer transition-all duration-200 border border-transparent
        ${
          isSelected
            ? "bg-blue-50 text-blue-700 border-blue-200 shadow-sm"
            : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
        } 
        ${isDragging ? "shadow-lg bg-white scale-105" : ""}
      `}
    >
      <div className="flex items-center gap-3 w-full overflow-hidden">
        {/* DRAG HANDLE */}
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className={`
            cursor-grab active:cursor-grabbing transition-colors
            ${isSelected ? "text-blue-300 hover:text-blue-500" : "text-gray-300 hover:text-gray-500"}
          `}
        >
          <GripVertical size={14} />
        </button>

        {/* NAME / INPUT */}
        <div className="flex-1 min-w-0">
          {isEditing ? (
            <input
              value={tempName}
              onChange={(e) => setTempName(e.target.value)}
              onBlur={handleRename}
              onKeyDown={(e) => e.key === "Enter" && handleRename()}
              autoFocus
              onClick={(e) => e.stopPropagation()}
              className="w-full bg-white text-gray-900 border border-blue-400 rounded px-1.5 py-0.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-200"
            />
          ) : (
            <div
              className="flex items-center gap-2 w-full"
              onDoubleClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
            >
              <span className="font-medium truncate select-none">
                {el.name || el.type}
              </span>
              
              {/* Subtle ID display */}
              <span className={`text-[10px] font-mono opacity-0 group-hover:opacity-100 transition-opacity ${isSelected ? "text-blue-400" : "text-gray-300"}`}>
                #{el.id.slice(-4)}
              </span>

              <button
                onClick={(e) => {
                  e.stopPropagation();
                  setIsEditing(true);
                }}
                className={`ml-auto opacity-0 group-hover:opacity-100 transition-all transform scale-90 hover:scale-110 hover:text-blue-600 ${isSelected ? "text-blue-400" : "text-gray-400"}`}
                title="Rename"
              >
                <Pencil size={12} />
              </button>
            </div>
          )}
        </div>
      </div>

      {/* DELETE BUTTON - Only visible on hover */}
      {!isEditing && (
        <button
          onClick={(e) => {
            e.stopPropagation();
            deleteElement(el.id);
          }}
          className={`
            ml-2 p-1.5 rounded-md transition-all opacity-0 group-hover:opacity-100
            ${
              isSelected 
                ? "hover:bg-blue-200 text-blue-400 hover:text-blue-700" 
                : "hover:bg-red-50 text-gray-400 hover:text-red-500"
            }
          `}
          title="Delete layer"
        >
          <Trash2 size={14} />
        </button>
      )}
    </div>
  );
});