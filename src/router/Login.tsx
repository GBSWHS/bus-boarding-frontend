import { FormEvent, useEffect, useState } from 'react'
import Container from '../components/Container'
import logo from './../assets/logo.png'
import toast from 'react-hot-toast'
import { useNavigate } from 'react-router-dom'

function Login() {
  const [userType, setUserType] = useState<'student' | 'teacher'>('student')
  const [studentId, setStudentId] = useState<string>('')
  const [name, setName] = useState<string>('')
  const [phone, setPhone] = useState<string>('')
  const [password, setPassword] = useState<string>('')
  const navigation = useNavigate()
  const switchType = () => {
    setUserType(userType === 'student' ? 'teacher' : 'student')
  }

  useEffect(() => {
    localStorage.removeItem('access_token')
    localStorage.removeItem('totp_secret')
  }, [])

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault()

    if (userType === 'student' && (studentId === '' || name === '' || phone === '')) {
      toast.error('모든 정보를 입력해주세요.')
      return
    }

    if (userType === 'teacher' && password === '') {
      toast.error('비밀번호를 입력해주세요.')
      return
    }

    
    const res = await fetch('/api/auth/' + (userType === 'student' ? 'user' : 'admin'), {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(userType === 'student' ? {
        student_id: studentId,
        name,
        phone_number: phone,
      }: { password })
    })
    
    if (res.status !== 200) {
      try {
        const responseBody = await res.json()
        toast.error(responseBody.detail)
      } catch {
        toast.error('서버 오류 발생')
        navigation('/')
      }
      
      return
    }

    const response = await res.json()
    toast.success('로그인 성공!')
    localStorage.setItem('access_token', response.access_token)
    if (response.type === 'USER') localStorage.setItem('totp_secret', response.totp_secret)

    return navigation(response.type === 'USER' ? '/user' : response.type === 'BUS_ADMIN' ? '/manager' : '/admin')
  }

  return (
    <Container>
      <div className='shadow-lg p-8 rounded-lg bg-white'>
        <div className='flex justify-center'>
          <img src={logo} className='w-16 hover:rotate-12 duration-150' />
        </div>
        <h1 className='text-xl font-bold text-center mt-3'>버스탑승시스템 로그인</h1>
        <hr className="h-px my-6 bg-gray-100 border-1 dark:bg-gray-400"></hr>
        <form onSubmit={onSubmit}>
          { userType === 'student' ? (
            <>
              <div className='flex flex-col mt-5 gap-1'>
                <label>학번</label>
                <input onChange={(e) => setStudentId(e.target.value)} value={studentId} className='h-12 bg-gray-100 shadow-sm hover:shadow-lg focus:shadow-lg rounded-lg p-3 transition-all' placeholder='3111'/>
              </div>
              <div className='flex flex-col mt-5 gap-1'>
                <label>이름</label>
                <input onChange={(e) => setName(e.target.value)} value={name} className='h-12 bg-gray-100 shadow-sm hover:shadow-lg focus:shadow-lg rounded-lg p-3 transition-all' placeholder='임태현'/>
              </div>
              <div className='flex flex-col mt-5 gap-1'>
                <label>전화번호</label>
                <input onChange={(e) => setPhone(e.target.value)} value={phone} className='h-12 bg-gray-100 shadow-sm hover:shadow-lg focus:shadow-lg rounded-lg p-3 transition-all' placeholder='01012345678'/>
              </div>
            </>
          ) : (
            <div className='flex flex-col mt-5 gap-1'>
              <label>비밀번호</label>
              <input onChange={(e) => setPassword(e.target.value)} value={password} type='password' className='h-12 bg-gray-100 shadow-sm hover:shadow-lg focus:shadow-lg rounded-lg p-3 transition-all' />
            </div>
          ) }
          <button className='bg-blue-500 hover:bg-blue-400 text-white font-bold py-2 rounded-lg hover:shadow-lg mt-5 w-full transition-all' type='submit'>로그인</button>
        </form>
        <button className='bg-green-500 hover:bg-green-400 text-white font-bold py-2 rounded-lg hover:shadow-lg mt-1 w-full transition-all' onClick={switchType}>{userType === 'teacher' ? '학생' : '선생님'}이신가요?</button>
        <small className='w-full text-center text-xs'>부정사용 확인시 <a href='//mileage.gbsw.hs.kr' className='text-red-400 text-xs'>벌점</a> 발급 예정.</small>
      </div>
    </Container>
  )
}

export default Login
