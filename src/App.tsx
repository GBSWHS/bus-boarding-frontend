import { Routes, Route, BrowserRouter, Navigate } from 'react-router-dom'
import Login from './router/Login'
import User from './router/User'
import Manager from './router/Manager'
import { useEffect } from 'react'
import BusList from './router/admin/bus/List'
import UserList from './router/admin/user/List'
import UserCreate from './router/admin/user/Create'
import UserEdit from './router/admin/user/Edit'
import UserDetail from './router/admin/user/Detail'
import BusDetail from './router/admin/bus/Detail'
import BusCreate from './router/admin/bus/Create'
import StationList from './router/admin/station/List'
import StationDetail from './router/admin/station/Detail'
import StationCreate from './router/admin/station/Create'
import History from './router/admin/History'
import StationEdit from './router/admin/station/Edit'
import BusEdit from './router/admin/bus/Edit'
import AuthProvider from './components/AuthProvider'

function App() {
  function setScreenHeight() {
    const vh = window.innerHeight * 0.01
    document.documentElement.style.setProperty('--vh', `${vh}px`)
  }
  
  useEffect(() => {
    setScreenHeight()
    window.addEventListener('resize', setScreenHeight)
    return () => window.removeEventListener('resize', setScreenHeight)
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route path='/' element={<Login />} />
        <Route path='/manager' element={<AuthProvider type='BUS_ADMIN'><Manager /></AuthProvider>} />
        <Route path='/user' element={<AuthProvider type='USER'><User /></AuthProvider>} />
        
          <Route path='/admin'>
            <Route path='' element={<Navigate replace to="/home" />} />
            
            <Route path='bus' element={<AuthProvider type="ADMINISTRATOR"><BusList /></AuthProvider>} />
            <Route path='bus/create' element={<AuthProvider type="ADMINISTRATOR"><BusCreate /></AuthProvider>} />
            <Route path='bus/:busId' element={<AuthProvider type="ADMINISTRATOR"><BusDetail /></AuthProvider>} />
            <Route path='bus/:busId/edit' element={<AuthProvider type="ADMINISTRATOR"><BusEdit /></AuthProvider>} />

            <Route path='station' element={<AuthProvider type="ADMINISTRATOR"><StationList /></AuthProvider>} />
            <Route path='station/create' element={<AuthProvider type="ADMINISTRATOR"><StationCreate /></AuthProvider>} />
            <Route path='station/:stationId' element={<AuthProvider type="ADMINISTRATOR"><StationDetail /></AuthProvider>} />
            <Route path='station/:stationId/edit' element={<AuthProvider type="ADMINISTRATOR"><StationEdit /></AuthProvider>} />

            <Route path='user' element={<AuthProvider type="ADMINISTRATOR"><UserList /></AuthProvider>} />
            <Route path='user/create' element={<AuthProvider type="ADMINISTRATOR"><UserCreate /></AuthProvider>} />
            <Route path='user/:userId' element={<AuthProvider type="ADMINISTRATOR"><UserDetail /></AuthProvider>} />
            <Route path='user/:userId/edit' element={<AuthProvider type="ADMINISTRATOR"><UserEdit /></AuthProvider>} />

            <Route path='history' element={<AuthProvider type="ADMINISTRATOR"><History /></AuthProvider>} />
          </Route>
        
      </Routes>
    </BrowserRouter>
  )
}

export default App
