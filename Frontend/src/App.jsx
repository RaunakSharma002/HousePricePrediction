import {BrowserRouter as Router, Routes, Route} from "react-router-dom"
import DataEntry from "./components/DataEntry/dataEntry"
import Prediction from "./components/Prediction/prediction"
import Navbar from "./components/Home/navbar"

function App() {
  return (
    <>
      <Router>
        <Navbar/>
        <Routes>
          <Route path="/" element={<DataEntry/>}/>
          <Route path="/prediction" element={<Prediction/>}/>
        </Routes>
      </Router>
    </>
  )
}

export default App
