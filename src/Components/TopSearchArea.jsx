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
    <section className="bg-[#0b1d3a] text-white px-4 py-16 text-center sm:py-20 lg:py-24">

        <h1 className="mx-auto mb-4 max-w-4xl text-4xl font-extrabold leading-tight sm:text-5xl lg:text-6xl">Почніть навчання вже зараз!</h1>
        <p className="mb-8 text-lg sm:text-2xl">Знайдіть щось для себе</p>

        <form className="mx-auto max-w-xl pb-8 sm:pb-24 lg:pb-32" onSubmit={handleSubmit}>
            <div className="flex flex-col gap-3 rounded-3xl bg-white p-2 shadow-sm sm:relative sm:block sm:rounded-full sm:p-0 sm:shadow-none">
            <input
                onChange={(e) => handleChange(e)} value={input || ''} name="input"
                type="search"
                placeholder="Хочу стати програмістом..."
                className="w-full rounded-full p-4 text-sm text-[#0b1d3a] outline-none sm:pe-28"
                required
            />
            <button
                type="submit"
                className="cursor-pointer rounded-full bg-blue-700 px-4 py-3 text-sm font-medium text-white hover:bg-blue-800 sm:absolute sm:bottom-2 sm:end-2 sm:py-2"
            >
                Пошук
            </button>
            </div>
        </form>
        
    </section></>)
}
