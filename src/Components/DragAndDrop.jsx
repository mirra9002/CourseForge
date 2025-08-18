// DragAndDrop.jsx
import { useRef, useState, useEffect } from "react";
import iconDelete from '../assets/icon_delete.svg'

export default function DragAndDrop({
  initialModules = ["Модуль 1", "Модуль 2"],
  onChange,
  addModuleHandleClick,
}) {
  const MIN_MODULES = 2;
  const containerRef = useRef(null);
  const draggingIdRef = useRef(null);
  const isDraggingRef = useRef(false);
  const [editingId, setEditingId] = useState(null);

  const [items, setItems] = useState(
    initialModules.map((title, i) => ({ id: `${i}-${title}`, title }))
  );

  function handleDragEnd(e) {
    e.currentTarget.classList.remove("opacity-60","outline","outline-2","outline-blue-500");
    draggingIdRef.current = null;
    isDraggingRef.current = false;
    onChange?.(items.map(x => x.title));
  }

function handleRename(id, newTitle) {
  const updated = items.map(it => it.id === id ? { ...it, title: (newTitle ?? "").trim() || it.title } : it);
  setItems(updated);
  onChange?.(updated.map(x => x.title)); // name changed
  setEditingId(null);
}
  // sync props
  useEffect(() => {
    setItems(prev => {
      const byTitle = new Map(prev.map(it => [it.title, it.id]));
      return initialModules.map((title, i) => ({
        id: byTitle.get(title) || `${i}-${title}`,
        title,
      }));
    });
  }, [initialModules]);

  function handleAddModule() {
    const nextIndex = items.length + 1;
    const newItem = { id: `new-${Date.now()}`, title: `Модуль ${nextIndex}` };
    const next = [...items, newItem];
    setItems(next);
    onChange?.(next.map(x => x.title));
    addModuleHandleClick?.(newItem.title, next.map(x => x.title));
  }

  function handleDragStart(e, id) {
    draggingIdRef.current = id;
    isDraggingRef.current = true;
    e.dataTransfer.effectAllowed = "move";
    e.dataTransfer.setData("text/plain", id);
    e.currentTarget.classList.add("opacity-60", "outline", "outline-2", "outline-blue-500");
  }

  function handleDragEnd(e) {
    e.currentTarget.classList.remove("opacity-60", "outline", "outline-2", "outline-blue-500");
    draggingIdRef.current = null;
    isDraggingRef.current = false;
    onChange?.(items.map(x => x.title));
  }

  function handleDragOver(e) {
    e.preventDefault();
    const container = containerRef.current;
    const draggingId = draggingIdRef.current;
    if (!container || !draggingId) return;

    const afterEl = getAfterElement(container, e.clientY);
    const newOrder = reorder(items, draggingId, afterEl?.dataset.id || null);
    if (newOrder) {
      setItems(newOrder);
    }
  }

  function handleDrop(e) { e.preventDefault(); }

  function handleRename(id, newTitle) {
    const updated = items.map(it => it.id === id ? { ...it, title: (newTitle ?? "").trim() || it.title } : it);
    setItems(updated);
    onChange?.(updated.map(x => x.title)); 
    setEditingId(null);
  }

  function handleDelete(id) {
    const next = items.filter(it => it.id !== id);
    setItems(next);
    onChange?.(next.map(x => x.title)); // синхронизируем наружу и в LS у родителя
  }
  return (
    <div className="max-w-2xl">
      <ul
        ref={containerRef}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className="space-y-2"
        role="list"
        aria-label="Список модулів (перетягуйте для зміни порядку)"
      >
        {items.map(item => (
         <li
          key={item.id}
          data-id={item.id}
          draggable={editingId !== item.id}
          onDragStart={e => handleDragStart(e, item.id)}
          onDragEnd={handleDragEnd}
          onDoubleClick={() => setEditingId(item.id)}
          className="flex items-center justify-between rounded-lg border border-slate-300 bg-white px-4 py-3 shadow-sm cursor-grab active:cursor-grabbing"
        >
          {editingId === item.id ? (
            <input
              autoFocus
              defaultValue={item.title}
              onBlur={e => handleRename(item.id, e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter") handleRename(item.id, e.target.value);
                if (e.key === "Escape") setEditingId(null);
              }}
              className="w-full border border-slate-300 rounded px-2 py-1 text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          ) : (
            <>
              <span className="text-slate-800 select-none">{item.title}</span>

              <div className="flex items-center gap-2">
                {/* Кнопка-галочка удаления */}
                <button
                  type="button"
                  aria-label={`Удалить ${item.title}`}
                  title="Удалить модуль"
                  onMouseDown={(e) => { e.stopPropagation(); }} // не даём начаться drag
                  onClick={(e) => {
                    e.stopPropagation();
                    handleDelete(item.id);
                  }}
                  className="inline-flex h-6 w-6 items-center justify-center rounded-full  border-slate-300 text-xs leading-none">
                  <img src={iconDelete}/>
                </button>

                {/* «ручка» для наглядности */}
                <span className="text-slate-400 select-none">⋮⋮</span>
              </div>
            </>
          )}
        </li>

        ))}
      </ul>

      <button
        type="button"
        onClick={handleAddModule}
        className="mt-4 inline-flex items-center rounded-lg bg-blue-600 px-4 py-2 text-white hover:bg-blue-700"
      >
        Додати модуль
      </button>
    </div>
  );
}

// helpers (без изменений)
function reorder(list, draggingId, afterId) {
  if (!draggingId || draggingId === afterId) return null;
  const next = [...list];
  const fromIdx = next.findIndex(x => x.id === draggingId);
  if (fromIdx === -1) return null;
  const [moved] = next.splice(fromIdx, 1);
  if (afterId === null) next.push(moved);
  else {
    const toIdx = next.findIndex(x => x.id === afterId);
    next.splice(toIdx, 0, moved);
  }
  return next;
}
function getAfterElement(container, y) {
  const els = [...container.querySelectorAll("li:not(.opacity-60)")];
  return els.reduce(
    (closest, el) => {
      const box = el.getBoundingClientRect();
      const offset = y - (box.top + box.height / 2);
      return offset < 0 && offset > closest.offset ? { offset, element: el } : closest;
    },
    { offset: Number.NEGATIVE_INFINITY, element: null }
  ).element;
}
