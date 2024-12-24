export const clearSessionCookie = () => {
  const isProd = process.env.NODE_ENV === 'production'
  const domain = isProd ? '.goalhacker.app' : 'localhost'

  // Clear the session cookie by setting it to expire in the past
  document.cookie = `goalhacker.sid=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`
  // Also clear any other potential session cookies
  document.cookie = `goalhacker.session=; expires=Thu, 01 Jan 1970 00:00:00 GMT; path=/; domain=${domain}`
}
