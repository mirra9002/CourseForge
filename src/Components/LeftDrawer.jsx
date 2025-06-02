import { useEffect } from "react";
import { Drawer } from "flowbite"; // or whatever drawer lib you're using

export default function LeftDrawer({width, backgroundColor, textColor}) {
  useEffect(() => {
    const drawerEl = document.getElementById('drawer-left-lesson-modules');
    const drawer = new Drawer(drawerEl, {
      placement: 'left',
      backdrop: false,
      bodyScrolling: true
    });
    drawer.show(); 
  }, []);

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
        {[
            "Що таке змінна?",
            "Як писати коментарі",
            "Як запускати код",
        ].map((text, index) => (
            <div
            key={index}
            className="px-4 py-2 rounded-sm bg-[#2a2a2a] hover:bg-[#333] text-gray-200 cursor-pointer transition"
            >
            {text}
            </div>
        ))}
        </div>
    </div>
  );
}
