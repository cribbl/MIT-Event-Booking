import { storage } from '../firebaseConfig'
import axios from 'axios'

const baseUrl = process.env.REACT_APP_BACKEND_API

export const uploadProfilePic = (uid, file, callback) => {
  storage.ref().child(uid + '/profilePic').put(file)
    .then(function (res) {
      callback(null, res)
    })
    .catch(function (err) {
      callback(err)
    })
}

export const generatePDF = (eventID) => {
  let params = {
    eventID: eventID
  }
  return new Promise((resolve, reject) => {
    axios.get(baseUrl + '/event/generate-pdf', { params })
      .then(function (res) {
        resolve(res)
      })
      .catch(function (err) {
        reject(err)
      })
  })
}

export const exportEvents = (view, uid, mode, startDate = null, endDate = null, callback) => {
  let params = {
    uid: uid,
    mode: mode,
    from: startDate,
    to: endDate
  }
  return axios({
    url: baseUrl + '/' + view + '/generate-sheet',
    params: params,
    method: 'GET',
    responseType: 'blob' // important
  }).then((response) => {
    const url = window.URL.createObjectURL(new Blob([response.data])) // eslint-disable-line
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', 'export.xlsx')
    document.body.appendChild(link)
    link.click()
  })
}
