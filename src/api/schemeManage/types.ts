export interface GetSchemeListApiRes {
  id: number
  schemeName: string
}

export interface AddSchemeApiSend {
  schemeName: string
  indicatorSystem: number
  schemeDesc: string
}

export interface AddSchemeApiRes {
  id: number
  schemeName: string
  schemeDesc: string
  indicatorSystem: number
  config?: any
}

export interface UpdateSchemeApiSend {
  id: number
  config: string
}
