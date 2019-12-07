import request, { IResponse, IRequestOption } from '../request'
import { REQUEST_PREFIX } from '../constant'

const login = {
  // 为请求的payload添加精准的类型定义
  register(data: { param: string; version: number }) {
    // 定义精准的请求返回值类型拒绝any - 这里我运用交叉类型有些取巧大家构建是可以更正式一些
    type Response = IResponse & { data: { name: string } }
    // 定义请求参数类型
    const requestParam: IRequestOption = {
      method: 'get',
      url: `${REQUEST_PREFIX}/register`,
      data
    }
    return request<Response>(requestParam)

    // request 请求参数直接写成字面量亦可
    // return request<Response>({
    //   method: 'get',
    //   url: `${REQUEST_PREFIX}/register`
    // })
  },
  authCode() {
    return request({
      method: 'get',
      url: `${REQUEST_PREFIX}/authCode`
    })
  }
}

const user = {
  info() {
    return request({
      method: 'get',
      url: `${REQUEST_PREFIX}/list`
    })
  },
  list() {
    return request({
      method: 'get',
      url: `${REQUEST_PREFIX}/list`
    })
  }
}

// login
//   .register({ param: 'param', version: 1 })
//   .then(({ code, data, message }) => {
//     // 因为有确定的 Response 类型 TS可以提供精准的提示，
//     console.log(code, data.name, message)
//   })
export { user, login }
