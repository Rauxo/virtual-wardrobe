import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Welcome from './pages/welcome/Welcome';
import Login from './pages/Login/Login'
import Register from  "./pages/Register/Register"


function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path='/gettingStarted' element={<Login/>}/>
      <Route path="/create" element={<Register/>}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App