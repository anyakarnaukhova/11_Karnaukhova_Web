import { createContext, useState } from "react"

type JokeContextType = {
  jokes: string[]
  addJoke: (joke: string) => void
}

export const JokeContext = createContext<JokeContextType>({
  jokes: [],
  addJoke: () => {}
})

export function JokeProvider({ children }: { children: React.ReactNode }) {
  const [jokes, setJokes] = useState<string[]>([])

  const addJoke = (joke: string) => {
    setJokes((prev) => [joke, ...prev])
  }

  return (
    <JokeContext.Provider value={{ jokes, addJoke }}>
      {children}
    </JokeContext.Provider>
  )
}