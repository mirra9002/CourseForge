import { Link } from "react-router-dom"
import { useEffect } from "react"

export default function Notfound(){
    useEffect(() => {window.scrollTo(0,0)},[])
    return(<>
    

        <section class="bg-white">
        <div class="py-8 px-4 mx-auto max-w-screen-xl lg:py-16 lg:px-6">
            <div class="mx-auto max-w-screen-sm text-center">
                <h1 class="mb-4 text-7xl tracking-tight font-extrabold lg:text-9xl text-primary-600">404</h1>
                <p class="mb-4 text-3xl tracking-tight font-bold text-gray-900 md:text-4xl">Помилка</p>
                <p class="mb-4 text-lg font-light text-gray-500">Схоже, ви заблукали </p>
                
            
            <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 me-2 mb-2 focus:outline-none"><Link to="/">На головну</Link></button>
            
            </div>   
        </div>
    </section>
    </>)
}