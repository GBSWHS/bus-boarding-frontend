import { useEffect, useState } from 'react'
import Container from '../components/Container'
import QRCode from 'react-qr-code'
import totp from 'totp-generator'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faBus, faHome } from '@fortawesome/free-solid-svg-icons'
import useSWR from 'swr'
import toast from 'react-hot-toast'
import UserType from '../interfaces/UserType'

const fetcher = (url: string) => fetch(url, { headers: { 'Authorization': `Bearer ${localStorage.getItem('access_token') ?? ''}` } }).then(async (res) => await res.json())
function User(user: UserType) {
  if (!localStorage.getItem('access_token')) window.location.href = '/'
  if (!localStorage.getItem('totp_secret')) window.location.href = '/'
  const { data, error, isLoading } = useSWR('/api/user/me', fetcher)
  const [otp, setOtp] = useState('')
  const [remainTime, setRemainTime] = useState('0')

  useEffect(() => {
    const interval = setInterval(() => {
      generateOTP(localStorage.getItem('totp_secret') || '')
    }, 1000)
    return () => clearInterval(interval)
  }, [])

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
  if (data.role !== 'USER') errorHandling()

  
  function generateOTP(otpauthURL: string): void {
    if (!otpauthURL || otpauthURL === '') return console.error('otpauthURL is not defined')
    const remainTime = Number(30) - (Math.floor(Date.now() / 1000) % Number(30))

    setRemainTime(remainTime.toString())
    setOtp(btoa(`${totp(otpauthURL)};1`))
  }


  return (
    <Container>
      <div className='shadow-lg p-8 rounded-lg bg-white'>
        <div className='flex justify-center w-auto'>
          {otp && <QRCode value={otp} className='w-32 h-32' />}
        </div>
        <h1 className='text-sm text-center mt-1'>{remainTime}초 남음</h1>
        <hr className="h-px my-5 bg-gray-100 border-1 dark:bg-gray-400"></hr>
        <h1 className='text-lg'><span className='font-bold'>{data.name}</span>님의 자세히보기</h1>
        <div className='flex flex-col mt-5 gap-1'>
          <label className='font-bold'><FontAwesomeIcon icon={faBus} /> 탑승차량</label>
          <span>{data.boarding_bus.name}</span>
        </div>
        <div className='flex flex-col mt-3 gap-1'>
          <label className='font-bold'><FontAwesomeIcon icon={faHome} /> 목적지</label>
          <span>{data.destination_stop.name}</span>
        </div>
      </div>
    </Container>
  )
}

export default User


