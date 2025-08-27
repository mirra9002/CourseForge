import React from "react";
import { useNavigate } from "react-router-dom";
import {useState, useEffect} from 'react'
import course_forge_test_logo from '../assets/course-forge-test-logo.png'
import icon_user_black100 from '../assets/icon_user_black100.png'
import icon_mycourses_black100 from '../assets/icon_mycourses_black100.png'
import icon_settings_black100 from '../assets/icon_settings_black100.png'
import icon_messages_black100 from '../assets/icon_messages_black100.png'
import icon_logout_black100 from '../assets/icon_logout_black100.png'

import { useSelector, useDispatch } from "react-redux";
// import { setLoading, setError, setUser,resetAuth } from "../State/authSlice";

export default function Navbar() {
    const { user, status } = useSelector(s => s.auth);
    console.log("[NAVBAR] Redux state:", { user, status });

    const navigate = useNavigate();
    function havigateToPage(location){
        navigate(location)
    }

    function LogOut() {
        // console.log('clicked logout');
        // setLoading()

        // waiting for backend...
    }

    const [profileMenuOpen, setProfileMenuOpen] = useState(false)

    const userInitials = user?.username ? user.username.slice(0, 2).toUpperCase() : null;
    return(<>
  
    <nav class="bg-white dark:bg-gray-900 fixed w-full z-20 top-0 start-0 border-b border-gray-200 dark:border-gray-600">
        <div class="max-w-screen-xl flex flex-wrap items-center justify-between mx-auto p-4">
        <div onClick={() => havigateToPage('/')} class="cursor-pointer flex items-center space-x-3 rtl:space-x-reverse">
            <img src={course_forge_test_logo} class="h-8" alt="CourseForge Logo"/>
            <span class="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">CourseForge</span>
        </div>
        {status === 'authed' ? 
            <>
            <div className="ml-22  relative flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse group">
            {/* Clickable avatar */}
            <div onClick={() => setProfileMenuOpen(prev=>!prev)} className="cursor-pointer relative inline-flex items-center justify-center w-10 h-10 overflow-hidden bg-gray-100 hover:bg-gray-200 rounded-full dark:bg-gray-600">
                <span className="font-medium text-gray-600 dark:text-gray-300">
                {userInitials || null}
                </span>
                
            </div>


                {/* Dropdown menu */}
                <div id="userDropdown" className={`absolute right-0 top-full  mt-2 z-10 w-62 bg-white dark:bg-gray-700 divide-y divide-gray-100 dark:divide-gray-600 rounded-lg shadow-sm transform transition-all duration-200 ease-out
                    ${profileMenuOpen ? "opacity-100 translate-y-0 visible" : "opacity-0 -translate-y-2 invisible"}`}
                    >
                    <div className="px-4 py-3 text-sm text-gray-900 dark:text-white">
                        <div>{user.username || null}</div>
                        <div className="font-medium truncate">{user.email || null}</div>
                    </div>
                    <ul className="py-2 text-sm text-gray-700 dark:text-gray-200" aria-labelledby="avatarButton">
                        <li onClick={() => navigate('/me')}>
                            <a className="cursor-pointer flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"><img src={icon_user_black100} className="h-4" />Profile</a>
                        </li>
                        <li>
                            <a className="cursor-pointer flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"><img src={icon_settings_black100} className="h-4" />Settings</a>
                        </li>
                        <li onClick={() => navigate('/mycourses')}>
                            <a className="cursor-pointer flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"><img src={icon_mycourses_black100} className="h-4" />My courses</a>
                        </li>
                        <li>
                            <a className="cursor-pointer flex items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"><img src={icon_messages_black100} className="h-4" />Messages</a>
                        </li>
                       </ul>
                    <div className="py-1">
                        <a onClick={LogOut} 
                        className="cursor-pointer flex text-sm items-center gap-2 px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"><img src={icon_logout_black100} className="h-4" />Log out</a>
                    </div>
                </div>
            </div>
            </>
             : 
            <div class="flex md:order-2 space-x-3 md:space-x-0 rtl:space-x-reverse">
                <button onClick={() => havigateToPage('/auth/1')} type="button" class="cursor-pointer text-white bg-blue-700  hover:bg-blue-700  focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-full text-sm px-4 py-2 text-center dark:bg-[#1f7ef2] dark:hover:bg-[#1f7ef2] dark:focus:ring-blue-800">Sign up</button>
                <button data-collapse-toggle="navbar-sticky" type="button" class="inline-flex items-center p-2 w-10 h-10 justify-center text-sm text-gray-500 rounded-lg md:hidden hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-700 dark:focus:ring-gray-600" aria-controls="navbar-sticky" aria-expanded="false">
                    <span class="sr-only">Open main menu</span>
                    <svg class="w-5 h-5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 17 14">
                        <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M1 1h15M1 7h15M1 13h15"/>
                    </svg>
                </button>
            </div>
            
        }
        
        <div class="items-center justify-between hidden w-full md:flex md:w-auto md:order-1" id="navbar-sticky">
            <ul class="flex flex-col p-4 md:p-0 mt-4 font-medium border border-gray-100 rounded-lg bg-gray-50 md:space-x-8 rtl:space-x-reverse md:flex-row md:mt-0 md:border-0 md:bg-white dark:bg-gray-800 md:dark:bg-gray-900 dark:border-gray-700">
            <li>
                <div onClick={() => havigateToPage('/')} class="cursor-pointer block py-2 px-3 text-gray-900 bg-blue-700 rounded-sm md:bg-transparent md:text-blue-700 md:p-0 md:dark:text-blue-500" aria-current="page">Головна</div>
            </li>
            <li>
                <div onClick={() => havigateToPage('/search')} class="cursor-pointer block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Курси</div>
            </li>
            <li>
                <div class="cursor-pointer block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Про нас</div>
            </li>
            <li>
                <div class=" cursor-pointer block py-2 px-3 text-gray-900 rounded-sm hover:bg-gray-100 md:hover:bg-transparent md:hover:text-blue-700 md:p-0 md:dark:hover:text-blue-500 dark:text-white dark:hover:bg-gray-700 dark:hover:text-white md:dark:hover:bg-transparent dark:border-gray-700">Контакти</div>
            </li>
            </ul>
        </div>
        </div>
        </nav>
        <div className="h-16"></div>

</>)
}
