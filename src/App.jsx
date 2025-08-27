import { useEffect } from "react"
import { useSelector, useDispatch } from "react-redux"
import {login, logout} from './State/authSlice.js'
import { SERVER_URL } from "../dev_data"
import { getMe } from "./fetching-data"
function App({children}) {
  
  const dispatch = useDispatch()
  const {user, status} = useSelector(state => state.auth)
  
  
  useEffect(() => {
    async function getUser() {
      console.log('INSIDE APP', SERVER_URL);
      const me = await getMe()
      if (!me) {
        dispatch(logout());
        return;
      }
      
      // dispatch(login(me));         // sets status + user
      console.log('--- App.jsx --- user logged in');
    }
    getUser();
  }, []);


  return children
}

export default App
