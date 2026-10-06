import { useEffect, useRef, useState } from 'react'
import { useDispatch } from 'react-redux'
import { Link, useParams } from 'react-router-dom'
import Navbar from '../Components/NavBar'
import AuthLayout from '../Components/AuthLayout'
import AuthError from '../Components/AuthError'
import { authErrorMessage } from '../utils/authErrors.js'
import { login } from '../State/authSlice'
import { getMe } from '../fetching-data'
import { sendUserActivation } from '../sending-data'

export default function ActivateAccount() {
  const { uid, token } = useParams()
  const dispatch = useDispatch()
  const activationRequest = useRef(null)
  const [status, setStatus] = useState('loading')
  const [message, setMessage] = useState('Підтверджуємо вашу email-адресу…')
  const [isSignedIn, setIsSignedIn] = useState(false)

  useEffect(() => {
    let isMounted = true
    setStatus('loading')
    setMessage('Підтверджуємо вашу email-адресу…')
    setIsSignedIn(false)

    // Reuse the request during StrictMode's effect replay: activation links are single-use.
    const key = `${uid}/${token}`
    if (activationRequest.current?.key !== key) {
      activationRequest.current = { key, promise: sendUserActivation(uid, token) }
    }

    async function activate() {
      try {
        const result = await activationRequest.current.promise
        if (!isMounted) return
        if (!result || result.error) {
          setStatus('error')
          setMessage(authErrorMessage(result, 'activation'))
          return
        }

        const me = await getMe().catch(() => null)
        if (!isMounted) return
        if (me) dispatch(login(me))
        setIsSignedIn(Boolean(me))
        setStatus('success')
        setMessage('Ваш email підтверджено, а акаунт готовий до навчання.')
      } catch {
        if (!isMounted) return
        setStatus('error')
        setMessage(authErrorMessage({ code: 'network_error' }))
      }
    }
    activate()
    return () => { isMounted = false }
  }, [dispatch, token, uid])

  return (
    <>
      <Navbar />
      <AuthLayout title={status === 'error' ? 'Не вдалося підтвердити email' : status === 'success' ? 'Email підтверджено!' : 'Підтвердження email'}>
        <div className="space-y-5 text-center text-sm leading-6">
          {status === 'error' ? <AuthError message={message} /> : <p role="status" className="break-words text-gray-600">{message}</p>}
          {status === 'success' && <p className="rounded-xl bg-blue-50 p-4 text-blue-900">Щоб почати навчання, відкрийте CourseForge з ноутбука чи комп’ютера та увійдіть у свій акаунт.</p>}
          {status !== 'loading' && (
            <Link to={isSignedIn ? '/' : '/auth/0'} className="flex min-h-12 w-full items-center justify-center rounded-lg bg-blue-700 px-4 py-3 font-semibold text-white hover:bg-blue-800 focus-visible:ring-4 focus-visible:ring-blue-300">{isSignedIn ? 'На головну' : 'Перейти до входу'}</Link>
          )}
          {status === 'error' && <Link to="/auth/1" className="block py-2 font-medium text-blue-700 hover:underline">Повернутися до реєстрації</Link>}
        </div>
      </AuthLayout>
    </>
  )
}
