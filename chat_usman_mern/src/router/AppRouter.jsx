import { BrowserRouter, Routes, Route } from "react-router-dom";
import SignUp from "../pages/signup/signup.jsx";
import Login from "../pages/login/login.jsx";
import Chat from "../pages/chat/chat.jsx";
const AppRouter = () => {
  return (
    <>
      <Routes>
        <Route path="/signup" element={<SignUp />}></Route>{" "}
        <Route path="/" element={<Login />}></Route>
        <Route path="/chat" element={<Chat/>}></Route>
      </Routes>
    </>
  );
};
export default AppRouter;
