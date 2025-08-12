import { useState } from "react"
import { useNavigate } from "react-router-dom";
import { searchCourses } from "../utils/search-top-courses";
export default function Topsearcharea({courses}){

    if(!courses) return null
    const navigate = useNavigate()
    console.log(courses);

    const [input, setInput] = useState('');
    function handleChange(e) {
        setInput(e.target.value)
        
    }
    function handleSubmit(e) {
        e.preventDefault(); 
        if (input.trim()) {
            navigate(`/search?q=${encodeURIComponent(input.trim())}`);
        }
    }
    


    return(<>
    <section class="bg-[#0b1d3a] text-white py-24 px-4 text-center">

        <h1 class="text-5xl font-extrabold mb-4">Почніть навчання вже зараз!</h1>
        <p class="text-2xl mb-8">Знайдіть щось для себе</p>

        <form class="max-w-md mx-auto pb-32" onSubmit={handleSubmit}>
            <div class="relative">
            <input
                onChange={(e) => handleChange(e)} value={input || ''} name="input"
                type="search"
                placeholder="Хочу стати програмістом..."
                class="w-full p-4 pe-16 text-sm text-[#0b1d3a]  rounded-lg"
                required
            />
            <button
                type="submit"
                class="cursor-pointer absolute end-2.5 bottom-2.5 text-white bg-blue-700 hover:bg-blue-700 font-medium rounded-lg text-sm px-4 py-2"
            >
                Пошук
            </button>
            </div>
        </form>
        
    </section></>)
}