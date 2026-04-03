const JOKE_API = "https://v2.jokeapi.dev/joke";
const DOG_API = "https://dog.ceo/api";
const HOLIDAYS_API = "https://openholidaysapi.org";
const JSONPLACEHOLDER_API = "https://jsonplaceholder.typicode.com/posts";

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

    renderJokeHistory();
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

    let url = `${JOKE_API}/${category}`;
    let params = [];
    if (type !== "any") params.push(`type=${type}`);
    if (params.length) url += `?${params.join("&")}`;

    try {
        const response = await fetch(url);

        if (!response.ok) {
            setState("joke-state", "Ошибка загрузки шутки", true);
            return;
        }

        const joke = await response.json();

        if (joke.error) {
            setState("joke-state", "Ошибка API", true);
            return;
        }

        setState("joke-state", "✅ Шутка получена!");
        displayJoke(joke);

        addToHistory(joke);

    } catch (error) {
        setState("joke-state", "Сетевая ошибка", true);
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

// POST
async function addToHistory(joke) {
    const text = joke.type === "single"
        ? joke.joke
        : `${joke.setup} ... ${joke.delivery}`;

    try {
        const response = await fetch(JSONPLACEHOLDER_API, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
                title: joke.category,
                body: text
            })
        });

        if (!response.ok) return;

        renderJokeHistory();

    } catch {
        setState("joke-state", "Ошибка при сохранении", true);
    }
}

// GET
async function renderJokeHistory() {
    const container = document.getElementById("joke-history-list");
    if (!container) return;

    container.innerHTML = "Загрузка...";

    try {
        const response = await fetch(JSONPLACEHOLDER_API + "?_limit=5");

        if (!response.ok) {
            container.innerHTML = "❌ Ошибка загрузки";
            setState("joke-state", "Ошибка загрузки истории", true);
            return;
        }

        const data = await response.json();

        container.innerHTML = "";

        data.forEach(item => {
            const div = document.createElement("div");
            div.className = "history-item";

            div.innerHTML = `
                <span style="flex:1;">[${escapeHtml(item.title)}] ${escapeHtml(item.body.substring(0, 70))}</span>
                <button onclick="editHistoryItem(${item.id})">✏️</button>
                <button onclick="removeHistoryItem(${item.id})">🗑️</button>
            `;

            container.appendChild(div);
        });

    } catch {
        container.innerHTML = "❌ Сетевая ошибка";
        setState("joke-state", "Сетевая ошибка при загрузке", true);
    }
}

// PATCH
window.editHistoryItem = async function(id) {
    const newText = prompt("Редактировать шутку:");

    if (!newText) return;

    try {
        const response = await fetch(`${JSONPLACEHOLDER_API}/${id}`, {
            method: "PATCH",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ body: newText })
        });

        if (!response.ok) {
            setState("joke-state", "Ошибка обновления", true);
            return;
        }

        setState("joke-state", "✏️ Обновлено (PATCH)");
        renderJokeHistory();

    } catch {
        setState("joke-state", "Сетевая ошибка", true);
    }
};

// DELETE
window.removeHistoryItem = async function(id) {
    try {
        const response = await fetch(`${JSONPLACEHOLDER_API}/${id}`, {
            method: "DELETE"
        });

        if (!response.ok) {
            setState("joke-state", "Ошибка удаления", true);
            return;
        }

        setState("joke-state", "🗑️ Удалено (DELETE)");
        renderJokeHistory();

    } catch {
        setState("joke-state", "Сетевая ошибка", true);
    }
};

async function clearJokeHistory() {
    setState("joke-state", "⚠️ JSONPlaceholder не удаляет всё сразу (ограничение API)");
}