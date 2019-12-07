# 集中式接口管理和配置管理规范

## services 统一接口管理目录

services 为接口统一管理目录，集合关注点将分散的接口请求定义统一管理。

## services 定义规范

### 所有的请求皆在 services 下统一管理，不可以在页面上发送**野生请求**。

### services 目录拆分颗粒度，优先集中在**单个文件**中管理必要时再**按功能**分类拆分。

```ts
// REQUEST_PREFIX 请求前缀由 constant 中获取
import request from 'axios'
import { REQUEST_PREFIX } from '../constant'

const login = {
  register() {
    return request({
      method: 'get',
      url: `${REQUEST_PREFIX}/register`
    })
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
      url: `${REQUEST_PREFIX}/info`
    })
  },
  list() {
    return request({
      method: 'get',
      url: `${REQUEST_PREFIX}/list`
    })
  }
}

export { user, login }

```

### services 接口严格准守 TS 约束

为接口的的**参数**与**返回值**提供精准的类型约束拒绝`any`

```js
const login = {
  // 为请求的payload添加精准的类型定义
  register(data: { param: string; version: number }) {
    // 定义请求返回值类型 - 这里我运用交叉类型有些取巧大家构建时可以更正式一些
    type Response = IResponse & { data: { name: string } }
    // 定义请求参数类型
    const requestParam: IRequestOption = {
      method: 'get',
      url: `${REQUEST_PREFIX}/register`,
      data
    }
    return request<Response>(requestParam)

  }
}
 
login
  .register({ param: 'param', version: 1 })
  .then(({ code, data, message }) => {
    // 因为有确定的 Response 类型 TS可以提供精准的提示，
    console.log(code, data.name, message)
  })

```


## constant 统一配置管理文件

constant 为统一的配置管理文件，全局掌控项目配置，牵一发而动全身。

## constant 规范

### constant 主要存放一些全局公共配置如：请求前缀;登录授权TOKEN；成功请求状态码；
### constant 严格准守TS约束，配置中多为都是基础类型，基础类型不需要额外的类型约束，TS 类型推断可以正确的识别基础类型，如有复杂类型需添加精准类型约束；

```js
export const REQUEST_PREFIX = 'http://localhost:3001/api'

export const CONSTANTA = 1

export const CONSTANTB = 2
```




