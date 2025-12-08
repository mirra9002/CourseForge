import { useNavigate } from "react-router-dom";
const categories = [
  { 
    title: "Programming", 
    shortname: "programming",
    description: "Вивчення основ створення програмного забезпечення: від змінних і структур даних до алгоритмів та принципів написання чистого коду. Навчання програмуванню формує технічне мислення, дозволяє розв’язувати складні задачі та створювати власні програмні рішення для будь-яких сфер.",
    tags: ["practical", "medium"]
  },
  { 
    title: "Web Development", 
    shortname: "web",
    description: "Вивчення технологій створення сайтів та веб-додатків. Сюди входять верстка інтерфейсів (HTML, CSS), програмування логіки на JavaScript, а також робота з сервером та базами даних. Дозволяє створювати сучасні, швидкі та адаптивні веб-сервіси.",
    tags: ["practical", "easy"]
  },
  // { 
  //   title: "Machine Learning", 
  //   shortname: "ml",
  //   description: "Розділ штучного інтелекту, де системи навчаються на даних і роблять прогнози або автоматичні рішення. Застосовується у розпізнаванні зображень, рекомендаційних сервісах, робототехніці, фінансовому аналізі й багато де ще. Вимагає знання математики та Python.",
  //   tags: ["theoretical", "hard"]
  // },
  // { 
  //   title: "QA Engineer", 
  //   shortname: "qa",
  //   description: "Тестування програмного забезпечення для виявлення помилок, покращення стабільності та якості продукту. Включає написання тест-кейсів, роботу з інструментами автоматизації та розуміння логіки систем. Розвиває уважність до деталей і системне мислення.",
  //   tags: ["practical", "easy"]
  // },
  // { 
  //   title: "Mobile App Development", 
  //   shortname: "mobile",
  //   description: "Створення мобільних додатків для смартфонів та планшетів на iOS і Android. Включає дизайн інтерфейсу, програмування функціоналу, оптимізацію продуктивності й роботу з API. Дає можливість створювати сервіси, якими люди користуються щодня.",
  //   tags: ["practical", "medium"]
  // },
  // { 
  //   title: "Data Science", 
  //   shortname: "data-science",
  //   description: "Аналіз великих та складних наборів даних для пошуку корисних закономірностей і побудови моделей прогнозування. Поєднує програмування, статистику, математичний аналіз та аналітичне мислення. Застосовується в бізнесі, науці, медицині, економіці й технологіях.",
  //   tags: ["theoretical", "hard"]
  // },
  // { 
  //   title: "Cybersecurity", 
  //   shortname: "cybersecurity",
  //   description: "Захист інформаційних систем від хакерських атак, витоків та шкідливого програмного забезпечення. Включає аналіз вразливостей, налаштування безпечної інфраструктури, моніторинг загроз і реагування на інциденти. Критично важливо для будь-якої організації.",
  //   tags: ["practical", "medium"]
  // },
  // { 
  //   title: "Cloud Computing", 
  //   shortname: "cloud",
  //   description: "Використання хмарних платформ для розгортання та масштабування програм. Дозволяє будувати надійні й доступні системи, що працюють без прив’язки до одного фізичного серверу. Основні приклади: AWS, Azure, Google Cloud.",
  //   tags: ["practical", "medium"]
  // },
  // { 
  //   title: "Game Development", 
  //   shortname: "gamedev",
  //   description: "Процес створення відеоігор: розробка механік, програмування взаємодії, робота з графікою, фізикою та звуком. Об’єднує творчість та інженерію, а також вимагає розуміння користувацького досвіду та художнього бачення.",
  //   tags: ["practical", "medium"]
  // },
  // { 
  //   title: "UI/UX Design", 
  //   shortname: "design",
  //   description: "Створення інтерфейсів, що зручні, зрозумілі та приємні користувачу. Включає роботу з макетами, кольорами, типографією, поведінковою логікою та тестуванням взаємодій. Спрямоване на покращення користувацького досвіду.",
  //   tags: ["practical", "easy"]
  // },
  // { 
  //   title: "DevOps", 
  //   shortname: "devops",
  //   description: "Автоматизація процесів розробки, тестування та розгортання програмного забезпечення. Допомагає робити випуски оновлень стабільнішими та швидшими. Включає CI/CD, контейнеризацію, моніторинг і роботу з хмарними сервісами.",
  //   tags: ["practical", "hard"]
  // },
  // { 
  //   title: "Artificial Intelligence", 
  //   shortname: "ai",
  //   description: "Створення систем, здатних аналізувати дані, ухвалювати рішення та взаємодіяти з людиною. Включає генеративні моделі, обробку природної мови, комп’ютерний зір і робототехніку. Використовується від голосових помічників до автономних авто.",
  //   tags: ["theoretical", "hard"]
  // },
  // { 
  //   title: "Blockchain", 
  //   shortname: "blockchain",
  //   description: "Технологія децентралізованого зберігання даних, що унеможливлює їх підробку. Використовується у криптовалютах, смарт-контрактах, фінансових механізмах та системах прозорих звітностей.",
  //   tags: ["theoretical", "medium"]
  // },
  // { 
  //   title: "Database Management", 
  //   shortname: "database",
  //   description: "Проєктування структур зберігання даних, налаштування швидкого доступу, оптимізація запитів та забезпечення безпеки інформації. Є основою стабільної роботи будь-якої цифрової системи.",
  //   tags: ["practical", "medium"]
  // },
  // { 
  //   title: "Internet of Things (IoT)", 
  //   shortname: "iot",
  //   description: "Підключення пристроїв до мережі для збору, передачі та аналізу даних. Використовується у розумних будинках, медицині, транспорті, промисловості та побутовій техніці.",
  //   tags: ["practical", "medium"]
  // },
  // { 
  //   title: "Software Architecture", 
  //   shortname: "architecture",
  //   description: "Проєктування структури великих програмних систем, визначення способів взаємодії компонентів і вибір технологічних рішень. Робить продукти масштабованими, зрозумілими та підтримуваними.",
  //   tags: ["theoretical", "hard"]
  // },
  // { 
  //   title: "AR/VR Development", 
  //   shortname: "ar-vr",
  //   description: "Створення додатків, які поєднують реальний світ із віртуальними об’єктами або повністю створюють віртуальне середовище. Використовується у навчанні, медицині, мистецтві та ігровій індустрії.",
  //   tags: ["practical", "medium"]
  // },
  // { 
  //   title: "IT Support", 
  //   shortname: "it-support",
  //   description: "Підтримка користувачів і забезпечення стабільної роботи обладнання та програмного забезпечення. Включає діагностику проблем, спілкування з користувачами та налаштування систем.",
  //   tags: ["practical", "easy"]
  // },
  // { 
  //   title: "Embedded Systems", 
  //   shortname: "embedded",
  //   description: "Розробка програм для мікроконтролерів і пристроїв, які виконують конкретні функції. Використовується в автомобільній електроніці, побутовій техніці, робототехніці та безпілотних системах.",
  //   tags: ["theoretical", "hard"]
  // },
  // { 
  //   title: "Big Data Analytics", 
  //   shortname: "big-data",
  //   description: "Обробка великих обсягів даних для пошуку закономірностей і тенденцій. Допомагає бізнесу приймати точні рішення, оптимізувати процеси та прогнозувати майбутні результати.",
  //   tags: ["theoretical", "hard"]
  // }
];


