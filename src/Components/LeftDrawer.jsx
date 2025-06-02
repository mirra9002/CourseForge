import { useEffect, useRef, useState } from "react";
import { Drawer } from "flowbite";
import { ModuleItem } from "./ModuleItem";

export default function LeftDrawer({ width, backgroundColor, textColor, moduleBackgoundColor, moduleHoverBackgroundColor, moduleHeaderTextColor, moduleTextColor }) {
  const [openIndex, setOpenIndex] = useState(null);

  useEffect(() => {
    const drawerEl = document.getElementById("drawer-left-lesson-modules");
    const drawer = new Drawer(drawerEl, {
      placement: "left",
      backdrop: false,
      bodyScrolling: true,
    });
    drawer.show();
  }, []);

  const modules = [
    {
      title: "Що таке змінна?",
      content: "Змінна — це контейнер для збереження даних у програмі.",
    },
    {
      title: "Як писати коментарі",
      content: "Коментарі — це рядки, які ігноруються при виконанні коду. Коментарі — це рядки, які ігноруються при виконанні коду. Коментарі — це рядки, які ігноруються при виконанні коду. Коментарі — це рядки, які ігноруються при виконанні коду. Коментарі — це рядки, які ігноруються при виконанні коду.",
    },
    {
      title: "Як запускати код",
      content: "Код можна запускати натиснувши кнопку Run або через термінал.",
    },
  ];

  return (
    <div
      id="drawer-left-lesson-modules"
      className={`fixed top-16 left-0 z-10 h-screen p-4 overflow-y-auto transition-transform ${backgroundColor} ${width}`}
      tabIndex={-1}
      aria-labelledby="drawer-left-label"
    >
      <h4 className={`inline-flex items-center mb-4 text-xl mt-4 font-semibold ${textColor}`}>
        Список модулів
      </h4>

      <div className="flex flex-col gap-2">
        {modules.map((mod, index) => (
          <ModuleItem
            key={index}
            title={mod.title}
            content={mod.content}
            isOpen={openIndex === index}
            onClick={() => setOpenIndex(openIndex === index ? null : index)}
            backgroundColor={moduleBackgoundColor}
            hoverBackgroundColor={moduleHoverBackgroundColor}
            textHeaderColor={moduleHeaderTextColor}
            textColor={moduleTextColor}
            />
        ))}
      </div>
    </div>
  );
}