import { afterEach, test } from 'node:test'
import assert from 'node:assert/strict'
import { isMobileAccessiblePath, isMobileDevice, withDeviceAccess } from '../src/utils/deviceAccess.js'

afterEach(() => { delete globalThis.window })

function device({ width = 390, userAgent = 'Desktop browser', touch = false } = {}) {
  globalThis.window = {
    navigator: { userAgent },
    matchMedia: query => ({ matches: query.includes('pointer: coarse') ? touch && width <= 1180 : width <= 900 }),
  }
}

test('only the landing page and complete account routes are mobile-accessible', () => {
  for (const path of ['/', '/auth/0', '/auth/1', '/auth/1/', '/AUTH/0', '/activate/user/token', '/activate/user/token/']) {
    assert.equal(isMobileAccessiblePath(path), true, path)
  }
  for (const path of ['/search', '/me', '/mycourses', '/courseinfo/1', '/course/1/module/2/lesson/3/page/4', '/certificate', '/documentation', '/admin/course-studio-7f3c9', '/unknown', '/auth/2', '/auth/1/extra', '/activate', '/activate/user', '/activate/user/token/extra']) {
    assert.equal(isMobileAccessiblePath(path), false, path)
  }
})

test('preserves viewport, phone user-agent and touch tablet restrictions', () => {
  assert.equal(isMobileDevice(), false)
  for (const [environment, expected] of [
    [{ width: 900 }, true],
    [{ width: 901 }, false],
    [{ width: 1440, userAgent: 'iPhone' }, true],
    [{ width: 1440, userAgent: 'Android' }, true],
    [{ width: 1180, touch: true }, true],
    [{ width: 1181, touch: true }, false],
  ]) {
    device(environment)
    assert.equal(isMobileDevice(), expected, JSON.stringify(environment))
  }
})

test('blocked deep links never execute their page loader, including with query strings', async () => {
  device()
  const guarded = withDeviceAccess(() => { throw new Error('A restricted loader ran on mobile') })
  for (const path of ['/search?q=python', '/mycourses', '/courseinfo/1', '/auth/1/extra', '/unknown']) {
    assert.equal(await guarded({ request: new Request(`https://courseforge.test${path}`) }), null)
  }
})

test('account loaders run on phones and desktop loaders receive their original arguments', async () => {
  device()
  const received = []
  const guarded = withDeviceAccess(async args => { received.push(args); return 'page data' })
  for (const path of ['/?campaign=signup', '/auth/1?next=home', '/auth/0', '/activate/user/token']) {
    const args = { request: new Request(`https://courseforge.test${path}`), params: { example: 'value' } }
    assert.equal(await guarded(args), 'page data')
    assert.equal(received.at(-1), args)
  }
  device({ width: 1440 })
  const args = { request: new Request('https://courseforge.test/courseinfo/1'), params: { courseId: '1' } }
  assert.equal(await guarded(args), 'page data')
  assert.equal(received.at(-1), args)
})
