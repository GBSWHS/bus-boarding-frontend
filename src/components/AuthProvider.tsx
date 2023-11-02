import { ReactNode, useEffect, useState } from "react"
import toast from "react-hot-toast"
import { useNavigate } from "react-router-dom"

export default function AuthProvider ({ children, type } : {children: ReactNode, type: 'ADMINISTRATOR' | 'BUS_ADMIN' | 'USER'}) {
  const navigate = useNavigate()
  const [renderChildren, setRenderChildren] = useState<boolean>(false)
  if (!localStorage.getItem('access_token')) {
    toast.error('로그인이 필요합니다.')
    navigate('/')
  }
  
  const fetchUser = async () => {
    const accessToken = localStorage.getItem('access_token')
    const user = await fetch('/api/user/me', {
      headers: { 'Authorization': 'Bearer ' + accessToken }
    })

    if (user.status !== 200) {
      toast.error('로그인이 필요합니다.')
      navigate('/')
    }

    const userJson = await user.json()
    if (userJson.role !== type) {
      toast.error('잘못된 접근입니다.')
      navigate('/')
    }

    setRenderChildren(true)
    return userJson
  }

  useEffect(() => {
    fetchUser()
  }, [])

  return (
    <>
      {renderChildren && children}
    </>
  )
}
