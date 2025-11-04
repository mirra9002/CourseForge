import { use, useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {login, logout} from './State/authSlice.js'
import { SERVER_URL } from "../dev_data"
import { getMe } from "./fetching-data"
import { status } from "nprogress"
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
      console.log('IS AUTHED', me);
      dispatch(login(user))
    }
    getUser()
  }, []);


  return children
}

export default App
