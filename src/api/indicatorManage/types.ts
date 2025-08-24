interface indicatorItem {
  id: number
  name: string
  description: string
}

export interface GetIndicatorListApiRes extends indicatorItem {
  parentId: number
  level: number
  isLeaf: number
  config: string
}

export interface AddIndicatorApiRes extends indicatorItem {
  parentId: number
  level: number
  isLeaf: number
}

export interface AddIndicatorApiSend extends indicatorItem {
  parentId: number
  systemId: number
}

export interface GetIndicatorDetailRes extends indicatorItem {
  config: string
  isLeaf: number
  level: number
  parentId: number
  parentName: string
}

export interface UpdateIndicatorDetailSend extends indicatorItem {
  config: string
}

export interface UpdateIndicatorDetailRes extends indicatorItem {
  config: string
  isLeaf: number
  level: number
  parentId: number
  parentName: string
}

export interface GetIndicatorSystemListRes extends indicatorItem {
  config: string
  isLeaf: number
  level: number
  parentId: number
  parentName: string
}

export interface GetIndicatorAndDescendantsApiRes extends indicatorItem {
  parentId: number
  level: number
  isLeaf: number
  config: string
}
