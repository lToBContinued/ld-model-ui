const key: string = 'token'

export function SET_TOKEN(token: string) {
  return localStorage.setItem(key, token)
}

export function REMOVE_TOKEN() {
  return localStorage.removeItem(key)
}

export function GET_TOKEN(): NullType<string> {
  return localStorage.getItem(key)
}
