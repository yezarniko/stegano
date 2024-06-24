import { createContext, useContext, useState } from 'react'

interface Values {
  theme: string
  setTheme: React.Dispatch<React.SetStateAction<string>>
}

const ThemeContext = createContext<Values>({ theme: 'light', setTheme: () => '' })

export function ThemeProvider(props: { children: JSX.Element }) {
  const [theme, setTheme] = useState('dark')

  const values: Values = { theme, setTheme }

  return <ThemeContext.Provider value={values}>{props.children}</ThemeContext.Provider>
}

export default function useTheme(): Values {
  return useContext(ThemeContext)
}
