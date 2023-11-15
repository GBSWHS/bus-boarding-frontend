import { useCallback, useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader'
import { toast } from 'react-hot-toast'
import Container from '../components/Container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBus, faHome, faUser, faXmark } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-modal'
import useSWR from 'swr'
import { fetcher } from '../common/fetcher'
import { useNavigate } from 'react-router-dom'

const headers ={
  'Authorization': `Bearer ${localStorage.getItem('access_token') ?? ''}`
}

interface UserResponseType {
  id: number,
  student_id: number,
  name: string,
  phone_number: string,
  role: 'BUS_ADMIN' | 'USER' | 'ADMINISTRATOR',
}

interface RecordsResponseType {
  id: number,
  user_id: number,
  boarding_bus_id: number,
  destination_stop_id: number,
  time_created: Date
}

interface BoardingType {
  id: number,
  student_id: number,
  name: string,
  phone_number: string,
  boarding: boolean
}

function Manager() {
  const navigate = useNavigate()
  if (!localStorage.getItem('access_token')) navigate('/')
  const { data, error, isLoading } = useSWR('/api/user/me', fetcher)
  const [qrData, setQRData] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)
  const [boardingUsers, setBoardingUsers] = useState<BoardingType[]>([])
  const [isModalLoading, setIsModalLoading] = useState<boolean>(false)
  const [destinationName, setDestinationName] = useState<string>('로딩중')

  const getBusUsers = useCallback(async () => {
    if (!data) return
    const busId = data.boarding_bus.id
    const adminId = data.id

    const records = await fetch('/api/bus/' + busId + '/records', { headers })
    const users = await fetch('/api/bus/' + busId + '/users', { headers })

    if (records.status !== 200 || users.status !== 200) {
      toast.error('서버 오류 발생')
      return
    }

    const recordsJson = await records.json()
    const usersJson = await users.json()

    const boardingUsers = usersJson.map((user: UserResponseType): BoardingType => {
      const record = !!recordsJson.find((record: RecordsResponseType) => record.user_id === user.id)
      return {
        id: user.id,
        student_id: user.student_id,
        name: user.name,
        phone_number: user.phone_number,
        boarding: adminId === user.id ? true : record
      }
    })

    boardingUsers.sort((a: BoardingType, b: BoardingType) => {
      if (a.boarding === b.boarding) return a.student_id - b.student_id
      return a.boarding ? -1 : 1
    })
    
    setBoardingUsers(boardingUsers)
    return boardingUsers
  }, [data])

  const qrDataHandler = async (data: string | null) => {
    if (data === null) return

    const response = await fetch('/api/boarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('access_token') ?? ''}`
} },
      body: JSON.stringify({
        user_otp: data
      })
    })
    if (response.status !== 200) {
      try {
        const responseBody = await response.json()
        toast.error(responseBody.message)
      } catch {
        toast.error('서버 오류 발생')
      }
    }

    const responseBody: RecordsResponseType = await response.json()
    // toast.success(responseBody.)

    console.log(responseBody)
  }

  const getDestinationName = useCallback(async() => {
    if (!data) return
    const busResponse = await fetch('/api/bus/' + data.boarding_bus.id , { headers })
    if (busResponse.status !== 200) {
      toast.error('서버 오류 발생')
      return
    }
    
    const busResponseBody = await busResponse.json()
    const destinationResponse = await fetch('/api/stops/' + busResponseBody.destination, { headers })
    if (destinationResponse.status !== 200) {
      toast.error('서버 오류 발생')
      return
    }

    const destinationResponseBody = await destinationResponse.json()
    setDestinationName(destinationResponseBody.name)

    return destinationName
  }, [data, destinationName])
  
  useEffect(() => {
    if (!data) return
    getBusUsers()
    getDestinationName()
  }, [data, getBusUsers, getDestinationName])

  useEffect(() => {
    if (qrData === '') return

    qrDataHandler(qrData)

    // toast.success('탑승자 임태현 확인!',
    //   {
    //     duration: 3000,
    //     icon: '👏',
    //     style: {
    //       borderRadius: '10px',
    //       background: '#393',
    //       color: '#fff',
    //     }
    //   }
    // )
    // toast.error('해당 버스 탑승자 아님',
    //   {
    //     duration: 3000,
    //     icon: '🚨',
    //     style: {
    //       borderRadius: '10px',
    //       background: '#933',
    //       color: '#fff',
    //     }
    //   }
    // )
    // toast.error('서버 오류 발생',
    //   {
    //     duration: 3000,
    //     icon: '❌',
    //     style: {
    //       borderRadius: '10px',
    //       background: '#300',
    //       color: '#fff',
    //     }
    //   }
    // )
  }, [qrData])

  useEffect(() => {
    if (!data) return
    console.log(data)
    const res = fetch('/api/bus/' + data.boarding_bus.id, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('access_token') ?? ''}`
      }
    })
    console.log(res)
  }, [data])

  function errorHandling () {
    toast.error('서버 오류 발생')
    navigate('/')
  }

  if (isLoading) return <Container>Loading...</Container>
  if (!data) errorHandling() 
  if (error) errorHandling() 
  if (data.role === undefined) errorHandling()
  if (data.role !== 'BUS_ADMIN') errorHandling()

  const afterModalOpen = () => {
    if (!data) {
      setIsModalOpen(false)
      return
    }
    getBusUsers()
  }

  const modalClose = () => {
    getBusUsers()
    setIsModalOpen(false)
  }

  const modalOpen = () => {
    setIsModalOpen(true)
  }

  const setFilter = async (filter: 'all' | 'boarding' | 'not_boarding') => {
    if (!data) return
    setIsModalLoading(true)
    if (filter === 'all') {
      getBusUsers()
      setIsModalLoading(false)
      return
    }

    const boardingUserData = await getBusUsers()
    const filteredUsers = boardingUserData.filter((user: BoardingType) => filter === 'boarding' ? user.boarding === true : user.boarding === false)
    setBoardingUsers(filteredUsers)
    setIsModalLoading(false)
  }

  return (
    <>
      <Container>
        <div className='w-11/12 shadow-lg p-8 rounded-lg bg-white'>
          <h1 className='text-xl'><span className='font-bold'>{data.name}</span> 관리자님</h1>
          <small>QR코드를 스캔해주세요.</small>
          <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={(result) => {
              if (result) {
                setQRData(result.getText())
              }
            }}
            videoStyle={{ position: 'static', objectFit: 'cover', borderRadius: '5px', height: '100%' }}
            videoContainerStyle={{ height: '40vh', position: 'static', width: '100%', paddingTop: '0' }}
            scanDelay={500}
            className='mt-4'
          ></QrReader>
          <hr className="h-px my-3 bg-gray-100 border-1 dark:bg-gray-200"></hr>
          <div className='flex justify-between px-10'>
            <div className='flex flex-col mt-3 gap-1'>
              <label className='font-bold text-center'><FontAwesomeIcon icon={faHome} /> 목적지</label>
              <span className='py-1 text-center'>{destinationName}</span>
            </div>
            <div className='flex flex-col mt-3 gap-1'>
              <label className='font-bold text-center'><FontAwesomeIcon icon={faUser} /> 탑승자 수</label>
              <span className='py-1 text-center'>{boardingUsers.filter(user => user.boarding).length}명 / {boardingUsers.length}명</span>
            </div>
          </div>
          <button onClick={modalOpen} className='bg-green-500 hover:bg-green-400 text-white font-bold py-2 rounded-lg hover:shadow-lg mt-5 w-full transition-all'><FontAwesomeIcon icon={faBus}></FontAwesomeIcon> 인원 목록</button>
        </div>
      </Container>
      <Modal
        isOpen={isModalOpen}
        onAfterOpen={afterModalOpen}
        onRequestClose={modalClose}
        style={{
          content: {
            border: '0px',
            boxShadow: '8px 10px 57px -13px rgba(0,0,0,0.75);'
          },
          overlay: {
            backgroundColor: 'rgba(0,0,0,0.5)'
          }
        }}
        contentLabel="Users Modal"
      >
        <div className='w-full'>
          <div className='flex justify-between bg-white'>
            <h1 className='font-bold text-2xl'>탑승 인원 목록</h1>
            <button onClick={modalClose}><FontAwesomeIcon className='text-2xl hover:rotate-6 transform-gpu' icon={faXmark}></FontAwesomeIcon></button>
          </div>
          <div className='flex justify-between mt-3 gap-2'>
            <button className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 rounded-sm hover:shadow-lg w-full transition-all' onClick={() => setFilter('all')}>전체</button>
            <button className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 rounded-sm hover:shadow-lg w-full transition-all' onClick={() => setFilter('not_boarding')}>미탑승</button>
            <button className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 rounded-sm hover:shadow-lg w-full transition-all' onClick={() => setFilter('boarding')}>탑승</button>
          </div> 
          <hr className="h-px my-3 bg-gray-100 border-0 dark:bg-gray-200"></hr>

          <div className="max-h-[calc(100vh-300px)] overflow-y-auto">
            <table className="table-auto justify-between w-full h-full">
              <thead className='text-center sticky top-0 bg-white z-10'>
                <tr>
                  <th>학번</th>
                  <th>이름</th>
                  <th>전화번호</th>
                  <th>탑승 여부</th>
                </tr>
              </thead>
              <tbody className='text-center'>
                {!isModalLoading ? boardingUsers.map((data, i) => (
                  <tr key={i} className='mt-1'>
                    <td>{data.student_id}</td>
                    <td>{data.name}</td>
                    <td><a href={"tel:" + data.phone_number}>{data.phone_number}</a></td>
                    <td>{data.boarding ? '탑승' : '미탑승' }</td>
                  </tr>
                )) : <tr>로딩 중...</tr>}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Manager


