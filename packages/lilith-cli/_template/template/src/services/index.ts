import request from 'axios'

const REQUEST_URL = 'http://localhost:3001/test/get'

export const getData = (): Promise<any> => {
  return request({
    method: 'get',
    url: REQUEST_URL,
  })
}