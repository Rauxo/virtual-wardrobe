import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Welcome from './pages/welcome/Welcome';


function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Welcome />} />
    </Routes>
  </BrowserRouter>
  )
}

export default App