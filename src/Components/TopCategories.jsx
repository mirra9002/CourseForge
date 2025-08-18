import mascot_main2 from '../assets/mascot_main2.png'
export default function TopCategories() {
  
    const categories = [
        { title: "Programming" },
        { title: "Web Development" },
        { title: "Machine Learning" },
        { title: "QA Engineer" },
        { title: "Mobile App Development" },
        { title: "Data Science" },
        { title: "Cybersecurity" },
        { title: "Cloud Computing" },
        { title: "Game Development" },
        { title: "UI/UX Design" },
        { title: "DevOps" },
        { title: "Artificial Intelligence" },
        { title: "Blockchain" },
        { title: "Database Management" },
        { title: "Internet of Things (IoT)" },
        { title: "Software Architecture" },
        { title: "AR/VR Development" },
        { title: "IT Support" },
        { title: "Embedded Systems" },
        { title: "Big Data Analytics" }
    ];


    return (
    <div className="flex justify-center ">
        <div className="grid grid-cols-2 gap-4 p-6 w-max max-w-7xl">
            {categories.map((category, index) => (
            <div key={index} className="p-6 bg-white rounded-lg  dark:bg-gray-800 "> 
                <span class="bg-blue-100 text-blue-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-blue-900 dark:text-blue-300">Practical</span>
                <span class="bg-green-100 text-green-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-green-900 dark:text-green-300">Easy</span>
                <span class="bg-yellow-100 text-yellow-800 text-sm font-medium me-2 px-2.5 py-0.5 rounded-full dark:bg-yellow-900 dark:text-yellow-300">Yellow</span>
                <h5 class="mb-4 mt-4 text-4xl font-bold tracking-tight text-gray-900 dark:text-white">{category.title}</h5>
                
                <div id='div-info' className="mb-4">
                    <p class="mb-3 text-gray-500 dark:text-gray-400 font-normal  ">Track work across the enterprise through an open, collaborative platform. Link issues across Jira and ingest data from other software development tools, so your IT support and operations teams have richer contextual information to rapidly respond to requests, incidents, and changes.</p>
                 </div>
                
                <button type="button" class="w-full py-2.5 px-5 me-2 mb-2 text-sm font-medium text-gray-900 focus:outline-none bg-white rounded-full border border-gray-200 hover:bg-gray-100 hover:text-blue-700 focus:z-10 focus:ring-4 focus:ring-gray-100 dark:focus:ring-gray-700 dark:bg-gray-800 dark:text-gray-400 dark:border-gray-600 dark:hover:text-white dark:hover:bg-gray-700">Details</button>
                </div>
            ))}
        </div>
    </div>

    );
}