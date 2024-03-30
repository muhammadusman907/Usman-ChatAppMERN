import Button from "@mui/material/Button";
import Login from "./pages/login/login.jsx";
import AppRouter from "./router/AppRouter.jsx";
import { AuthProvider } from "./context/AuthProvider.js";
import { useEffect, useState } from "react";

const App = () => {
  const [isLogin, setIsLogin] = useState(false);
  const updateIsLogin = (updateValue) =>{
          setIsLogin(updateValue)
  }
  const getTokenLocalStorage = localStorage.getItem("authTokan");
console.log(getTokenLocalStorage);
  useEffect(() => {
    if (getTokenLocalStorage) {
      setIsLogin(true);
    } 
  }, [getTokenLocalStorage]);
  console.log(isLogin);

  return (
    <>

      <AuthProvider.Provider value={{isLogin , updateIsLogin}}>
        <AppRouter />
      </AuthProvider.Provider> 
    </>
  );
};
export default App;
