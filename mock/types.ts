export interface RecentRecordData {
  id: string
  company: string
  date: string
  department: string
  code: string
  level: string
}

export interface RecentRecordTable {
  totalData: RecentRecordData[]
}