export function getTitleByShortname(shortname) {
    const category = categories.find(c => c.shortname === shortname);
    return category ? category.title : null;    
}
export default function TopCategories() {


    const navigate = useNavigate()


    return (
    <div className="flex justify-center ">
        <div className="grid grid-cols-2 gap-4 p-6 w-max max-w-7xl">
            {categories.map((category, index) => (
            <div key={index} className="p-6 bg-white rounded-lg  dark:bg-gray-800 "> 
                {category.tags.includes('practical') ? <span class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full ">Практика</span> : null}
                {category.tags.includes('theoretical') ? <span class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full ">Теорія</span> : null}
                {category.tags.includes('easy') ? <span class="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full  ">Простий</span> : null}
                {category.tags.includes('medium') ? <span class="bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full  ">Середній</span> : null}
                {category.tags.includes('hard') ? <span class="bg-red-100 text-red-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full ">Складний</span> : null}
                
                
                <h5 class="mb-4 mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{category.title}</h5>
                
                <div id='div-info' className="mb-4">
                    <p class="mb-3 text-gray-500 dark:text-gray-400 font-normal  ">{category.description}</p>
                 </div>
                
                <button onClick={() => navigate(`/category/${category.shortname}`)} type="button" class="w-full py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Details</button>
                </div>
            ))}
        </div>
    </div>

    );
}