import DecodeIcon from '@/assets/decode.png'
import EncodeIcon from '@/assets/media-encoder.png'
import Logo from '@/assets/tu.png'
import { Link } from 'react-router-dom'

type SideBarProps = {
  theme: string
  switchTheme: () => void
}

type ButtonProps = {
  label: string
  icon: string
  to: string
}

function SideBar({ theme, switchTheme }: SideBarProps) {
  return (
    <div className="flex flex-col h-full justify-center items-center shadow-2xl py-1.5 pl-2 pr-3  dark:bg-slate-800  z-10 relative rounded-l-xl">
      <div className="w-2/4 absolute top-10  flex flex-col items-center  text-sm font-bold text-center">
        <Link to="/">
          <img src={Logo} className="w-4/4 mb-3 dark:invert dark:brightness-[.1]" />
        </Link>
      </div>
      <Button label={'Encode'} icon={EncodeIcon} to="/encode" />
      <Button label={'Decode'} icon={DecodeIcon} to="/decode" />
      <div className="radio-btn" onClick={() => switchTheme()}>
        <div className={`radio-inner ${theme == 'dark' ? 'active' : ''}`}></div>
      </div>
    </div>
  )
}

function Button({ label, icon, to }: ButtonProps) {
  return (
    <Link to={to}>
      <button className="flex items-center justify-center my-4 hover:bg-slate-100 hover:scale-100 scale-75 lg:scale-90 shadow-lg hover:dark:bg-slate-600 dark:bg-slate-700 p-3 rounded-lg border-slate-100 border-2 dark:border-0 ">
        <img src={icon} className="w-10 inline-block shrink-0 mr-2" />
        <h2 className="font-bold dark:text-cyan-100">{label}</h2>
      </button>
    </Link>
  )
}

export default SideBar
