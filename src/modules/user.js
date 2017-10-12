import axios from './axios'

function getStudentProfile (username) {
  return new Promise((resolve, reject) => {
    axios.get('/user', { params: { username } })
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
