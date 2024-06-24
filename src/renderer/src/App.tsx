import Logo from '@/assets/tu.png'
import Decode from '@/components/Decode'
import Encode from '@/components/Encode'
import Layout from '@/components/Layout'
import useTheme from '@/hooks/useTheme'
import { BrowserRouter, Route, Routes } from 'react-router-dom'

function App() {
  const { theme } = useTheme()

  return (
    <BrowserRouter>
      <div className={`${theme} App z-0`}>
        <Routes>
          <Route element={<Layout />}>
            <Route path="/" element={<Home />}></Route>
            <Route path="/encode" element={<Encode />}></Route>
            <Route path="/decode" element={<Decode />}></Route>
          </Route>
        </Routes>
      </div>
    </BrowserRouter>
  )
}

function Home() {
  return (
    <div className="w-full max-w-3xl mx-auto h-full flex flex-col items-center justify-start">
      <div className="w-24 mt-16">
        <img src={Logo} className="dark:invert dark:brightness-[.1]" />
      </div>
      <h2 className="text-2xl my-4 font-bold">Technological University Mawlamyine</h2>
      <h3 className="text-lg">Department of Information Technology</h3>
      <p className="absolute top-[45%] text-3xl font-bold">Steganography using LSB algorithm</p>
      <div className="w-full flex justify-between items-end h-full mb-36">
        <div className="font-bold text-lg">
          <h2 className="mb-4">Supervised by</h2>
          <h2>Daw Ei Myat Mon</h2>
        </div>
        <div className="font-bold text-lg">
          <h2 className="mb-4">Presented by</h2>
          <h2>Aung Pyae Phyo</h2>
        </div>
      </div>
    </div>
  )
}

export default App
