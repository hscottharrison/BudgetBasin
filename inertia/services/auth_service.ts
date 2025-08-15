import { LoginDTO } from '#models/auth_dto'
import { RegisterDTO } from '../../app/models/auth_dto'

export async function Logout() {
  var res = await fetch('/api/logout', {
    method: 'POST',
  })

  if (res.status === 200 && res.redirected) {
    window.location.href = res.url
  }
}

export async function login(payload: LoginDTO) {
  const res = await fetch('/api/login', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })
  if (res.status === 200 && res.redirected) {
    window.location.href = res.url
  }
}

export async function register(payload: RegisterDTO) {
  const res = await fetch('/api/register', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(payload),
  })

  if (res.status === 200 && res.redirected) {
    window.location.href = res.url
  }
}
