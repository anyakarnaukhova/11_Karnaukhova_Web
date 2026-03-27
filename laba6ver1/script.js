
const JOKE_API = "https://v2.jokeapi.dev/joke";
const DUCK_API = "https://random-d.uk/api";
const HOLIDAYS_API = "https://openholidaysapi.org";

let jokeHistory = [];

document.addEventListener("DOMContentLoaded", () => {
    document.getElementById("load-random-joke-btn").addEventListener("click", () => fetchJoke());
    document.getElementById("joke-form").addEventListener("submit", (e) => {
        e.preventDefault();
        fetchJoke();
    });
    document.getElementById("clear-history-btn").addEventListener("click", clearJokeHistory);

document.getElementById("load-random-dog-btn").addEventListener("click", fetchRandomDog);
document.getElementById("load-breeds-btn").addEventListener("click", fetchBreeds);
document.getElementById("dog-breed-form").addEventListener("submit", (e) => {
    e.preventDefault();
    fetchDogByBreed();
});
    document.getElementById("holidays-form").addEventListener("submit", (e) => {
        e.preventDefault();
        fetchHolidays();
    });
});

function setState(elementId, text, isError = false) {
    const el = document.getElementById(elementId);
    if (el) {
        el.textContent = text;
        el.style.color = isError ? "#c53b3b" : "#2f855a";
    }
}

function clearContainer(elementId) {
    const el = document.getElementById(elementId);
    if (el) el.innerHTML = "";
}

function escapeHtml(text) {
    if (!text) return "";
    return String(text)
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll('"', "&quot;")
        .replaceAll("'", "&#39;");
}

async function fetchJoke() {
    const category = document.getElementById("joke-category").value;
    const type = document.getElementById("joke-type").value;
    
    setState("joke-state", "Загрузка шутки...");
    clearContainer("joke-result");
    
    try {
        let url = `${JOKE_API}/${category}`;
        let params = [];
        if (type !== "any") params.push(`type=${type}`);
        if (params.length) url += `?${params.join("&")}`;
        
        const response = await fetch(url);
        if (!response.ok) throw new Error("Не удалось получить шутку");
        
        const joke = await response.json();
        if (joke.error) throw new Error(joke.message || "Ошибка API");
        
        setState("joke-state", "✅ Шутка получена!");
        displayJoke(joke);
        
        addToHistory(joke);
        
    } catch (error) {
        setState("joke-state", `❌ Ошибка: ${error.message}`, true);
    }
}

function displayJoke(joke) {
    const container = document.getElementById("joke-result");
    container.innerHTML = "";
    
    const jokeDiv = document.createElement("div");
    if (joke.type === "single") {
        jokeDiv.innerHTML = `<div class="joke-setup">😂 ${escapeHtml(joke.joke)}</div>`;
    } else {
        jokeDiv.innerHTML = `
            <div class="joke-setup">🎭 ${escapeHtml(joke.setup)}</div>
            <div class="joke-delivery">✨ ${escapeHtml(joke.delivery)}</div>
        `;
    }
    container.appendChild(jokeDiv);
}

function addToHistory(joke) {
    const historyItem = {
        id: Date.now(),
        text: joke.type === "single" ? joke.joke : `${joke.setup} ... ${joke.delivery}`,
        category: joke.category
    };
    jokeHistory.unshift(historyItem);
    if (jokeHistory.length > 8) jokeHistory.pop();
    renderJokeHistory();
}

function renderJokeHistory() {
    const container = document.getElementById("joke-history-list");
    if (!container) return;
    
    container.innerHTML = "";
    if (jokeHistory.length === 0) {
        container.innerHTML = '<div class="history-item">История пуста</div>';
        return;
    }
    
    jokeHistory.forEach(item => {
        const div = document.createElement("div");
        div.className = "history-item";
        div.innerHTML = `
            <span style="flex:1;">[${item.category}] ${escapeHtml(item.text.substring(0, 70))}${item.text.length > 70 ? "..." : ""}</span>
            <button onclick="editHistoryItem(${item.id})" title="Редактировать (PATCH)" style="background:none; border:none; cursor:pointer;">✏️</button>
            <button onclick="removeHistoryItem(${item.id})" title="Удалить (DELETE)" style="background:none; border:none; cursor:pointer; color:var(--danger);">🗑️</button>
        `;
        container.appendChild(div);
    });
}

window.editHistoryItem = function(id) {
    const item = jokeHistory.find(i => i.id === id);
    if (!item) return;
    
    const newText = prompt("Редактировать шутку:", item.text);
    if (newText && newText !== item.text) {
        jokeHistory = jokeHistory.map(i => 
            i.id === id ? { ...i, text: newText } : i
        );
        renderJokeHistory();
        setState("joke-state", "✏️ Шутка обновлена (PATCH)", false);
        setTimeout(() => setState("joke-state", "Готово", false), 1500);
    }
};

window.removeHistoryItem = function(id) {
    jokeHistory = jokeHistory.filter(item => item.id !== id);
    renderJokeHistory();
    setState("joke-state", "🗑️ Элемент удалён из истории (DELETE)", false);
    setTimeout(() => setState("joke-state", "Готово", false), 1500);
};

