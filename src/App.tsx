import { Routes, Route } from "react-router-dom"
import Header from "./components/Header"
import Home from "./pages/Home"
import Jokes from "./pages/Jokes"
import Dogs from "./pages/Dogs"
import Holidays from "./pages/Holidays"

function App() {
  return (
    <>
      <Header />

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/jokes" element={<Jokes />} />
        <Route path="/dogs" element={<Dogs />} />
        <Route path="/holidays" element={<Holidays />} />
      </Routes>
    </>
  )
}

export default App