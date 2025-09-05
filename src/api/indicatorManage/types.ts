export interface GetIndicatorListApiRes {
  id: number
  name: string
  description: string
  parentId: number
  level: number
  isLeaf: number
  config: string
}

export interface AddIndicatorApiRes {
  id: number
  name: string
  description: string
  parentId: number
  level: number
  isLeaf: number
}

export interface AddIndicatorApiSend {
  name: string
  description: string
  parentId: number
}

export interface GetIndicatorDetailRes {
  id: number
  name: string
  description: string
  config: string
  isLeaf: number
  level: number
  parentId: number
  parentName: string
  systemId: number
}

export interface UpdateIndicatorDetailSend {
  id: number
  name: string
  description: string
  config: string
}

export interface UpdateIndicatorDetailRes {
  id: number
  name: string
  description: string
  config: string
  isLeaf: number
  level: number
  parentId: number
  parentName: string
}

export interface GetIndicatorSystemListRes {
  config: string
  createdAt: string
  description: string
  formula: string
  id: number
  isLeaf: number
  name: string
  orderIndex: number
  parentId: number
  parentName: string
  systemId: number
  updatedAt: string
  weightToParent: number
}

export interface GetIndicatorAndDescendantsApiRes {
  id: number
  name: string
  description: string
  parentId: number
  level: number
  isLeaf: number
  config: string
}
