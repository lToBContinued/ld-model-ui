export interface GetIndicatorListApiRes {
  id: number
  indicatorName: string
  indicatorDesc: string
  parentId: number
  level: number
  isLeaf: number
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
}
