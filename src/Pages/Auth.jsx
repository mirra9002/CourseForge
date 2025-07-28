import {useState} from 'react'
import { useLoaderData } from 'react-router-dom';
import Navbar from "../Components/NavBar";
import {sendUserRegister} from '../sending-data.js'
import { useNavigate } from 'react-router-dom';
export default function Auth() {

    // 0 -> login; 1 -> register

    const isRegister = useLoaderData() 
    
    return (
    <>
    <Navbar/>
    {isRegister === 1 ? <Register/> : <LogIn/>}
    </>
  );
}

function Register() {
    const navigate = useNavigate()
    const [input, setInput] = useState({})
    const [success, setSuccess] = useState(false)
    const [fail, setFail] = useState(false)

    const handleChange = (e) => {
        const {name, value} = e.target
        setInput(prev => ({
            ...prev,
            [name]: value
        }))
        setFail(false)
        setSuccess(false)
        console.log(input);
    }

    const sendData = async (data) => {
        

        const response = await sendUserRegister(data)
        console.log('RESPONSE', response);

        if(response.id){
            setSuccess(true)
            setTimeout(() => {
               navigate('/')
            }, 1000)
            
        } else {
            setFail(true)
        }
    }


    return  <>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md p-8 bg-white border border-gray-200 rounded-2xl shadow-md">
        <h2 class="text-3xl font-semibold text-gray-900 dark:text-white mb-6 text-center">Register</h2>
    
        <form class="space-y-6">
            <div>
            <input 
                onChange={(e) => handleChange(e)} value={input.username || ''} name="username"
                type="username" id="username" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Username" required />
        </div>
        <div>
            <input 
                onChange={(e) => handleChange(e)} value={input.email || ''} name="email"
                type="email" id="email" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email" required />
        </div>
        <div>
            <input 
                onChange={(e) => handleChange(e)} value={input.password || ''} name="password"
                type="password" id="password" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Password" required />
        </div>
        <div class="flex items-start">
            <label for="terms" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Already have an account? <a href="#" class="text-blue-600 hover:underline dark:text-blue-500">Log In</a></label>
        </div>
        {success && (
            <p className="text-sm text-green-600 text-center">Successfully registered!</p>
        )}
        {fail && (
            <p className="text-sm text-red-600 text-center">Invalid input!</p>
        )}
        <button onClick={(e) => {e.preventDefault(); sendData(input)}} type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register</button>
        </form>
    </div>
    </div>
    </>
}

function LogIn() {
    return  <>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md p-8 bg-white border border-gray-200 rounded-2xl shadow-md">
        <h2 class="text-3xl font-semibold text-gray-900 dark:text-white mb-6 text-center">Login</h2>
    
        <form class="space-y-6">
        <div>
            <input type="email" id="email" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email or username" required />
        </div>
        <div>
            <input type="password" id="password" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Password" required />
        </div>
        <div class="flex items-start">
            <label for="terms" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Don't have an account? <a href="#" class="text-blue-600 hover:underline dark:text-blue-500">Register</a></label>
        </div>
        <button type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Log In</button>
        </form>
    </div>
    </div>
    </>
}