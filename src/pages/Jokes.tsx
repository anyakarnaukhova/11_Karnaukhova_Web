import { useState, useEffect } from "react"

const JOKE_API = "https://v2.jokeapi.dev/joke"
const HISTORY_API = "https://jsonplaceholder.typicode.com/posts"

function Jokes() {
  const [joke, setJoke] = useState("")
  const [loading, setLoading] = useState(false)
  const [category, setCategory] = useState("Any")
  const [type, setType] = useState("any")
  const [history, setHistory] = useState<any[]>([])

  const fetchJoke = async () => {
    setLoading(true)

    let url = `${JOKE_API}/${category}`
    if (type !== "any") url += `?type=${type}`

    try {
      const res = await fetch(url)
      const data = await res.json()

      let text = ""

      if (data.type === "single") {
        text = data.joke
      } else {
        text = `${data.setup} ... ${data.delivery}`
      }

      setJoke(text)

      // POST
      await fetch(HISTORY_API, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          title: category,
          body: text
        })
      })

      loadHistory()

    } catch {
      setJoke("Ошибка загрузки")
    }

    setLoading(false)
  }

  // GET
  const loadHistory = async () => {
    const res = await fetch(HISTORY_API + "?_limit=5")
    const data = await res.json()
    setHistory(data)
  }

  const deleteItem = async (id: number) => {
  await fetch(`${HISTORY_API}/${id}`, {
    method: "DELETE"
  })

  setHistory(prev => prev.filter(item => item.id !== id))
}

  useEffect(() => {
    loadHistory()
  }, [])

  return (
    <div className="container main-content">

      <section className="panel">

        <div className="section-head">
          <h2>Шутки</h2>
          <button className="button" onClick={fetchJoke}>
            Случайная шутка
          </button>
        </div>

        {/* Настройки */}
        <div className="card">
          <h3>Настройки шутки</h3>

          <div className="inline-form">

            <div className="form-group">
              <label>Категория</label>
              <select onChange={(e) => setCategory(e.target.value)}>
                <option value="Any">Любая</option>
                <option value="Programming">Программирование</option>
                <option value="Misc">Разное</option>
                <option value="Dark">Черный юмор</option>
              </select>
            </div>

            <div className="form-group">
              <label>Тип</label>
              <select onChange={(e) => setType(e.target.value)}>
                <option value="any">Любой</option>
                <option value="single">Одна часть</option>
                <option value="twopart">Две части</option>
              </select>
            </div>

            <button className="button button-primary" onClick={fetchJoke}>
              Получить шутку
            </button>

          </div>
        </div>

        {/* результат */}
        <div className="card">
          <h3>Результат</h3>

          {loading && <div className="state-box">Загрузка...</div>}
          {joke && <div className="joke-box">{joke}</div>}
        </div>

        {/* История */}
        <div className="card">
          <h3>История</h3>

          <div className="history-list">
            {history.map((item) => (
              <div key={item.id} className="history-item">
                <span>{item.body}</span>
                <button onClick={() => deleteItem(item.id)}>🗑️</button>
              </div>
            ))}
            <button 
  className="button button-danger"
  onClick={() => setHistory([])}
>
  Очистить историю (DELETE)
</button>
          </div>

        </div>

      </section>
    </div>
  )
}

export default Jokes