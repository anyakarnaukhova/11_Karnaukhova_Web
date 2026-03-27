class Card {
    #id;
    #name;
    #description;
    #preset;

    constructor(id, name, description, preset = true) {
        this.#id = id;
        this.name = name;
        this.description = description;
        this.#preset = preset;
    }

    get id() { return this.#id; }
    get name() { return this.#name; }
    get description() { return this.#description; }
    get preset() { return this.#preset; }

    set name(value) {
        value = String(value).trim();
        if (value.length < 2) throw new Error("Название слишком короткое.");
        this.#name = value;
    }

    set description(value) {
        value = String(value).trim();
        if (value.length < 5) throw new Error("Описание слишком короткое.");
        this.#description = value;
    }

    update(data) {
        this.name = data.name;
        this.description = data.description;
    }

    toJSON() {
        return {
            classType: this.constructor.name,
            id: this.id,
            name: this.name,
            description: this.description,
            preset: this.preset
        };
    }
}

class RacerCard extends Card {
    #speed;
    #stamina;
    #special;
    #imageUrl;

    constructor(id, name, description, speed, stamina, special, imageUrl = "", preset = true) {
        super(id, name, description, preset);
        this.speed = speed;
        this.stamina = stamina;
        this.special = special;
        this.#imageUrl = imageUrl;
    }

    get speed() { return this.#speed; }
    get stamina() { return this.#stamina; }
    get special() { return this.#special; }
    get imageUrl() { return this.#imageUrl; }

    set speed(value) {
        value = Number(value);
        if (!Number.isInteger(value) || value < 1 || value > 10) throw new Error("Скорость от 1 до 10.");
        this.#speed = value;
    }

    set stamina(value) {
        value = Number(value);
        if (!Number.isInteger(value) || value < 1 || value > 10) throw new Error("Выносливость от 1 до 10.");
        this.#stamina = value;
    }

    set special(value) {
        value = String(value).trim();
        if (value.length < 3) throw new Error("Особенность слишком короткая.");
        this.#special = value;
    }

    set imageUrl(value) {
        this.#imageUrl = String(value).trim();
    }

    getType() { return "Гонщик"; }
    getClassName() { return "racer"; }
    
    getExtra() { 
        return [`⚡ Скорость: ${this.speed}`, `💪 Выносливость: ${this.stamina}`, `✨ Особенность: ${this.special}`];
    }

    renderImage() {
        if (this.imageUrl) {
            return `<img class="card-image" src="${this.imageUrl}" alt="${this.name}" onerror="this.src='https://placehold.co/300x180?text=Нет+фото'">`;
        }
        return `<div class="card-image" style="background: linear-gradient(135deg, #333, #555); height: 180px; display: flex; align-items: center; justify-content: center;">🖼️ Нет фото</div>`;
    }

    render(editMode = false) {
        const article = document.createElement("article");
        article.className = `card-item ${this.getClassName()}`;

        article.innerHTML = `
            ${this.renderImage()}
            <div class="card-top">
                <h3 class="card-title">${this.name}</h3>
                <span class="card-badge">${this.getType()}</span>
            </div>
            <div class="card-meta">
                ${this.getExtra().map(item => `<span class="card-stat">${item}</span>`).join("")}
            </div>
            <p class="card-description">${this.description}</p>
            <div class="card-footer">
                <span class="card-origin">${this.preset ? "Базовая карта" : "Пользовательская карта"}</span>
                <div class="card-actions"></div>
            </div>
        `;

        const actions = article.querySelector(".card-actions");

        if (!this.preset) {
            const del = document.createElement("button");
            del.className = "button danger";
            del.type = "button";
            del.textContent = "Удалить";
            del.onclick = () => deleteCustomCard(this.id);
            actions.append(del);
        }

        if (editMode && this.preset) {
            article.append(createEditPanel(this));
        }

        return article;
    }

    update(data) {
        super.update(data);
        if (data.speed) this.speed = data.speed;
        if (data.stamina) this.stamina = data.stamina;
        if (data.special) this.special = data.special;
        if (data.imageUrl) this.imageUrl = data.imageUrl;
    }

    toJSON() {
        return { 
            ...super.toJSON(), 
            speed: this.speed, 
            stamina: this.stamina, 
            special: this.special,
            imageUrl: this.imageUrl
        };
    }
}

class LocationCard extends Card {
    #difficulty;
    #effect;
    #imageUrl;

    constructor(id, name, description, difficulty, effect, imageUrl = "", preset = true) {
        super(id, name, description, preset);
        this.difficulty = difficulty;
        this.effect = effect;
        this.#imageUrl = imageUrl;
    }

    get difficulty() { return this.#difficulty; }
    get effect() { return this.#effect; }
    get imageUrl() { return this.#imageUrl; }

    set difficulty(value) {
        value = Number(value);
        if (!Number.isInteger(value) || value < 1 || value > 5) throw new Error("Сложность от 1 до 5.");
        this.#difficulty = value;
    }

    set effect(value) {
        value = String(value).trim();
        if (value.length < 5) throw new Error("Эффект слишком короткий.");
        this.#effect = value;
    }

    set imageUrl(value) {
        this.#imageUrl = String(value).trim();
    }

    getType() { return "Локация"; }
    getClassName() { return "location"; }
    
    getExtra() { 
        return [`🗺️ Сложность: ${this.difficulty}/5`, `✨ Эффект: ${this.effect}`];
    }

    renderImage() {
        if (this.imageUrl) {
            return `<img class="card-image" src="${this.imageUrl}" alt="${this.name}" onerror="this.src='https://placehold.co/300x180?text=Нет+фото'">`;
        }
        return `<div class="card-image" style="background: linear-gradient(135deg, #333, #555); height: 180px; display: flex; align-items: center; justify-content: center;">🖼️ Нет фото</div>`;
    }

    render(editMode = false) {
        const article = document.createElement("article");
        article.className = `card-item ${this.getClassName()}`;

        article.innerHTML = `
            ${this.renderImage()}
            <div class="card-top">
                <h3 class="card-title">${this.name}</h3>
                <span class="card-badge">${this.getType()}</span>
            </div>
            <div class="card-meta">
                ${this.getExtra().map(item => `<span class="card-stat">${item}</span>`).join("")}
            </div>
            <p class="card-description">${this.description}</p>
            <div class="card-footer">
                <span class="card-origin">${this.preset ? "Базовая карта" : "Пользовательская карта"}</span>
                <div class="card-actions"></div>
            </div>
        `;

        const actions = article.querySelector(".card-actions");

        if (!this.preset) {
            const del = document.createElement("button");
            del.className = "button danger";
            del.type = "button";
            del.textContent = "Удалить";
            del.onclick = () => deleteCustomCard(this.id);
            actions.append(del);
        }

        if (editMode && this.preset) {
            article.append(createEditPanel(this));
        }

        return article;
    }

    update(data) {
        super.update(data);
        if (data.difficulty) this.difficulty = data.difficulty;
        if (data.effect) this.effect = data.effect;
        if (data.imageUrl) this.imageUrl = data.imageUrl;
    }

    toJSON() {
        return { 
            ...super.toJSON(), 
            difficulty: this.difficulty, 
            effect: this.effect,
            imageUrl: this.imageUrl
        };
    }
}

class UpgradeCard extends Card {
    #rarity;
    #bonusType;
    #bonusValue;

    constructor(id, name, description, rarity, bonusType, bonusValue, preset = true) {
        super(id, name, description, preset);
        this.rarity = rarity;
        this.bonusType = bonusType;
        this.bonusValue = bonusValue;
    }

    get rarity() { return this.#rarity; }
    get bonusType() { return this.#bonusType; }
    get bonusValue() { return this.#bonusValue; }

    set rarity(value) {
        const validRarities = ["common", "rare", "epic", "legendary"];
        if (!validRarities.includes(value)) {
            throw new Error("Редкость должна быть: common, rare, epic, legendary");
        }
        this.#rarity = value;
    }

    set bonusType(value) {
        const validTypes = ["speed", "stamina", "handling"];
        if (!validTypes.includes(value)) {
            throw new Error("Тип бонуса должен быть: speed, stamina, handling");
        }
        this.#bonusType = value;
    }

    set bonusValue(value) {
        value = Number(value);
        if (!Number.isInteger(value) || value < 1 || value > 15) {
            throw new Error("Значение бонуса от 1 до 15.");
        }
        this.#bonusValue = value;
    }

    getType() { 
        const rarityNames = {
            common: "Обычная деталь",
            rare: "Редкая деталь",
            epic: "Эпическая деталь",
            legendary: "Легендарная деталь"
        };
        return rarityNames[this.rarity];
    }
    
    getClassName() { 
        return `upgrade upgrade-${this.rarity}`;
    }
    
    getExtra() { 
        const bonusNames = {
            speed: "⚡ Скорость",
            stamina: "💪 Выносливость",
            handling: "🔄 Управление"
        };
        return [`📦 ${bonusNames[this.bonusType]}: +${this.bonusValue}`, `⭐ ${this.rarity}`];
    }

    renderImage() {
        const rarityColors = {
            common: "linear-gradient(135deg, #4a6b7f, #2c3e50)",
            rare: "linear-gradient(135deg, #2ecc71, #27ae60)",
            epic: "linear-gradient(135deg, #9b59b6, #8e44ad)",
            legendary: "linear-gradient(135deg, #f39c12, #e67e22)"
        };
        
        const color = rarityColors[this.rarity] || rarityColors.common;
        
        const rarityIcons = {
            common: "🔧",
            rare: "⭐",
            epic: "💎",
            legendary: "👑"
        };
        
        const icon = rarityIcons[this.rarity] || "🔧";

        return `<div class="card-image upgrade-image" style="background: ${color}; height: 120px; display: flex; align-items: center; justify-content: center; font-size: 3rem;">${icon}</div>`;
    }

    render(editMode = false) {
        const article = document.createElement("article");
        article.className = `card-item ${this.getClassName()}`;

        article.innerHTML = `
            ${this.renderImage()}
            <div class="card-top">
                <h3 class="card-title">${this.name}</h3>
                <span class="card-badge">${this.getType()}</span>
            </div>
            <div class="card-meta">
                ${this.getExtra().map(item => `<span class="card-stat">${item}</span>`).join("")}
            </div>
            <p class="card-description">${this.description}</p>
            <div class="card-footer">
                <span class="card-origin">${this.preset ? "Базовая карта" : "Пользовательская карта"}</span>
                <div class="card-actions"></div>
            </div>
        `;

        const actions = article.querySelector(".card-actions");

        if (!this.preset) {
            const del = document.createElement("button");
            del.className = "button danger";
            del.type = "button";
            del.textContent = "Удалить";
            del.onclick = () => deleteCustomCard(this.id);
            actions.append(del);
        }

        if (editMode && this.preset) {
            article.append(createEditPanel(this));
        }

        return article;
    }

    update(data) {
        super.update(data);
        if (data.rarity) this.rarity = data.rarity;
        if (data.bonusType) this.bonusType = data.bonusType;
        if (data.bonusValue) this.bonusValue = data.bonusValue;
    }

    toJSON() {
        return { 
            ...super.toJSON(), 
            rarity: this.rarity, 
            bonusType: this.bonusType, 
            bonusValue: this.bonusValue 
        };
    }
}

const STORAGE_KEY = "lab5_cars_deck";

const baseCards = [
    new RacerCard(
        "preset-mcqueen",
        "Молния Маккуин",
        "Главный герой, победитель Кубка Поршня. Быстрый, дерзкий, но с добрым сердцем.",
        10, 8, "Кчау! При финише +2 к скорости",
        "./img/mc.jpg"
    ),
    new RacerCard(
        "preset-mater",
        "Метр",
        "Лучший друг Маккуина. Старый эвакуатор, который знает всё о Радиатор-Спрингс.",
        5, 9, "Восстанавливает 3 выносливости после гонки",
        "./img/mtr.jpg"
    ),
    new RacerCard(
        "preset-sally",
        "Салли Каррера",
        "Хозяйка мотеля. Любит извилистые дороги и помогает восстанавливать город.",
        7, 7, "Плавный ход: +2 к маневренности на извилистых трассах",
        "./img/sally.jpg"
    ),
    new LocationCard(
        "preset-radiator",
        "Радиатор-Спрингс",
        "Уютный городок на трассе 66. Здесь всё начиналось. Дружелюбная атмосфера помогает гонщикам.",
        2, "Все гонщики восстанавливают 2 выносливости",
        "./img/radiator.jpg"
    ),
    new LocationCard(
        "preset-rainbow",
        "Радужный мост",
        "Живописный мост с потрясающим видом на каньон. Требует концентрации, но награждает скоростью.",
        3, "Гонщики получают +1 к скорости на этой трассе",
        "./img/rainbow.jpg"
    ),
    new LocationCard(
        "preset-thunder",
        "Овраг Грома",
        "Опасное место с крутыми поворотами и грязью. Только для опытных гонщиков.",
        5, "Скорость -1, но победитель получает двойную награду",
        "./img/grom.jpg"
    ),
    new UpgradeCard(
        "preset-nitro",
        "Nitro Booster",
        "Ускоритель для мгновенного рывка на финише. Увеличивает максимальную скорость.",
        "legendary", "speed", 15
    ),
    new UpgradeCard(
        "preset-tires",
        "Гоночные шины",
        "Специальные шины для улучшенного сцепления с трассой. Позволяют лучше проходить повороты.",
        "rare", "handling", 8
    ),
    new UpgradeCard(
        "preset-engine",
        "Турбодвигатель V8",
        "Мощный двигатель для длинных гонок. Повышает выносливость пилота.",
        "epic", "stamina", 12
    ),
    new UpgradeCard(
        "preset-brakes",
        "Керамические тормоза",
        "Улучшенная система торможения для крутых поворотов. Даёт преимущество на извилистых трассах.",
        "common", "handling", 5
    ),
    new UpgradeCard(
        "preset-oil",
        "Синтетическое масло",
        "Снижает трение двигателя. Небольшое улучшение всех характеристик.",
        "common", "speed", 3
    )
];

let state = {
    editMode: false,
    presetCards: [],
    customCards: []
};

document.addEventListener("DOMContentLoaded", init);

function init() {
    loadState();
    buildPage();
    
    setTimeout(() => {
        const typeSelect = document.querySelector("#new-type");
        if (typeSelect) {
            typeSelect.dispatchEvent(new Event("change"));
        }
    }, 0);
}

function loadState() {
    const raw = localStorage.getItem(STORAGE_KEY);

    if (!raw) {
        state = {
            editMode: false,
            presetCards: cloneCards(baseCards),
            customCards: []
        };
        saveState();
        return;
    }

    try {
        const saved = JSON.parse(raw);
        state.editMode = !!saved.editMode;
        state.presetCards = restoreCards(saved.presetCards, baseCards);
        state.customCards = restoreCards(saved.customCards, []);
    } catch {
        state = {
            editMode: false,
            presetCards: cloneCards(baseCards),
            customCards: []
        };
    }
}

function saveState() {
    localStorage.setItem(STORAGE_KEY, JSON.stringify({
        editMode: state.editMode,
        presetCards: state.presetCards.map(card => card.toJSON()),
        customCards: state.customCards.map(card => card.toJSON())
    }));
}

function cloneCards(cards) {
    return cards.map(card => createCard(card.toJSON()));
}

function restoreCards(saved, fallback) {
    if (!Array.isArray(saved) || saved.length === 0) return cloneCards(fallback);
    return saved.map(createCard);
}

function createCard(data) {
    switch (data.classType) {
        case "RacerCard":
            return new RacerCard(data.id, data.name, data.description, data.speed, data.stamina, data.special, data.imageUrl, data.preset);
        case "LocationCard":
            return new LocationCard(data.id, data.name, data.description, data.difficulty, data.effect, data.imageUrl, data.preset);
        case "UpgradeCard":
            return new UpgradeCard(data.id, data.name, data.description, data.rarity, data.bonusType, data.bonusValue, data.preset);
        default:
            throw new Error(`Неизвестный тип карты: ${data.classType}`);
    }
}

function buildPage() {
    document.body.innerHTML = "";
    document.body.append(buildHeader(), buildMain());
}

function buildMain() {
    const main = document.createElement("main");
    main.className = "page-wrapper";
    main.append(buildContent());
    return main;
}

function buildHeader() {
    const header = document.createElement("header");
    header.className = "site-header";

    header.innerHTML = `
        <div class="header-inner">
            <div class="brand">
                <h1>Колода карт Тачки 🚗</h1>
            </div>
            <div class="header-actions"></div>
        </div>
    `;

    const actions = header.querySelector(".header-actions");

    const editBtn = button(
        state.editMode ? "❌ Выключить редактирование" : "✏️ Включить редактирование",
        state.editMode ? "button danger" : "button primary",
        toggleEditMode
    );
    
    const resetBtn = button(
        "🔄 Сбросить всё",
        "button warning",
        resetToDefault
    );

    actions.append(editBtn, resetBtn);
    return header;
}

function resetToDefault() {
    if (confirm("Сбросить все карты к базовому набору? Все пользовательские карты будут удалены!")) {
        localStorage.removeItem(STORAGE_KEY);
        state = {
            editMode: false,
            presetCards: cloneCards(baseCards),
            customCards: []
        };
        saveState();
        buildPage();
        
        setTimeout(() => {
            const typeSelect = document.querySelector("#new-type");
            if (typeSelect) {
                typeSelect.dispatchEvent(new Event("change"));
            }
        }, 0);
    }
}

function buildContent() {
    const wrapper = document.createElement("div");
    wrapper.className = "content-grid";
    wrapper.append(buildRacersSection(), buildLocationsSection(), buildUpgradesSection());
    
    const customSection = buildCustomSection();
    if (customSection) wrapper.append(customSection);
    
    wrapper.append(buildAddCardSection());
    return wrapper;
}

function buildRacersSection() {
    const section = document.createElement("section");
    section.className = "section-block";

    const title = document.createElement("h2");
    title.textContent = "🏎️ Гонщики";

    const text = document.createElement("p");
    text.textContent = "Легендарные участники гонок из мира Тачек.";

    const grid = document.createElement("div");
    grid.className = "cards-grid";

    const racers = state.presetCards.filter(card => card instanceof RacerCard);
    racers.forEach(card => grid.append(card.render(state.editMode)));

    section.append(title, text, grid);
    return section;
}

function buildLocationsSection() {
    const section = document.createElement("section");
    section.className = "section-block";

    const title = document.createElement("h2");
    title.textContent = "🗺️ Локации";

    const text = document.createElement("p");
    text.textContent = "Знаменитые трассы и места, где проходят гонки.";

    const grid = document.createElement("div");
    grid.className = "cards-grid";

    const locations = state.presetCards.filter(card => card instanceof LocationCard);
    locations.forEach(card => grid.append(card.render(state.editMode)));

    section.append(title, text, grid);
    return section;
}

function buildUpgradesSection() {
    const section = document.createElement("section");
    section.className = "section-block";

    const title = document.createElement("h2");
    title.textContent = "🔧 Детали и улучшения";

    const text = document.createElement("p");
    text.textContent = "Модификации для твоего автомобиля. Улучшают характеристики гонщиков.";

    const grid = document.createElement("div");
    grid.className = "cards-grid";

    const upgrades = state.presetCards.filter(card => card instanceof UpgradeCard);
    upgrades.forEach(card => grid.append(card.render(state.editMode)));

    section.append(title, text, grid);
    return section;
}

function buildCustomSection() {
    if (!state.customCards.length) return null;

    const section = document.createElement("section");
    section.className = "section-block";

    const title = document.createElement("h2");
    title.textContent = "✨ Пользовательские карты";

    const text = document.createElement("p");
    text.textContent = "Карты, добавленные вами.";

    const grid = document.createElement("div");
    grid.className = "cards-grid";
    
    state.customCards.forEach(card => grid.append(card.render(false)));
    
    section.append(title, text, grid);
    return section;
}

function buildAddCardSection() {
    const section = document.createElement("section");
    section.className = "add-card-section";

    const title = document.createElement("h2");
    title.textContent = "➕ Добавить свою карту";

    const form = document.createElement("form");
    form.className = "add-card-form";
    form.id = "add-card-form";
    form.append(
        field("new-name", "Название карты"),
        textareaField("new-description", "Описание карты"),
        field("new-image", "Ссылка на изображение (URL)", "", false, "Необязательно"),
        selectField("new-type", "Тип карты", [
            ["racer", "Гонщик"],
            ["location", "Локация"],
            ["upgrade", "Деталь/Улучшение"]
        ]),
        messageBlock("add-card-message"),
        button("✨ Создать карту", "button success", null, "submit")
    );

    const racerExtra = document.createElement("div");
    racerExtra.id = "racer-extra";
    racerExtra.style.display = "none";
    racerExtra.append(
        numberField("new-speed", "Скорость (1-10)", 1, 10),
        numberField("new-stamina", "Выносливость (1-10)", 1, 10),
        field("new-special", "Особенность")
    );

    const locationExtra = document.createElement("div");
    locationExtra.id = "location-extra";
    locationExtra.style.display = "none";
    locationExtra.append(
        numberField("new-difficulty", "Сложность (1-5)", 1, 5),
        textareaField("new-location-effect", "Эффект локации")
    );

    const upgradeExtra = document.createElement("div");
    upgradeExtra.id = "upgrade-extra";
    upgradeExtra.style.display = "none";
    upgradeExtra.append(
        selectField("new-rarity", "Редкость", [
            ["common", "Обычная"],
            ["rare", "Редкая"],
            ["epic", "Эпическая"],
            ["legendary", "Легендарная"]
        ]),
        selectField("new-bonus-type", "Тип бонуса", [
            ["speed", "Скорость"],
            ["stamina", "Выносливость"],
            ["handling", "Управление"]
        ]),
        numberField("new-bonus-value", "Значение бонуса (1-15)", 1, 15)
    );

    form.append(racerExtra, locationExtra, upgradeExtra);

    const typeSelect = form.querySelector("#new-type");
    typeSelect.addEventListener("change", () => {
        racerExtra.style.display = typeSelect.value === "racer" ? "block" : "none";
        locationExtra.style.display = typeSelect.value === "location" ? "block" : "none";
        upgradeExtra.style.display = typeSelect.value === "upgrade" ? "block" : "none";
    });

    form.addEventListener("submit", addCard);
    section.append(title, form);
    return section;
}

function addCard(event) {
    event.preventDefault();
    const form = event.currentTarget;
    const msg = form.querySelector("#add-card-message");
    clearMessage(msg);

    try {
        const type = form.querySelector("#new-type").value;
        const id = "custom-" + Date.now();
        const name = form.querySelector("#new-name").value;
        const description = form.querySelector("#new-description").value;
        const imageUrl = form.querySelector("#new-image").value;

        let card;

        if (type === "racer") {
            const speed = form.querySelector("#new-speed").value;
            const stamina = form.querySelector("#new-stamina").value;
            const special = form.querySelector("#new-special").value;
            card = new RacerCard(id, name, description, speed, stamina, special, imageUrl, false);
        } else if (type === "location") {
            const difficulty = form.querySelector("#new-difficulty").value;
            const effect = form.querySelector("#new-location-effect").value;
            card = new LocationCard(id, name, description, difficulty, effect, imageUrl, false);
        } else {
            const rarity = form.querySelector("#new-rarity").value;
            const bonusType = form.querySelector("#new-bonus-type").value;
            const bonusValue = form.querySelector("#new-bonus-value").value;
            card = new UpgradeCard(id, name, description, rarity, bonusType, bonusValue, false);
        }

        state.customCards.unshift(card);
        saveState();
        buildPage();
        
        setTimeout(() => {
            const newTypeSelect = document.querySelector("#new-type");
            if (newTypeSelect) {
                newTypeSelect.dispatchEvent(new Event("change"));
            }
        }, 0);
        
    } catch (error) {
        showMessage(msg, error.message, true);
    }
}

function deleteCustomCard(id) {
    if (!confirm("Удалить карту?")) return;
    state.customCards = state.customCards.filter(card => card.id !== id);
    saveState();
    buildPage();
}

function toggleEditMode() {
    state.editMode = !state.editMode;
    saveState();
    buildPage();
}

function createEditPanel(card) {
    const section = document.createElement("section");
    section.className = "edit-panel";

    const title = document.createElement("h4");
    title.textContent = "✏️ Редактирование карты";

    const form = document.createElement("form");
    
    form.append(
        field(`edit-name-${card.id}`, "Название карты", card.name, true),
        textareaField(`edit-description-${card.id}`, "Описание карты", card.description, true)
    );
    
    if (card instanceof RacerCard || card instanceof LocationCard) {
        form.append(field(`edit-image-${card.id}`, "Ссылка на изображение", card.imageUrl, true));
    }
    
    form.append(...extraFields(card));
    form.append(button("💾 Сохранить изменения", "button primary", null, "submit"));
    form.append(messageBlock(`msg-${card.id}`));

    form.addEventListener("submit", (event) => saveEdit(event, card));
    section.append(title, form);
    return section;
}

function saveEdit(event, card) {
    event.preventDefault();
    const form = event.currentTarget;
    const msg = form.querySelector(".form-message");
    clearMessage(msg);

    try {
        const base = {
            name: form.querySelector(`#edit-name-${card.id}`).value,
            description: form.querySelector(`#edit-description-${card.id}`).value
        };
        
        if (card instanceof RacerCard || card instanceof LocationCard) {
            base.imageUrl = form.querySelector(`#edit-image-${card.id}`).value;
        }

        if (card instanceof RacerCard) {
            card.update({
                ...base,
                speed: form.querySelector(`#extra-a-${card.id}`).value,
                stamina: form.querySelector(`#extra-b-${card.id}`).value,
                special: form.querySelector(`#extra-c-${card.id}`).value
            });
        } else if (card instanceof LocationCard) {
            card.update({
                ...base,
                difficulty: form.querySelector(`#extra-a-${card.id}`).value,
                effect: form.querySelector(`#extra-b-${card.id}`).value
            });
        } else if (card instanceof UpgradeCard) {
            card.update({
                ...base,
                rarity: form.querySelector(`#extra-a-${card.id}`).value,
                bonusType: form.querySelector(`#extra-b-${card.id}`).value,
                bonusValue: form.querySelector(`#extra-c-${card.id}`).value
            });
        }

        saveState();
        buildPage();
    } catch (error) {
        showMessage(msg, error.message, true);
    }
}

function extraFields(card) {
    if (card instanceof RacerCard) {
        return [
            numberField(`extra-a-${card.id}`, "Скорость (1-10)", 1, 10, card.speed, true),
            numberField(`extra-b-${card.id}`, "Выносливость (1-10)", 1, 10, card.stamina, true),
            field(`extra-c-${card.id}`, "Особенность", card.special, true)
        ];
    }
    
    if (card instanceof LocationCard) {
        return [
            numberField(`extra-a-${card.id}`, "Сложность (1-5)", 1, 5, card.difficulty, true),
            textareaField(`extra-b-${card.id}`, "Эффект", card.effect, true)
        ];
    }
    
    if (card instanceof UpgradeCard) {
        return [
            selectField(`extra-a-${card.id}`, "Редкость", [
                ["common", "Обычная"],
                ["rare", "Редкая"],
                ["epic", "Эпическая"],
                ["legendary", "Легендарная"]
            ], card.rarity),
            selectField(`extra-b-${card.id}`, "Тип бонуса", [
                ["speed", "Скорость"],
                ["stamina", "Выносливость"],
                ["handling", "Управление"]
            ], card.bonusType),
            numberField(`extra-c-${card.id}`, "Значение бонуса (1-15)", 1, 15, card.bonusValue, true)
        ];
    }
    
    return [];
}

function field(id, labelText, value = "", filled = false, placeholder = "") {
    const div = document.createElement("div");
    div.className = "form-group";
    div.innerHTML = `<label for="${id}">${labelText}</label><input type="text" id="${id}" name="${id}" placeholder="${placeholder}">`;
    const input = div.querySelector("input");
    if (filled) {
        input.value = value;
    }
    return div;
}

function textareaField(id, labelText, value = "", filled = false) {
    const div = document.createElement("div");
    div.className = "form-group";
    div.innerHTML = `<label for="${id}">${labelText}</label><textarea id="${id}" name="${id}"></textarea>`;
    const textarea = div.querySelector("textarea");
    if (filled) {
        textarea.value = value;
    }
    return div;
}

function numberField(id, labelText, min, max, value = "", filled = false) {
    const div = document.createElement("div");
    div.className = "form-group";
    div.innerHTML = `<label for="${id}">${labelText}</label><input type="number" id="${id}" name="${id}" min="${min}" max="${max}">`;
    const input = div.querySelector("input");
    if (filled) {
        input.value = value;
    }
    return div;
}

function selectField(id, labelText, items, selectedValue = "") {
    const div = document.createElement("div");
    div.className = "form-group";
    div.innerHTML = `<label for="${id}">${labelText}</label><select id="${id}" name="${id}"></select>`;
    const select = div.querySelector("select");

    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item[0];
        option.textContent = item[1];
        if (selectedValue && item[0] === selectedValue) {
            option.selected = true;
        }
        select.append(option);
    });

    return div;
}

function button(text, className, handler = null, type = "button") {
    const btn = document.createElement("button");
    btn.className = className;
    btn.type = type;
    btn.textContent = text;
    if (handler) btn.addEventListener("click", handler);
    return btn;
}

function messageBlock(id) {
    const div = document.createElement("div");
    div.id = id;
    div.className = "form-message";
    return div;
}

function showMessage(el, text, error = false) {
    el.textContent = text;
    el.className = `form-message ${error ? "error" : "success"}`;
}

function clearMessage(el) {
    if (el) el.textContent = "";
}