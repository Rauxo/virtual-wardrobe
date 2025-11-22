import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Welcome from './pages/welcome/Welcome';
import Login from './pages/Login/Login'


function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path='/gettingStarted' element={<Login/>}/>
    </Routes>
  </BrowserRouter>
  )
}

export default App