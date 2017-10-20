import axios from './axios'

function getStudentProfile (username, token) {
  return new Promise((resolve, reject) => {
    axios.get(`/users/${username}/history`, { params: { token } })
      .then(response => {
        console.log(response)
        resolve()
      })
      .catch(error => {
        console.log(error)
        reject()
      })
  })
}

export default { getStudentProfile }
