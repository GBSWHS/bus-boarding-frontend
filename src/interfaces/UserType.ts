import BusType from "./BusType"
import StationType from "./StationListType"

export default interface UserType {
  id: number
  studentId: string
  name: string
  phone_number: string
  admin?: boolean
  boarding_bus?: BusType
  destination_stop?: StationType
}
