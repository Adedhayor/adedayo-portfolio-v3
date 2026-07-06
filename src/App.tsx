import { Routes, Route, Navigate } from 'react-router-dom'
import { Agentation } from 'agentation'
import Home from '@/pages/Home'

export default function App() {
  return (
    <>
      <Routes>
        {/* The composed portfolio, assembled from Optimus blocks. */}
        <Route path="/" element={<Home />} />
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>

      {/* Visual feedback toolbar — dev only */}
      {import.meta.env.DEV && <Agentation />}
    </>
  )
}
