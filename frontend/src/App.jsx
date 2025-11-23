import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';
import Welcome from './pages/welcome/Welcome';
import Login from './pages/Login/Login'
import Register from  "./pages/Register/Register"
import Dasboard from './pages/Dashboard/Dasboard';
import MyWardrobe from './pages/wardrobe/MyWardrobe';
import Donations from './pages/donations/Donations';


function App() {
  return (
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<Welcome />} />
      <Route path='/gettingStarted' element={<Login/>}/>
      <Route path="/create" element={<Register/>}/>
      <Route path='/dashboard' element={<Dasboard/>}/>
      <Route path='/myclothes' element={<MyWardrobe/>} />
      <Route path="/donations" element={<Donations/>} />
    </Routes>
  </BrowserRouter>
  )
}

export default App