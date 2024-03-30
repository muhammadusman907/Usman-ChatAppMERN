import { Routes, Route, useNavigate , Navigate } from "react-router-dom";
import SignUp from "../pages/signup/signup.jsx";
import Login from "../pages/login/login.jsx";
import Chat from "../pages/chat/chat.jsx";
import { AuthProvider } from "../context/AuthProvider.js";
import { useContext } from "react";
const AppRouter = () => {
  const {isLogin} = useContext(AuthProvider);
  const navigate = useNavigate();
  console.log("Approuter ------> ", isLogin);
  return (
    <>
      <Routes>
        <Route path="/chat" element={isLogin ?  <Chat />  : <Navigate to="/"/>  }></Route>
        <Route path="/signup" element={!isLogin && <SignUp />}></Route>
        <Route
          path="/"
          element={isLogin ? <Navigate to="/chat" /> : <Login/>}
        ></Route>
      </Routes>
    </>
  );
};
export default AppRouter;
