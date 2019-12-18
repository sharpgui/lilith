import axios, { AxiosRequestConfig, AxiosResponse } from 'axios'

export interface IRequestOption extends AxiosRequestConfig {
  url: string
}

export interface RequestResponse {
  /** 业务code码 */
  code: string
  /** 提示信息 */
  message: string
  /** 返回数据 */
  data?: {
    [key: string]: any
  }
}
/**
 * 处理传入的参数, 可以都data，不再需要根据请求method判断key 用params 还是用data
 */
function transform(options) {
  const requestOptions = Object.assign({}, options)

  // 如果是 get 请求，将 data 转为 params
  const { data, params, method } = requestOptions
  if (data && !params && (!method || method === 'get')) {
    requestOptions.params = data
    requestOptions.data = undefined

    return requestOptions
  }
  return requestOptions
}
/**
 * 发起请求
 * @param options
 */
async function request<T extends RequestResponse>(
  options: IRequestOption
): Promise<T> {
  const requestOptions = transform(options)
  console.log(options, requestOptions)
  return axios(requestOptions)
    .then(res => res.data)
    .catch(err => {
      const error = (err && err.response && err.response.data) || {}
      console.error(err)
      return Promise.reject(error)
    })
}

export default request