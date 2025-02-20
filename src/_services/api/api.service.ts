import axios, {
  AxiosError,
  type AxiosRequestConfig,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from 'axios'

const handleUnauthorized = (statusCode: number): void => {
  switch (statusCode) {
    case 401:
    case 403:
      location.reload()
      break
  }
}

axios.interceptors.request.use(
  (config: AxiosRequestConfig): InternalAxiosRequestConfig => {
    // const token = TokenStorage.getToken();
    // if (token) {
    //     config.headers = {
    //         ...config.headers,
    //         Authorization: `Bearer ${TokenStorage.getToken()}`,
    //         "x-tenant-id": TokenStorage.getTenant(),
    //     };
    // }
    return config as InternalAxiosRequestConfig
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

axios.interceptors.response.use(
  (response: AxiosResponse) => {
    if ([200, 201, 204].includes(response.status)) {
      return Promise.resolve(response)
    } else {
      return Promise.reject(response)
    }
  },
  (error: AxiosError) => {
    if (error.response?.config.url === '/Token') {
      return Promise.reject(error.response)
    } else if (error.response?.status) {
      handleUnauthorized(error.response.status)
      return Promise.reject(error.response)
    }
  },
)

type CustomRequestData = {
  method: string
  url: string
  data?: any
  auth?: {
    username: string
    password: string
  }
}

const ApiService = {
  init(baseURL: string): void {
    axios.defaults.baseURL = baseURL
  },

  setHeaders(): void {
    // this.setTokenHeader()
    // this.setTenantHeader()
  },

  get(resource: string): Promise<AxiosResponse> {
    // this.setHeaders()
    return axios.get(resource)
  },

  post(resource: string, payload: any, p0: string = ''): Promise<AxiosResponse> {
    this.setHeaders()
    return axios.post(resource, payload)
  },

  put(resource: string, key: string, payload: any, keyFieldType: string): Promise<AxiosResponse> {
    resource += keyFieldType === 'Guid' || keyFieldType === 'Integer' ? `(${key})` : `('${key}')`
    return axios.put(resource, payload)
  },

  patch(resource: string, key: string, payload: any, keyFieldType: string): Promise<AxiosResponse> {
    resource += keyFieldType === 'Guid' || keyFieldType === 'Integer' ? `(${key})` : `('${key}')`
    return axios.patch(resource, payload)
  },

  delete(
    resource: string,
    key: string,
    keyFieldType: string,
    payload?: any,
  ): Promise<AxiosResponse> {
    resource += keyFieldType === 'Guid' || keyFieldType === 'Integer' ? `(${key})` : `('${key}')`
    return payload ? axios.delete(resource, { data: payload }) : axios.delete(resource)
  },

  customRequest(data: CustomRequestData): Promise<AxiosResponse> {
    return axios(data)
  },
}

export default ApiService
