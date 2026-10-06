import test from 'node:test'
import assert from 'node:assert/strict'
import { authErrorMessage, isEmailAlreadyRegistered, requiredAuthFieldMessage } from '../src/utils/authErrors.js'

test('login errors from different API response shapes use the same Ukrainian message', () => {
  for (const response of [
    { data: { detail: 'Invalid credentials' } },
    { data: { non_field_errors: ['Unable to log in with provided credentials.'] } },
    { data: { detail: 'No active account found with the given credentials' }, status: 401 },
    { data: { password: ['Invalid password.'] } },
    { message: 'Invalid credentials' },
    'Invalid credentials',
  ]) {
    assert.equal(authErrorMessage(response), 'Неправильний логін або пароль.')
  }
})

test('registration field errors are concise, keep limits and identify the affected field', () => {
  for (const [data, expected] of [
    [{ username: ['A user with that username already exists.'] }, 'Це ім’я вже зайняте. Оберіть інше.'],
    [{ email: ['A user with this email already exists.'] }, 'Цей email уже зареєстровано. Спробуйте увійти.'],
    [{ password: ['This password is too short. It must contain at least 8 characters.'] }, 'Мінімум 8 символів у паролі.'],
    [{ password: ['This password is too short. It must contain at least 12 characters.'] }, 'Мінімум 12 символів у паролі.'],
    [{ non_field_errors: ["The two password fields didn't match."] }, 'Паролі не збігаються.'],
    [{ email: ['Enter a valid email address.'] }, 'Перевірте email, наприклад name@example.com.'],
    [{ username: ['Enter a valid username. This value may contain only letters, numbers, and @/./+/-/_ characters.'] }, 'В імені дозволені літери, цифри та @ . + - _.'],
    [{ username: ['Ensure this field has no more than 150 characters.'] }, 'Скоротіть ім’я користувача до 150 символів.'],
  ]) {
    assert.equal(authErrorMessage({ data }, 'register'), expected)
  }
})

test('required-field messages work for both browser validation and API validation', () => {
  assert.equal(requiredAuthFieldMessage('username'), 'Вкажіть email або ім’я користувача.')
  assert.equal(requiredAuthFieldMessage('username', 'register'), 'Вкажіть ім’я користувача.')
  for (const field of ['username', 'email', 'password', 're_password']) {
    for (const message of ['This field is required.', 'This field may not be blank.']) {
      assert.equal(authErrorMessage({ data: { [field]: [message] } }, 'register'), requiredAuthFieldMessage(field, 'register'))
    }
  }
})

test('network, rate-limit and server failures take priority over generic credentials', () => {
  assert.equal(authErrorMessage({ code: 'network_error' }), 'Немає зв’язку із сервером. Спробуйте ще раз.')
  assert.equal(authErrorMessage({ status: 429, data: { detail: 'Invalid credentials' } }), 'Забагато спроб. Спробуйте трохи пізніше.')
  assert.equal(authErrorMessage({ status: 503, data: '<html>Service unavailable</html>' }), 'Сервіс тимчасово недоступний. Спробуйте пізніше.')
  assert.equal(authErrorMessage({ data: { detail: 'CSRF validation failed. Refresh the page and try again.' } }), 'Оновіть сторінку та спробуйте ще раз.')
})

test('Google and activation errors hide implementation details but give a useful next step', () => {
  assert.equal(authErrorMessage({ data: { detail: 'google-auth is not installed.' } }, 'google'), 'Вхід через Google поки недоступний.')
  assert.equal(authErrorMessage({ data: { detail: 'Google email address is not verified.' } }, 'google'), 'Спочатку підтвердьте email у Google.')
  assert.equal(authErrorMessage({ data: { token: ['Invalid token for given user.'] } }, 'activation'), 'Посилання недійсне або застаріле. Запросіть нове.')
  assert.equal(authErrorMessage({ data: { detail: 'Stale token for given user.' } }, 'activation'), 'Email уже підтверджено. Увійдіть в акаунт.')
})

test('resending verification still works after translating duplicate-email errors', () => {
  for (const email of ['A user with this email already exists.', ['A user with this email already exists.']]) {
    const response = { data: { email } }
    assert.equal(isEmailAlreadyRegistered(response), true)
    assert.equal(authErrorMessage(response, 'register'), 'Цей email уже зареєстровано. Спробуйте увійти.')
  }
  assert.equal(isEmailAlreadyRegistered({ data: { email: ['Enter a valid email address.'] } }), false)
  assert.equal(isEmailAlreadyRegistered(null), false)
})

test('unexpected backend errors always fall back to Ukrainian without exposing raw text', () => {
  for (const context of ['login', 'register', 'google', 'resend', 'activation']) {
    for (const response of [null, {}, { data: { detail: 'Unexpected internal error: /private/server/file.py' } }]) {
      const message = authErrorMessage(response, context)
      assert.match(message, /[А-Яа-яІіЇїЄє]/)
      assert.doesNotMatch(message, /Unexpected|\/private|undefined|null/)
    }
  }
})
