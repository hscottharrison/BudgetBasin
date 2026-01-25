import { HttpContext } from '@adonisjs/core/http'

export default class ForceCanonicalUrl {
  public async handle({ request, response }: HttpContext, next: () => Promise<void>) {
    const host = request.header('host') || ''
    const proto = (request.header('x-forwarded-proto') || '').toLowerCase()
    const url = request.url(true) // includes querystring

    // Optional: only enforce in production to avoid local dev issues
    const isProd = process.env.NODE_ENV === 'production'

    if (isProd) {
      // 1) Force HTTPS (Heroku sets x-forwarded-proto)
      if (proto === 'http') {
        return response.redirect(`https://${host}${url}`)
      }

      // 2) Redirect apex -> www
      if (host === 'budgetbasin.com') {
        return response.redirect(`https://www.budgetbasin.com${url}`)
      }
    }

    await next()
  }
}
