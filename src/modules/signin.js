import axios from './axios'
import { stringify } from 'querystring'

/* user = { username, password } */
export function signin (user) {
  return new Promise((resolve, reject) => {
    const { username, password } = user

    axios.post('/auth/login', stringify({
      username, password
    }))

    .then(response => {
      resolve(response.data)
    })

    .catch(response => {
      reject(response.response.data)
    })
  })
}
