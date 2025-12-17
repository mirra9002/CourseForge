import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';

export default function Footer(){
    const navigate = useNavigate()
    return(<>
     <footer class="bg-white rounded-lg shadow-sm mt-4 ml-4 mr-4 mb-2 dark:bg-gray-800">
        <div class="w-full mx-auto max-w-screen-xl p-4 md:flex md:items-center md:justify-between">
        <span onClick={() => navigate('/documentation')} class="text-sm text-gray-500 sm:text-center dark:text-gray-400">{new Date().getFullYear()} | <a href="#" class="hover:underline">Розробка інтерактивної платформи для навчання інформаційним технологіям CourseForge</a>
        </span>
        <ul class="flex flex-wrap items-center mt-3 text-sm font-medium text-gray-500 dark:text-gray-400 sm:mt-0">
            <li>
                <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400 me-4 md:me-6">Чвалюк Мірра</span>
            </li>
            <li>
                <span class="text-sm text-gray-500 sm:text-center dark:text-gray-400 me-4 md:me-6">Мірошниченко Тимофій</span>
            </li>
            <li>
                <p onClick={() => navigate('/documentation')} class="hover:underline me-4 md:me-6">Документація</p>
            </li>
        </ul>
        </div>
    </footer></>)
}