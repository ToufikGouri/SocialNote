import Navbar from "./components/Navbar"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from "./pages/Home"
import Notes from "./pages/Notes"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Sidebar from "./components/Sidebar"
import Profile from "./pages/Profile"
import { useDispatch, useSelector } from "react-redux"
import { useEffect } from "react"
import { getUserData } from "./redux/userSlice"
import Search from "./pages/Search"

function App() {

  const isLoggedIn = useSelector(state => state.user.isLoggedIn) || false
  const dispatch = useDispatch()

  useEffect(() => {
    dispatch(getUserData())
  }, [isLoggedIn])

  return (
    <>
      <Router>
        {/* <Navbar /> */}
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/search" element={<Search />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
