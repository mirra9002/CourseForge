import {useState, useEffect} from 'react'
import { useLoaderData } from 'react-router-dom';
import Navbar from "../Components/NavBar";
import AuthInit from '../State/AuthInit';
import {sendUserRegister, sendUserLogin} from '../sending-data.js'

import { useNavigate } from 'react-router-dom';

// import { setLoading, setUser, setError } from "../State/authSlice"; 
import { useSelector, useDispatch } from "react-redux";
import {login, logout} from '../State/authSlice.js'


export default function Auth() {
    useEffect(() => {window.scrollTo(0,0)},[]) 
    const navigate = useNavigate()
    const dispatch = useDispatch()
    const isRegister = useLoaderData() 

    const [input, setInput] = useState({})
    const handleChange = (e) => {
        const {name, value} = e.target
        setInput(prev => ({
            ...prev,
            [name]: value
        }))
    }

    function handleLogin(userData) {
        console.log('logging...', userData);
        dispatch(login(userData))
        setTimeout(() => {
            navigate((-1))
        }, 300)
    }

    function handleRegister(userData) {
        dispatch(login(userData))
    }


    return (
    <>
    <Navbar/>
    <div className='-mt-20'>
        {isRegister === 1 ? 
        <Register input={input} handleChange={handleChange} registerUser={(data) => handleRegister(data)} /> :
        <LogIn input={input} handleChange={handleChange} loginUser={(data) => handleLogin(data)}/>}
    </div>
    </>
    
  );
}

function Register({input, handleChange, registerUser}) {

    const navigate = useNavigate()

    const [error, setError] = useState({isError: null, message: null})
    const [success, setSuccess] = useState(null)

    async function sendData(data) {
        setError({isError: null, message: null})
        setSuccess(null)
        
        const responseRegister = await sendUserRegister(data)
        if(responseRegister.error) {
            authErrorHandling(responseRegister.data)
           return 
        }

        const responseLogin = await sendUserLogin({username: data.username, password: data.password})
        if(responseLogin.error) {
            authErrorHandling(responseRegister.data)
            return 
        }

        console.log('error status2:', error, success);
        
        const res = await fetch("/api/me", { credentials: "include" });
        const me = res.ok ? await res.json() : null;

        setError(false)
        registerUser(me)
        handleLogin()

    }

    function authErrorHandling(data){
        console.log(data);
        if(data.username){
            setError(prev => ({...prev, isError: true, message: data.username[0]}));
        } else if (data.email) {
            setError(prev => ({...prev, isError: true, message: data.email[0]}));
        } else if (data.non_field_errors) {
            setError(prev => ({...prev, isError: true, message: data.non_field_errors[0]}));
        } else if (data.password){
            setError(prev => ({...prev, isError: true, message: data.password[0]}));
        }
         else {
            setError(prev => ({...prev, isError: true, message: "Invalid credentials"}));
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
            <div>
                <input 
                    onChange={(e) => handleChange(e)} value={input.re_password || ''} name="re_password"
                    type="password" id="re_password" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Repeat password" required />
            </div>
            <div class="flex items-start">
                <label for="terms" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Already have an account? <a href="#" onClick={(e)=> {e.preventDefault(); navigate('/auth/0')}} class="text-blue-600 hover:underline dark:text-blue-500">Log In</a></label>
            </div>
            {error.isError && <p className="text-red-500 text-sm">{error.message}</p>}
            {success && <p className="text-green-500 text-sm">Successfully registered!</p>}
            <button onClick={(e) => {e.preventDefault(); sendData(input)}} type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Register</button>
            </form>
        </div>
        </div>
    </>
}

function LogIn({input, handleChange, loginUser}) {
    
    const navigate = useNavigate()
    const [error, setError] = useState(null)
    const [success, setSuccess] = useState(null)


    async function sendData(data){
        setError(null)
        setSuccess(null)
        const me = await sendUserLogin({username: data.username, password: data.password})
        
        if(!me) {
            setError(true)
            return null
        }

        setError(false)
        loginUser({username: data.username, password: data.password})
       // handleLogin()
    }

    
    return  <>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 dark:bg-gray-900 px-4">
    <div class="w-full max-w-md p-8 bg-white border border-gray-200 rounded-2xl shadow-md">
        <h2 class="text-3xl font-semibold text-gray-900 dark:text-white mb-6 text-center">Login</h2>
    
        <form class="space-y-6">
        <div>
            <input onChange={(e) => handleChange(e)} value={input.username || ''} name="username"
            type="username" id="username" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Email or username" required />
        </div>
        <div>
            <input onChange={(e) => handleChange(e)} value={input.password || ''} name="password"
            type="password" id="password" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500" placeholder="Password" required />
        </div>
        <div class="flex items-start">
            <label for="terms" class="ms-2 text-sm font-medium text-gray-900 dark:text-gray-300">Don't have an account? <a onClick={(e)=> {e.preventDefault(); navigate('/auth/1')}} href="#" class="text-blue-600 hover:underline dark:text-blue-500">Register</a></label>
        </div>
        {error && <p className="text-red-500 text-sm">Invalid credentials!</p>}
        {success && <p className="text-green-500 text-sm">Successfully logged in!</p>}
        <button onClick={(e) => {e.preventDefault(); sendData(input)}} type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-3 text-center dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">Log In</button>
        </form>
    </div>
    </div>
    </>
}