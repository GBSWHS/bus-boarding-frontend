
export default interface UserType {
  id: number
  studentId: string
  name: string
  phone_number: string
  admin?: boolean
  boarding?: {
    id: number
    name: string
    description: string
  }
  destination?: {
    id: number
    name: string
    location: string
  }
}
