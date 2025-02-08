import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

// Importacion de contextos
import { AuthProvider } from './context/AuthProvider'

// Importacion de paginas
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route path="/" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
