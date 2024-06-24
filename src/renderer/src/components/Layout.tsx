import SideBar from '@/components/SideBar'
import useTheme from '@/hooks/useTheme'
import { Outlet } from 'react-router-dom'

function Layout() {
  const { theme, setTheme } = useTheme()

  return (
    <div className="flex items-center dark:bg-primary-dark bg-primary opacity-90 dark:opacity-70  absolute top-5 bottom-5 left-5 right-5 shadow-2xl rounded-xl z-0 border-2 dark:border-slate-800 border-slate-300">
      <SideBar
        theme={theme}
        switchTheme={() => setTheme((currentTheme) => (currentTheme == 'light' ? 'dark' : 'light'))}
      />
      <Outlet />
    </div>
  )
}

export default Layout