function clearJokeHistory() {
    jokeHistory = [];
    renderJokeHistory();
    setState("joke-state", "🧹 История очищена (аналог массового DELETE)", false);
}

const DOG_API = "https://dog.ceo/api";

async function fetchRandomDog() {
    setState("dog-state", "Загрузка собаки...");
    const img = document.getElementById("dog-image");
    img.style.display = "none";
    
    try {
        const response = await fetch(`${DOG_API}/breeds/image/random`);
        if (!response.ok) throw new Error("Не удалось загрузить собаку");
        
        const data = await response.json();
        if (data.status !== "success") throw new Error("Ошибка API");
        
        img.src = data.message;
        img.alt = "Случайная собака";
        img.style.display = "block";
        setState("dog-state", "🐕 Вот ваша случайная собака!");
        
    } catch (error) {
        setState("dog-state", `❌ Ошибка: ${error.message}`, true);
    }
}

async function fetchBreeds() {
    setState("breeds-state", "Загрузка списка пород...");
    clearContainer("breeds-list");
    
    try {
        const response = await fetch(`${DOG_API}/breeds/list/all`);
        if (!response.ok) throw new Error("Не удалось загрузить породы");
        
        const data = await response.json();
        const breeds = Object.keys(data.message);
        
        if (!breeds.length) {
            setState("breeds-state", "Список пород пуст", true);
            return;
        }
        
        setState("breeds-state", `✅ Доступно ${breeds.length} пород`);
        renderBreeds(breeds.slice(0, 50)); 
        
    } catch (error) {
        setState("breeds-state", `❌ Ошибка: ${error.message}`, true);
    }
}

function renderBreeds(breeds) {
    const container = document.getElementById("breeds-list");
    container.innerHTML = "";
    breeds.forEach(breed => {
        const tag = document.createElement("span");
        tag.className = "tag";
        tag.textContent = breed;
        tag.style.cursor = "pointer";
        tag.addEventListener("click", () => {
            document.getElementById("dog-breed").value = breed;
            fetchDogByBreed(breed);
        });
        container.appendChild(tag);
    });
}

async function fetchDogByBreed(breed = null) {
    const breedName = breed || document.getElementById("dog-breed").value.trim().toLowerCase();
    if (!breedName) {
        setState("dog-state", "Введите название породы", true);
        return;
    }
    
    const container = document.getElementById("breed-dog-container");
    container.innerHTML = '<div class="state-box">Загрузка...</div>';
    
    try {
        const response = await fetch(`${DOG_API}/breed/${breedName}/images/random`);
        
        if (!response.ok) {
            throw new Error(`Порода "${breedName}" не найдена`);
        }
        
        const data = await response.json();
        if (data.status !== "success") throw new Error("Ошибка API");
        
        container.innerHTML = `
            <img src="${data.message}" alt="Собака породы ${breedName}" 
                 style="max-width: 100%; max-height: 300px; border-radius: 12px; box-shadow: var(--shadow);">
            <div class="state-box" style="margin-top: 8px;">🐕 Порода: ${breedName}</div>
        `;
        
    } catch (error) {
        container.innerHTML = `<div class="state-box" style="color: var(--danger);">❌ ${error.message}</div>`;
    }
}

async function fetchHolidays() {
    const country = document.getElementById("holiday-country").value;
    const year = document.getElementById("holiday-year").value;
    const language = document.getElementById("holiday-language").value;
    
    setState("holidays-state", "Загрузка праздников...");
    clearContainer("holidays-list");
    
    try {
        const startDate = `${year}-01-01`;
        const endDate = `${year}-12-31`;
        const url = `${HOLIDAYS_API}/PublicHolidays?countryIsoCode=${country}&languageIsoCode=${language}&validFrom=${startDate}&validTo=${endDate}`;
        
        const response = await fetch(url, {
            headers: { "accept": "text/json" }
        });
        
        if (!response.ok) throw new Error(`Ошибка HTTP: ${response.status}`);
        
        const holidays = await response.json();
        
        if (!holidays || holidays.length === 0) {
            setState("holidays-state", "Нет праздников за выбранный период", true);
            return;
        }
        
        setState("holidays-state", `✅ Найдено ${holidays.length} праздников`);
        renderHolidays(holidays, language);
        
    } catch (error) {
        setState("holidays-state", `❌ Ошибка: ${error.message}`, true);
    }
}

function renderHolidays(holidays, language) {
    const container = document.getElementById("holidays-list");
    container.innerHTML = "";
    
    holidays.forEach(holiday => {
        let name = holiday.name.find(n => n.language === language)?.text;
        if (!name) name = holiday.name[0]?.text || "Без названия";
        
        const card = document.createElement("div");
        card.className = "holiday-card";
        card.innerHTML = `
            <div class="holiday-name">${escapeHtml(name)}</div>
            <div class="holiday-date">📅 ${holiday.startDate} ${holiday.endDate !== holiday.startDate ? `— ${holiday.endDate}` : ""}</div>
            ${holiday.nationwide ? '<span class="tag" style="background:#e0f2e0;">По всей стране</span>' : ''}
        `;
        container.appendChild(card);
    });
}