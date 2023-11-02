import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.tsx'
import './index.css'
import { Toaster } from 'react-hot-toast'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Toaster position='top-center' toastOptions={{
      duration: 3000,
      error: {
        icon: '❌',
        style: {
          borderRadius: '10px',
          background: '#300',
          color: '#fff',
        }
      },
      success: {
        icon: '👏',
        style: {
          borderRadius: '10px',
          background: '#393',
          color: '#fff',
        }
      },
    }} />
    <App />
  </React.StrictMode>,
)
