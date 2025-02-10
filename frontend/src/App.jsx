import { BrowserRouter, Routes, Route } from 'react-router-dom'
import './App.css'

// Importacion de contextos
import { AuthProvider } from './context/AuthProvider'
import { ChatProvider } from './context/ChatProvider'

// Importacion de helpers y rutas
import Auth from './helpers/VerifyAuth'
import { PrivateRoute } from './routes/PrivateRoutes'

// Importacion de paginas
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import ChatsPage from './pages/ChatsPage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            <Route path="/" element={<Auth />} >
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            <Route path="/chats" element={
              <PrivateRoute >
                <Route path="/" element={<ChatsPage />} />
              </PrivateRoute>
            }
            />
          </Routes>
        </ChatProvider>
      </AuthProvider>
    </BrowserRouter>
  )
}

export default App
