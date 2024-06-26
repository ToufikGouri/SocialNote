import Navbar from "./components/Navbar"
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Home from "./pages/Home"
import Notes from "./pages/Notes"
import Signup from "./pages/Signup"
import Signin from "./pages/Signin"
import Sidebar from "./components/Sidebar"

function App() {

  return (
    <>
      <Router>
        {/* <Navbar /> */}
        <Sidebar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/signin" element={<Signin />} />
        </Routes>
      </Router>
    </>
  )
}

export default App
