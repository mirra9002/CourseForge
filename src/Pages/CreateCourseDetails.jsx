import React, { useState, useEffect  } from "react";
import NavBar from '../Components/NavBar'
import AuthInit from '../State/AuthInit'
import DragAndDrop from "../Components/DragAndDrop";

export default function CreateCourseDetails() { // main component
  const [creationStep, setCreationStep] = useState(0)

  const stepMap = {
    0: <CourseDetails/>,
    1: <ModulesDetails/>,
    2: <LessonsDetails/>
  }

  console.log(creationStep)
  return (
    <>
    <AuthInit/>
    <NavBar/>
    <div className="flex flex-row mt-8 gap-8 justify-center items-start ">
      <CourseCreationSteps handleStepChange={(idx) => setCreationStep(idx)}/>
      <div className="flex flex-col gap-4 overflow-y-auto max-h-[815px] bg-white p-6 rounded-lg">
        {stepMap[creationStep]}
      </div>
    </div>
    </>
  );
}


function CourseDetails() { // (1)
    const [courseDetailsData, setCourseDetailsData] = useState({
      title: '',
      description: '',
      category: ''
    })

    function handleDetailsChange(changedProperty, newValue) {
      setCourseDetailsData({...courseDetailsData, [changedProperty]: newValue })
      localStorage.setItem(`create_course_details_${[changedProperty]}`, newValue)
    }

    useEffect(() => {
      const courseTitle = localStorage.getItem("create_course_details_title")
      const courseDescription = localStorage.getItem("create_course_details_description")
      const courseCategory = localStorage.getItem("create_course_details_category")
      setCourseDetailsData({
        "title": courseTitle,
        "description": courseDescription,
        "category": courseCategory
      })
    }, [])

    console.log(courseDetailsData)
    
    return<>
    <h2 class="text-4xl font-bold dark:text-white">Основна інформація про курс</h2>
    <p className="text-3xs mb-6 text-gray-600 max-w-200">Вкажіть основні відомості про ваш курс: назву, короткий опис та категорію. Це допоможе студентам зрозуміти, про що цей курс і чого очікувати від навчання.</p>
    <form class="max-w-xl w-3xl mx-auto mr-72">
         <div class="mb-5">
            <label for="large-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Назва курсу:</label>
            <input type="text" value={courseDetailsData.title} onChange={(e) => handleDetailsChange("title", e.target.value)} id="large-input" class="block w-full p-4 text-gray-900 border border-gray-300 rounded-lg bg-gray-50 text-base focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"/>
        </div>
        <div class="mb-5">
            <label for="large-input" class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Опис курсу:</label>
            <textarea id="message" value={courseDetailsData.description} onChange={(e) => handleDetailsChange("description", e.target.value)} rows="4" class="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Цей курс навчить вас..."></textarea></div>
        <div>
            <label for="small-input" value={courseDetailsData.category} class="block mb-2 text-sm font-medium text-gray-900 dark:text-white">Категорія курсу:</label>
            <DropDown selectedValue={courseDetailsData.category} onSelectedCategory={(value) => handleDetailsChange("category", value)}/>
            </div>
    </form>
    </>
}

function ModulesDetails() {
  const [modules, setModules] = useState([]);

  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("modules_details") || "[]");
    setModules(saved.length ? saved : ["Модуль 1", "Модуль 2"]);
  }, []);

  const handleModulesChange = (nextTitles) => {
    setModules(nextTitles);
    localStorage.setItem("modules_details", JSON.stringify(nextTitles));
  };

  return (
    <>
      <h2 className="text-4xl font-bold dark:text-white">Модулі курсу</h2>
      <p class="text-3xs mb-6 text-gray-600 max-w-200">Модулі — це основні розділи вашого курсу. Вони допомагають структурувати навчання на великі теми чи блоки, всередині яких ви зможете створювати окремі уроки та сторінки. Додайте перші модулі, щоб окреслити головні теми курсу.</p>

      <div className="max-w-xl w-3xl mx-auto mr-72">
        <DragAndDrop
         storedInstanced={"MODULES"}
          initialModules={modules}
          onChange={handleModulesChange}
          addModuleHandleClick={(title, allTitles) => {
            localStorage.setItem("modules_details", JSON.stringify(allTitles));
          }}
        />
      </div>
    </>
  );
}


