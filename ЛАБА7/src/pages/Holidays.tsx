import { useState } from "react"

function Holidays() {
  const [holidays, setHolidays] = useState<any[]>([])

  const fetchHolidays = async () => {
    const res = await fetch(
      "https://openholidaysapi.org/PublicHolidays?countryIsoCode=NL&validFrom=2026-01-01&validTo=2026-12-31"
    )

    const data = await res.json()
    setHolidays(data)
  }

  return (
    <div className="container main-content">
      <section className="panel">

        <div className="section-head">
          <h2>Праздники</h2>
          <button className="button" onClick={fetchHolidays}>
            Загрузить
          </button>
        </div>

        <div className="card">
          <div className="holidays-list">

            {holidays.map((h, i) => (
              <div key={i} className="holiday-card">
                <div className="holiday-name">
                  {h.name?.[0]?.text}
                </div>
                <div className="holiday-date">
                  {h.startDate}
                </div>
              </div>
            ))}

          </div>
        </div>

      </section>
    </div>
  )
}

export default Holidays