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
import WelcomePage from './pages/WelcomePage'

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <ChatProvider>
          <Routes>
            <Route index element={<WelcomePage />} />
            <Route path="/" element={<Auth />} >
              <Route path="/login" element={<LoginPage />} />
              <Route path="/register" element={<RegisterPage />} />
            </Route>
            <Route path="/chats/*" element={
              <PrivateRoute >
                <Routes>
                  <Route path="/" element={<ChatsPage />} />
                </Routes>
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
