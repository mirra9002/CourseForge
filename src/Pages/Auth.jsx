import {useState, useEffect} from 'react'
import { useLoaderData } from 'react-router-dom';
import { GoogleLogin } from '@react-oauth/google';
import {sendUserRegister, sendUserLogin, sendGoogleLogin} from '../sending-data.js'
import { getMe } from '../fetching-data.js';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from "react-redux";

import Navbar from "../Components/NavBar";

import {login} from '../State/authSlice.js'
import { GOOGLE_OAUTH_CLIENT_ID } from '../../dev_data.js';


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
        console.log('handleLogin');
        dispatch(login(userData))
        navigate(('/'))
    }

    function handleRegister(userData) {
        console.log('handleReg');
        dispatch(login(userData))
        navigate(('/'))
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
            console.log('error while registering...');
           return 
        }
        
        const res = await sendUserLogin({username: data.username, password: data.password})
        console.log('res', res);
        if(!res || res.error) {
            setError({isError: true, message: res.data.detail})
            return null
        }

        const me = await getMe()
        console.log('meres', me);
        if(!me){
            setError({isError: true, message: "Cannot fetch user"})
            return
        }
        registerUser(me)


    }

    async function handleGoogleSuccess(credentialResponse) {
        setError({isError: null, message: null})
        setSuccess(null)

        if(!credentialResponse?.credential){
            setError({isError: true, message: "Google did not return a credential"})
            return
        }

        const res = await sendGoogleLogin(credentialResponse.credential)
        if(!res || res.error) {
            setError({isError: true, message: res?.message || "Google sign-in failed"})
            return
        }

        const me = await getMe()
        if(!me){
            setError({isError: true, message: "Cannot fetch user"})
            return
        }

        registerUser(me)
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
        <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div class="w-full max-w-md p-8 bg-white border border-gray-200 rounded-2xl shadow-md">
            <h2 class="text-3xl font-semibold text-gray-900 mb-6 text-center">Зарєструватися</h2>
        
            <form class="space-y-6">
                <div>
                <input 
                    onChange={(e) => handleChange(e)} value={input.username || ''} name="username"
                    type="username" id="username" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3" placeholder="Username" required />
            </div>
            <div>
                <input 
                    onChange={(e) => handleChange(e)} value={input.email || ''} name="email"
                    type="email" id="email" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3" placeholder="Email" required />
            </div>
            <div>
                <input 
                    onChange={(e) => handleChange(e)} value={input.password || ''} name="password"
                    type="password" id="password" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3" placeholder="Password" required />
            </div>
            <div>
                <input 
                    onChange={(e) => handleChange(e)} value={input.re_password || ''} name="re_password"
                    type="password" id="re_password" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3" placeholder="Repeat password" required />
            </div>
            <div class="flex items-start">
                <label for="terms" class="ms-2 text-sm font-medium text-gray-900">Вже маєте акаунт? <a href="#" onClick={(e)=> {e.preventDefault(); navigate('/auth/0')}} class="text-blue-600 hover:underline">Увійти</a></label>
            </div>
            {error.isError && <p className="text-red-500 text-sm">{error.message}</p>}
            {success && <p className="text-green-500 text-sm">Successfully registered!</p>}
            <button onClick={(e) => {e.preventDefault(); sendData(input)}} type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-3 text-center">Register</button>
            <GoogleAuthOption onSuccess={handleGoogleSuccess} onError={() => setError({isError: true, message: "Google sign-in was cancelled or failed"})} />
            </form>
        </div>
        </div>
    </>
}

function LogIn({input, handleChange, loginUser}) {
    
    const navigate = useNavigate()
    const [error, setError] = useState({isError: false, message: ''})
    const [success, setSuccess] = useState(null)


    async function sendData(data){
        setError(null)
        setSuccess(null)
        const res = await sendUserLogin({username: data.username, password: data.password})
        console.log(res);
        
        if(!res || res.error) {
            setError({isError: true, message: res.data.detail})
            return null
        }
        
        setError(false)
        loginUser({username: data.username, password: data.password})
    }

    async function handleGoogleSuccess(credentialResponse) {
        setError(null)
        setSuccess(null)

        if(!credentialResponse?.credential){
            setError({isError: true, message: "Google did not return a credential"})
            return
        }

        const res = await sendGoogleLogin(credentialResponse.credential)
        if(!res || res.error) {
            setError({isError: true, message: res?.message || "Google sign-in failed"})
            return
        }

        const me = await getMe()
        if(!me){
            setError({isError: true, message: "Cannot fetch user"})
            return
        }

        loginUser(me)
    }

    
    return  <>
    <div class="min-h-screen flex items-center justify-center bg-gray-100 px-4">
    <div class="w-full max-w-md p-8 bg-white border border-gray-200 rounded-2xl shadow-md">
        <h2 class="text-3xl font-semibold text-gray-900 mb-6 text-center">Увійти</h2>
    
        <form class="space-y-6">
        <div>
            <input onChange={(e) => handleChange(e)} value={input.username || ''} name="username"
            type="username" id="username" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3" placeholder="Email or username" required />
        </div>
        <div>
            <input onChange={(e) => handleChange(e)} value={input.password || ''} name="password"
            type="password" id="password" class="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-md focus:ring-blue-500 focus:border-blue-500 block w-full p-3" placeholder="Password" required />
        </div>
        <div class="flex items-start">
            <label for="terms" class="ms-2 text-sm font-medium text-gray-900">Don't have an account? <a onClick={(e)=> {e.preventDefault(); navigate('/auth/1')}} href="#" class="text-blue-600 hover:underline">Register</a></label>
        </div>
        {error && <p className="text-red-500 text-sm">{error.message}</p>}
        {success && <p className="text-green-500 text-sm">Successfully logged in!</p>}
        <button onClick={(e) => {e.preventDefault(); sendData(input)}} type="submit" class="w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-3 text-center">Log In</button>
        <GoogleAuthOption onSuccess={handleGoogleSuccess} onError={() => setError({isError: true, message: "Google sign-in was cancelled or failed"})} />
        </form>
    </div>
    </div>
    </>
}

function GoogleAuthOption({onSuccess, onError}) {
    if(!GOOGLE_OAUTH_CLIENT_ID){
        return null
    }

    return (
        <div className="space-y-4">
            <div className="flex items-center gap-3">
                <div className="h-px flex-1 bg-gray-200" />
                <span className="text-xs font-medium uppercase tracking-wide text-gray-500">or</span>
                <div className="h-px flex-1 bg-gray-200" />
            </div>
            <div className="flex justify-center">
                <GoogleLogin
                    onSuccess={onSuccess}
                    onError={onError}
                    useOneTap={false}
                    theme="outline"
                    size="large"
                    width="320"
                />
            </div>
        </div>
    )
}
