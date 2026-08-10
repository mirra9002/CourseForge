import { useEffect, useState } from 'react'
import { useDispatch } from 'react-redux'
import { useNavigate, useParams } from 'react-router-dom'

import Navbar from '../Components/NavBar'
import { login } from '../State/authSlice'
import { getMe } from '../fetching-data'
import { sendUserActivation } from '../sending-data'

export default function ActivateAccount() {
  const { uid, token } = useParams()
  const navigate = useNavigate()
  const dispatch = useDispatch()
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('Verifying your email address...')

  useEffect(() => {
    let isMounted = true

    async function activate() {
      const result = await sendUserActivation(uid, token)
      if (!isMounted) {
        return
      }

      if (!result || result.error) {
        setStatus('error')
        setMessage(result?.message || 'Activation link is invalid or expired.')
        return
      }

      const me = await getMe()
      if (!isMounted) {
        return
      }

      if (me) {
        dispatch(login(me))
        setStatus('success')
        setMessage('Email verified. Taking you to CourseForge...')
        setTimeout(() => navigate('/'), 900)
        return
      }

      setStatus('success')
      setMessage('Email verified. You can now log in.')
    }

    activate()

    return () => {
      isMounted = false
    }
  }, [dispatch, navigate, token, uid])

  return (
    <>
      <Navbar />
      <div className="-mt-20 min-h-screen flex items-center justify-center bg-gray-100 px-4">
        <div className="w-full max-w-md p-8 bg-white border border-gray-200 rounded-2xl shadow-md text-center">
          <h2 className="text-3xl font-semibold text-gray-900 mb-4">
            {status === 'error' ? 'Activation failed' : 'Email verification'}
          </h2>
          <p className={status === 'error' ? 'text-sm text-red-600' : 'text-sm text-gray-600'}>
            {message}
          </p>
          {status === 'error' && (
            <button
              type="button"
              onClick={() => navigate('/auth/0')}
              className="mt-6 w-full text-white bg-blue-700 hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-md text-sm px-5 py-3 text-center"
            >
              Back to login
            </button>
          )}
        </div>
      </div>
    </>
  )
}
