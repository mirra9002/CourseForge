const fallbackMessages = {
  login: 'Не вдалося увійти. Спробуйте ще раз.',
  register: 'Не вдалося створити акаунт. Спробуйте ще раз.',
  resend: 'Не вдалося надіслати лист. Спробуйте ще раз.',
  google: 'Не вдалося увійти через Google. Спробуйте ще раз.',
  activation: 'Посилання недійсне або застаріле. Запросіть нове.',
}

function firstMessage(value) {
  if (typeof value === 'string') return value
  if (Array.isArray(value)) return value.map(firstMessage).find(Boolean) || ''
  if (value && typeof value === 'object') return firstMessage(value.message || value.detail || Object.values(value))
  return ''
}

function isDuplicate(message) {
  return /already (exists|registered|in use|taken)|вже (існує|зареєстрован|використовується)/i.test(message)
}

export function isEmailAlreadyRegistered(response) {
  return isDuplicate(firstMessage(response?.data?.email))
}

export function requiredAuthFieldMessage(field, context = 'login') {
  const messages = {
    username: context === 'register' ? 'Вкажіть ім’я користувача.' : 'Вкажіть email або ім’я користувача.',
    email: 'Вкажіть email.',
    password: 'Введіть пароль.',
    re_password: 'Повторіть пароль.',
  }
  return messages[field] || 'Заповніть усі поля.'
}

// API wording varies between Django, Djoser and Google. Keep raw server text
// out of the interface and always provide a short Ukrainian fallback.
export function authErrorMessage(response, context = 'login') {
  const data = response?.data ?? response
  const fields = ['username', 'email', 'password', 're_password', 'non_field_errors', 'detail', 'uid', 'token', 'credential', 'id_token']
  const field = fields.find(key => firstMessage(data?.[key]))
  const message = firstMessage(field ? data[field] : data) || firstMessage(response?.message)
  const text = message.toLowerCase()

  if (response?.code === 'network_error' || /failed to fetch|network|сервер недоступен|не вдалося з’єднатися/.test(text)) {
    return 'Немає зв’язку із сервером. Спробуйте ще раз.'
  }
  if (response?.status === 429 || /throttl|too many|забагато спроб/.test(text)) {
    return 'Забагато спроб. Спробуйте трохи пізніше.'
  }
  if (response?.status >= 500) return 'Сервіс тимчасово недоступний. Спробуйте пізніше.'
  if (/csrf/.test(text)) return 'Оновіть сторінку та спробуйте ще раз.'

  if (context === 'activation') {
    if (/already (activated|verified)|stale token/.test(text)) return 'Email уже підтверджено. Увійдіть в акаунт.'
    return fallbackMessages.activation
  }

  if (context === 'google') {
    if (/not configured|not installed/.test(text)) return 'Вхід через Google поки недоступний.'
    if (/email.*not verified/.test(text)) return 'Спочатку підтвердьте email у Google.'
    if (/did not provide an email/.test(text)) return 'Оберіть Google-акаунт із підтвердженим email.'
    return fallbackMessages.google
  }

  if (isDuplicate(text)) {
    if (field === 'email' || /email/.test(text)) return 'Цей email уже зареєстровано. Спробуйте увійти.'
    if (field === 'username' || /username/.test(text)) return 'Це ім’я вже зайняте. Оберіть інше.'
  }
  if (/password.*(match|same)|паролі не збігаються/.test(text)) return 'Паролі не збігаються.'
  if (/too short|at least \d+ characters/.test(text)) {
    const minimum = text.match(/at least (\d+) characters/)?.[1] || '8'
    return `Мінімум ${minimum} символів у паролі.`
  }
  if (/too common/.test(text)) return 'Оберіть менш поширений пароль.'
  if (/entirely numeric/.test(text)) return 'Додайте літери до пароля.'
  if (/too similar/.test(text)) return 'Пароль надто схожий на дані акаунта.'
  if (/no more than \d+ characters/.test(text)) {
    const maximum = text.match(/no more than (\d+) characters/)?.[1]
    return `Скоротіть ${field === 'username' ? 'ім’я користувача' : 'значення'} до ${maximum} символів.`
  }
  if (/required|may not be (blank|null)|cannot be (blank|empty)/.test(text)) return requiredAuthFieldMessage(field, context)
  if (/valid email|invalid email/.test(text)) return 'Перевірте email, наприклад name@example.com.'
  if (/valid username/.test(text)) return 'В імені дозволені літери, цифри та @ . + - _.'

  if (/no active account|invalid credentials|invalid password|unable to log in|incorrect.*password|не удалось войти/.test(text)) {
    return 'Неправильний логін або пароль.'
  }
  if (/account is disabled/.test(text)) return 'Акаунт вимкнено. Зверніться до підтримки.'
  if (context === 'resend' && /email.*does not exist/.test(text)) return 'Акаунт із цим email не знайдено.'
  if (/inactive|not active|not activated|email.*not verified/.test(text)) return 'Підтвердьте email, щоб увійти.'
  if (context === 'login' && response?.status === 401) return 'Неправильний логін або пароль.'

  return fallbackMessages[context] || fallbackMessages.login
}