function LessonsDetails() {
  const [modules, setModules] = useState([]);
  useEffect(() => {
    const saved = JSON.parse(localStorage.getItem("modules_details") || "[]");
    setModules(saved.length ? saved : ["Модуль 1", "Модуль 2"]);
  }, []);

    return<>
    <h2 className="text-4xl font-bold dark:text-white">Уроки курсу</h2>
    <p class="text-3xs mb-6 text-gray-600 max-w-200">Уроки — це окремі частини всередині модулів. Вони деталізують навчальний матеріал та дозволяють крок за кроком пояснити кожну тему. У кожному уроці ви зможете додати текст, відео, завдання чи інші інтерактивні елементи. Додаючи уроки, ви формуєте логічну послідовність навчання для студентів</p>
    
    <h3 className="text-xl font-bold dark:text-white mb-4">Додайти уроки до кожного модуля</h3>
    <div className="max-w-xl w-5xl mx-auto mr-72">
      <ModulesList modules={modules}/>
    </div>
    </>
}

 
function CourseCreationSteps({handleStepChange}) { // main left drawer for course creation steps
  const steps = [
    "Інформація про курс",
    "Модулі",
    "Уроки",
    "Наповення сторінок"
  ];

  const [activeStep, setActiveStep] = useState(0); 

  return (
    <div className="flex min-h-screen">
      <aside className="w-64 -ml-35 border-r border-gray-200 bg-white p-4">
        <h2 className="text-lg font-semibold mb-4">Сплануйте курс</h2>
        <ul className="space-y-2">
          {steps.map((step, index) => (
            <li key={index} onClick={() => {setActiveStep(index)
               handleStepChange(index)}} className={`cursor-pointer rounded-md px-3 py-2 text-sm font-medium transition
              ${activeStep === index ? "bg-blue-600 text-white" : "text-gray-700 hover:bg-gray-100"}`}>
              {step}
            </li>
          ))}
        </ul>
      </aside>
    </div>
  );
}


function DropDown({onSelectedCategory, selectedValue}) {
  return<>
  <select className={`w-64 rounded-lg border border-gray-300 bg-white px-3 py-2 ${selectedValue === 'default' ? 
    "text-gray-400" : "text-gray-700"
  }`}
  value={selectedValue}
  onChange={(e) => {onSelectedCategory(e.target.value)}
  }>
      <option value="default" className="rounded-lg text-gray-400">Категорія курсу</option>
      <option value="practice" className="rounded-lg text-gray-700">Практичний курс</option>
      <option value="theory" className="rounded-lg text-gray-700">Теоретичний курс</option>
  </select>
  
</>
}


function ModulesList({ modules }) {
  const [selectedModule, setSelectedModule] = useState(0);
  const [lessonsByModule, setLessonsByModule] = useState({}); // { [moduleIndex]: string[] }

  // Load from LS and ensure defaults per module
  useEffect(() => {
    const savedMap = JSON.parse(localStorage.getItem("lessons_by_module") || "{}");
    const withDefaults = { ...savedMap };
    modules.forEach((_, idx) => {
      if (!Array.isArray(withDefaults[idx])) {
        withDefaults[idx] = ["Урок 1", "Урок 2"];
      }
    });
    setLessonsByModule(withDefaults);
  }, [modules]);

  const currentLessons = lessonsByModule[selectedModule] || [];

  const persist = (nextLessons) => {
    const nextMap = { ...lessonsByModule, [selectedModule]: nextLessons };
    setLessonsByModule(nextMap);
    localStorage.setItem("lessons_by_module", JSON.stringify(nextMap));
  };

  return (
    <>
      <div className="md:flex">
        {/* Left: modules list */}
        <ul className="flex-column space-y space-y-4 text-sm font-medium text-gray-500 md:me-4 mb-4 md:mb-0">
          {modules.map((module, idx) => (
            <li key={idx}>
              <a
                onClick={() => setSelectedModule(idx)}
                className={`transition max-w-100 w-60 cursor-pointer inline-block px-4 py-3 border-1 border-gray-400 ${
                  selectedModule === idx
                    ? "bg-blue-600 text-white hover:bg-blue-700"
                    : "bg-white text-gray-500 hover:bg-gray-100"
                } rounded-lg`}
              >
                {module.length<=40 ? module : module.substring(0,40)+"..."}
              </a>
            </li>
          ))}
        </ul>

        {/* Right: lessons for the selected module */}
        <div className="p-4 -mr-45 max-w-150 bg-gray-50 text-medium text-gray-500 rounded-lg w-full">
          <DragAndDrop
            storedInstanced={"LESSONS"}
            initialModules={currentLessons}
            onChange={(titles) => persist(titles)}
            addModuleHandleClick={(title, allTitles) => persist(allTitles)}
          />
        </div>
      </div>
    </>
  );
}
