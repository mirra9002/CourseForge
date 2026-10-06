import { useState, useSyncExternalStore } from "react"
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from 'react-redux';
import { isMobileDevice } from '../utils/deviceAccess.js';

function subscribeToDeviceChanges(onChange) {
    window.addEventListener('resize', onChange)
    window.addEventListener('orientationchange', onChange)
    return () => {
        window.removeEventListener('resize', onChange)
        window.removeEventListener('orientationchange', onChange)
    }
}

export default function Topsearcharea(){

    const navigate = useNavigate()
    const isAuthed = useSelector(state => state.auth.status === 'authed')
    const isMobile = useSyncExternalStore(subscribeToDeviceChanges, isMobileDevice)

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
    <section className="bg-[#0b1d3a] px-4 py-12 text-center text-white sm:px-6 sm:py-20 lg:py-24">

        <h1 className="mx-auto mb-4 max-w-4xl text-3xl font-extrabold leading-tight text-balance sm:text-5xl lg:text-6xl">Почніть навчання вже зараз!</h1>
        {!isMobile && <p className="text-lg text-blue-100 sm:text-2xl">Знайдіть щось для себе</p>}
        {isMobile && !isAuthed && (
          <div className="mx-auto mt-6 flex max-w-xl flex-col items-center gap-3 sm:flex-row sm:justify-center sm:gap-5">
            <Link to="/auth/1" className="inline-flex min-h-12 w-full shrink-0 items-center justify-center rounded-full bg-white px-6 py-3 text-sm font-semibold text-blue-800 hover:bg-blue-50 focus-visible:ring-4 focus-visible:ring-blue-300 sm:w-auto">Створити акаунт</Link>
            <p className="max-w-xs text-sm leading-6 text-blue-100 sm:text-left">Реєструйтеся з телефона.<br />Навчайтеся з комп’ютера.</p>
          </div>
        )}

        {/* Keep room for the mascot on tablets and landscape phones. */}
        {isMobile && <div className="hidden sm:block sm:h-24 lg:h-32" aria-hidden="true" />}
        <form hidden={isMobile} role="search" className="mx-auto mt-8 max-w-xl sm:pb-24 lg:pb-32" onSubmit={handleSubmit}>
            <label htmlFor="course-search" className="sr-only">Пошук курсів</label>
            <div className="flex flex-col gap-3 rounded-3xl bg-white p-2 shadow-sm sm:relative sm:block sm:rounded-full sm:p-0 sm:shadow-none">
            <input
                onChange={(e) => handleChange(e)} value={input || ''} name="input"
                type="search"
                id="course-search"
                placeholder="Хочу стати програмістом..."
                className="min-w-0 w-full rounded-full p-4 text-base text-[#0b1d3a] outline-none focus-visible:ring-2 focus-visible:ring-blue-500 sm:pe-28"
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
