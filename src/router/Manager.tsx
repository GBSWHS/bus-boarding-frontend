import { useEffect, useState } from 'react'
import { QrReader } from 'react-qr-reader'
import { toast } from 'react-hot-toast'
import Container from '../components/Container'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBus, faHome, faUser, faXmark } from '@fortawesome/free-solid-svg-icons'
import Modal from 'react-modal'
import useSWR from 'swr'

const fetcher = (url: string) => fetch(url, { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token') ?? ''}` } }).then(async (res) => await res.json())
function Manager() {
  if (!localStorage.getItem('access_token')) window.location.href = '/'
  const { data, error, isLoading } = useSWR('/api/user/me', fetcher)
  const [qrData, setQRData] = useState<string>('')
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false)

  const qrDataHandler = async (data: string | null) => {
    if (data === null) return

    const response = await fetch('/api/boarding', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        user_otp: data
      })
    })
    if (response.status !== 200) {
      try {
        const responseBody = await response.json()
        toast.error(responseBody.message,
          {
            duration: 3000,
            icon: '❌',
            style: {
              borderRadius: '10px',
              background: '#300',
              color: '#fff',
            }
          }
        )
      } catch {
        toast.error('서버 오류 발생',
          {
            duration: 3000,
            icon: '❌',
            style: {
              borderRadius: '10px',
              background: '#300',
              color: '#fff',
            }
          }
        )
      }
    }

    const responseBody = await response.json()
    console.log(responseBody)

  }

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

  // if data is loaded fetch /api/bus/id
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
    toast.error('서버 오류 발생',
      {
        duration: 3000,
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#300',
          color: '#fff',
        }
      }
    )
    window.location.href = '/'
  }

  if (isLoading) return <Container>Loading...</Container>
  if (!data) errorHandling() 
  if (error) errorHandling() 
  if (data.role === undefined) errorHandling()
  if (data.role !== 'BUS_ADMIN') errorHandling()

  const onBusStart = () => {
    if (!confirm('정말 버스를 출발할까요?')) return

    toast.success('수고하셨습니다!',
      {
        duration: 3000,
        icon: '🌸',
        style: {
          borderRadius: '10px',
          background: '#393',
          color: '#fff',
        }
      }
    )
    return
  }

  const afterModalOpen = () => {
    toast.success('모달 열림')
  }

  const modalClose = () => {
    setIsModalOpen(false)
  }

  const modalOpen = () => {
    setIsModalOpen(true)
  }

  return (
    <>
      <Container>
        <div className='w-11/12 shadow-lg p-8 rounded-lg bg-white'>
          <h1 className='text-xl'><span className='font-bold'>{data.name}</span> 관리자님</h1>
          <small>QR코드를 스캔해주세요.</small>
          <QrReader
            constraints={{ facingMode: 'environment' }}
            onResult={(result, error) => {
              if (result) {
                setQRData(result.getText())
              }

              if (error) {
                if (error.name === 'e2') return
                toast.error('QR 코드를 인식하지 못했습니다.')
              }
            }}
            videoStyle={{ position: 'static', objectFit: 'cover', borderRadius: '5px', height: '100%' }}
            videoContainerStyle={{ height: '25vh', position: 'static', width: '100%', paddingTop: '0' }}
            scanDelay={500}
            className='mt-4'
          ></QrReader>
          <hr className="h-px my-3 bg-gray-100 border-1 dark:bg-gray-200"></hr>
          <div className='flex justify-between'>
            <div className='flex flex-col mt-3 gap-1'>
              <label className='font-bold'><FontAwesomeIcon icon={faHome} /> 목적지</label>
              <span className='py-1'>동대구</span>
            </div>
            <div className='flex flex-col mt-3 gap-1'>
              <label className='font-bold'><FontAwesomeIcon icon={faUser} /> 탑승자 수</label>
              <span className='py-1'>20명 / 32명</span>
            </div>
            <div className='flex flex-col mt-3 gap-1'>
              <label className='font-bold'><FontAwesomeIcon icon={faUser} /> 인원 목록</label>
              <button onClick={modalOpen} className='bg-blue-400 hover:bg-blue-300 text-white font-bold py-1 rounded-lg hover:shadow-lg w-full transition-all'>목록</button>
            </div>
          </div>
          <button onClick={onBusStart} className='bg-green-500 hover:bg-green-400 text-white font-bold py-2 rounded-lg hover:shadow-lg mt-5 w-full transition-all'><FontAwesomeIcon icon={faBus}></FontAwesomeIcon> 출발 확인</button>
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
            <button className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 rounded-sm hover:shadow-lg w-full transition-all'>전체</button>
            <button className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 rounded-sm hover:shadow-lg w-full transition-all'>미탑승</button>
            <button className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-1 rounded-sm hover:shadow-lg w-full transition-all'>탑승</button>
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
                {Array(40).fill(0).map((_, i) => (
                  <tr key={i} className='mt-1'>
                    <td>31{i}</td>
                    <td>임태현</td>
                    <td>01012345678</td>
                    <td>탑승</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </Modal>
    </>
  )
}

export default Manager


