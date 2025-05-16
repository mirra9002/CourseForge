export default function Footer(){
    return(<>
     <footer class="bg-white rounded-lg shadow-sm mt-4 ml-4 mr-4 mb-2 dark:bg-gray-800">
        <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400">{new Date().getFullYear()} <a href="#" class="hover:underline">CourseForge</a>
        </span>
        <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
            <li>
                <a href="#" class="hover:underline me-4 md:me-6">Про нас</a>
            </li>
            <li>
                <a href="#" class="hover:underline me-4 md:me-6">Політика використання</a>
            </li>
            <li>
                <a href="#" class="hover:underline">Контакти</a>
            </li>
        </ul>
        </div>
    </footer></>)
}