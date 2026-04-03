import { useState } from "react"

function Dogs() {
  const [image, setImage] = useState("")
  const [breeds, setBreeds] = useState<string[]>([])
  const [loading, setLoading] = useState(false)

  const fetchDog = async () => {
    setLoading(true)

    const res = await fetch("https://dog.ceo/api/breeds/image/random")
    const data = await res.json()

    setImage(data.message)
    setLoading(false)
  }

  const fetchBreeds = async () => {
    const res = await fetch("https://dog.ceo/api/breeds/list/all")
    const data = await res.json()

    setBreeds(Object.keys(data.message))
  }

  return (
    <div className="container main-content">
      <section className="panel">

        <div className="section-head">
          <h2>Собаки</h2>
          <button className="button" onClick={fetchDog}>
            Случайная собака
          </button>
        </div>

        <div className="two-column">

          <div className="card">
            <h3>Породы</h3>
            <button className="button button-primary" onClick={fetchBreeds}>
              Загрузить породы
            </button>

            <div className="tag-list">
              {breeds.map((b, i) => (
                <span key={i} className="tag">{b}</span>
              ))}
            </div>
          </div>

          <div className="card">
            <h3>Изображение</h3>

            {loading && <div className="state-box">Загрузка...</div>}

            {image && (
              <img
                src={image}
                style={{ maxWidth: "100%", borderRadius: "12px" }}
              />
            )}
          </div>

        </div>

      </section>
    </div>
  )
}

export default Dogs