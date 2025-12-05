import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { Provider } from "react-redux";
import { store } from "./store/store";
import ProtectedRoute from "./components/ProtectedRoute";
import Welcome from "./pages/welcome/Welcome";
import Login from "./pages/Login/Login";
import Register from "./pages/Register/Register";
import ForgotPassword from "./pages/forgotpasword/ForgotPassword";
import Dashboard from "./pages/Dashboard/Dasboard";
import MyWardrobe from "./pages/wardrobe/MyWardrobe";
import Donations from "./pages/donations/Donations";
import Profile from "./pages/profile/Profile";

function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Welcome />} />
          <Route path="/gettingStarted" element={<Login />} />
          <Route path="/create" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />

          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<Dashboard />} />
            <Route path="/myclothes" element={<MyWardrobe />} />
            <Route path="/donations" element={<Donations />} />
            <Route path="/profile" element={<Profile />} />
          </Route>

          <Route path="*" element={<Navigate to="/gettingStarted" replace />} />
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}

export default App;
