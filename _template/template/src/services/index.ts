import request from 'axios'

const REQUEST_URL = 'http://localhost:3001/test/get'

export const getData = () => {
  return request({
    method: 'get',
    url: REQUEST_URL,
  })
}