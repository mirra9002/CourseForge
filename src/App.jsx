import { use, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {login, logout} from './State/authSlice.js'
import { SERVER_URL } from "../dev_data.js"
import { getMe } from "./fetching-data"
import { status } from "nprogress"

// Set default theme to light
if (!localStorage.getItem('theme')) {
  localStorage.setItem('theme', 'light')
  document.documentElement.classList.remove('dark')
  document.documentElement.classList.add('light')
}
function App({children}) {
  
  const dispatch = useDispatch()

  
  
  useEffect(() => {
    async function getUser() {
      const me = await getMe()
      if(!me){
        dispatch(logout())
        return
      }
      const user = {username: me.username, status: 'authed'}
      //console.log('IS AUTHED', me);
      dispatch(login(user))
    }
    getUser()
  }, []);


  return children
}

export default App
