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
import { GripVertical, Trash2, Pencil } from "lucide-react";

export default function LayersPanel() {
  const { state, selectElement, reorderElements, deleteElement, renameElement } =
    useEditor();

  const selectedId =
    state.selectedElementId || state.selectedId || state.activeElementId;

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } })
  );

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
    <div className="bg-white border-2 border-blue-400 rounded-2xl shadow-md overflow-hidden">
      <div className="bg-gradient-to-r from-blue-500 to-blue-600 px-4 py-2 text-white font-semibold text-lg select-none">
        Layers
      </div>

      <div className="p-4">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={handleDragEnd}
        >
          <SortableContext
            items={visualOrder.map((el) => el.id)}
            strategy={verticalListSortingStrategy}
          >
            <div className="space-y-2">
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

  // Sync with external updates (persistent name)
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
    opacity: isDragging ? 0.6 : 1,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      onClick={() => selectElement(el.id)}
      className={`flex items-center justify-between border rounded-xl p-2.5 shadow-sm group cursor-pointer transition-all select-none
        ${
          isSelected
            ? "bg-blue-50 border-blue-400 ring-2 ring-blue-300"
            : "bg-white border-zinc-200 hover:bg-zinc-100"
        } 
        ${isDragging ? "ring-2 ring-blue-400" : ""}`}
    >
      <div className="flex items-center gap-2 w-full">
        <button
          {...attributes}
          {...listeners}
          onClick={(e) => e.stopPropagation()}
          className="cursor-grab text-zinc-400 hover:text-zinc-600 active:cursor-grabbing"
        >
          <GripVertical size={16} />
        </button>

        {isEditing ? (
          <input
            value={tempName}
            onChange={(e) => setTempName(e.target.value)}
            onBlur={handleRename}
            onKeyDown={(e) => e.key === "Enter" && handleRename()}
            autoFocus
            className="text-sm font-medium bg-white border border-blue-300 rounded px-1 py-0.5 focus:outline-none focus:ring-1 focus:ring-blue-400 w-full"
            onClick={(e) => e.stopPropagation()}
          />
        ) : (
          <div
            onDoubleClick={(e) => {
              e.stopPropagation();
              setIsEditing(true);
            }}
            className="flex items-center justify-between w-full"
          >
            <span
              className={`text-sm font-medium truncate transition-colors ${
                isSelected
                  ? "text-blue-700"
                  : "text-zinc-700 group-hover:text-blue-600"
              }`}
            >
              {el.name || el.type}{" "}
              <span className="text-zinc-400">— {el.id.slice(0, 4)}</span>
            </span>
            <button
              onClick={(e) => {
                e.stopPropagation();
                setIsEditing(true);
              }}
              className="opacity-0 group-hover:opacity-100 transition-opacity text-zinc-400 hover:text-blue-500 ml-2"
              title="Rename"
            >
              <Pencil size={14} />
            </button>
          </div>
        )}
      </div>

      <button
        onClick={(e) => {
          e.stopPropagation();
          deleteElement(el.id);
        }}
        className="p-1.5 text-zinc-500 hover:text-red-500 rounded-lg hover:bg-red-100 transition-colors"
        title="Delete layer"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );
});
