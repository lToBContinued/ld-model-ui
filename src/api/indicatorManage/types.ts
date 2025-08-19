export interface GetIndicatorListApiRes {
  id: number
  indicatorName: string
  indicatorDesc: string
  parentId: number
  level: number
  isLeaf: number
  config: string
}

export interface AddIndicatorApiRes {
  id: number
  indicatorName: string
  indicatorDesc: string
  parentId: number
  level: number
  isLeaf: number
}

export interface AddIndicatorApiSend {
  indicatorName: string
  indicatorDesc: string
  parentId?: number
}

export interface GetIndicatorDetailRes {
  config: string
  id: number
  indicatorDesc: string
  indicatorName: string
  isLeaf: number
  level: number
  parentId: number
  parentName: string
}

export interface UpdateIndicatorDetailSend {
  config: string
  id: number
  indicatorDesc: string
  indicatorName: string
}

export interface UpdateIndicatorDetailRes {
  config: string
  id: number
  indicatorDesc: string
  indicatorName: string
  isLeaf: number
  level: number
  parentId: number
  parentName: string
}
