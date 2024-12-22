import { Route, Routes ,Navigate} from "react-router-dom"
import Navbar from "./components/Navbar"
import HomePage from "./pages/HomePage"
import SignUpPage from "./pages/SignUpPage"
import LoginPage from "./pages/LoginPage"
import SettingsPage from "./pages/SettingsPage"
import ProfilePage from "./pages/ProfilePage"
import { useAuthStore } from "./store/useAuthStore"
import { useThemeStore } from "./store/useThemeStore"
import { useEffect } from "react"
import { Loader } from "lucide-react"
import { Toaster } from "react-hot-toast"
const App = () => {
  const {authUser,checkAuth,isCheckingAuth , onlineUsers} = useAuthStore();

  console.log("Online Users",onlineUsers);
  const { theme } = useThemeStore();
  useEffect(()=>{
    checkAuth()
  },[checkAuth]);
  console.log(authUser);
  if(isCheckingAuth && !authUser){
    return (
      <div className="flex items-center justify-center h-screen">
          <Loader className="size-9 animate-spin"/>
      </div>
    )
  }
  return (
    <div data-theme={theme}>
      <Navbar/>
      <Routes>
          {/* if there is a authenticated user then show them the homepage or else navigate them to the login page */}
          {/* if the user is not authenticated then send them to the signuppage else direct them to the homepage */}
          <Route path="/" element={authUser ? <HomePage /> : <Navigate to="/login"/>}/> 
          <Route path="/signup" element={!authUser?<SignUpPage />: <Navigate to = "/"/>}/>
          <Route path="/login" element={!authUser?<LoginPage />:<Navigate to = "/"/>}/>
          <Route path="/settings" element={<SettingsPage />}/>
          <Route path="/profile" element={authUser?<ProfilePage />:<Navigate to="/login"/>}/>
      </Routes>
      <Toaster/> 
    </div> 
  )
}

export default App