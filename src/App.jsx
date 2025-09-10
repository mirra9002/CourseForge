import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {login, logout} from './State/authSlice.js'
import { SERVER_URL } from "../dev_data"
import { getMe } from "./fetching-data"
function App({children}) {
  
  const dispatch = useDispatch()

  
  
  useEffect(() => {
    async function getUser() {
      const me = await getMe()
      if(!me){
        dispatch(logout())
        return
      }
      dispatch(login(me))
    }
    getUser()
  }, []);


  return children
}

export default App
