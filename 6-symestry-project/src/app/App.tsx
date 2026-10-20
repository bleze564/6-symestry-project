import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { ButtonGallery } from '../components/ui/Button/ButtonGallery'
import { AuthPage } from '../pages/logInPage/AuthPage'

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<AuthPage mode="login" />} />
        <Route path="/register" element={<AuthPage mode="register" />} />
        <Route path="/buttons" element={<ButtonGallery />} />
        <Route path="*" element={<Navigate to="/login" replace />} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
