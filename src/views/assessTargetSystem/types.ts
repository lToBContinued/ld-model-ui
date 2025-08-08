export interface SchemaBasicAssessFormData {
  participateUnits: string
  trainingTime: NullType<Date>
  assessTime: NullType<Date>
  experts: string
  subject: string
}

export interface AssessFormData {
  target: UndefinedType<number>
  comprehensive: UndefinedType<number>
  accuracy: UndefinedType<number>
  supportive: UndefinedType<number>
  remark: string
}
