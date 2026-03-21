class Card {
    #id;
    #name;
    #description;
    #preset;
    #imageUrl;

    constructor(id, name, description, imageUrl = "", preset = true) {
        this.#id = id;
        this.name = name;
        this.description = description;
        this.#preset = preset;
        this.imageUrl = imageUrl;
    }

    get id() { return this.#id; }
    get name() { return this.#name; }
    get description() { return this.#description; }
    get preset() { return this.#preset; }
    get imageUrl() { return this.#imageUrl; }

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

    set imageUrl(value) {
        this.#imageUrl = String(value).trim();
    }

    getType() {
        return "Карта";
    }

    getClassName() {
        return "card";
    }

    getExtra() {
        return [];
    }

    update(data) {
        this.name = data.name;
        this.description = data.description;
        if (data.imageUrl) this.imageUrl = data.imageUrl;
    }

    toJSON() {
        return {
            classType: this.constructor.name,
            id: this.id,
            name: this.name,
            description: this.description,
            imageUrl: this.imageUrl,
            preset: this.preset
        };
    }

    render(editMode = false) {
        const article = document.createElement("article");
        article.className = `card-item ${this.getClassName()}`;

        const imageHtml = this.imageUrl 
            ? `<img class="card-image" src="${this.imageUrl}" alt="${this.name}" onerror="this.src='https://placehold.co/300x180?text=Нет+фото'">`
            : `<div class="card-image" style="background: linear-gradient(135deg, #333, #555); height: 180px; display: flex; align-items: center; justify-content: center;">🖼️ Нет фото</div>`;

        article.innerHTML = `
            ${imageHtml}
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
}

class RacerCard extends Card {
    #speed;
    #stamina;
    #special;

    constructor(id, name, description, speed, stamina, special, imageUrl = "", preset = true) {
        super(id, name, description, imageUrl, preset);
        this.speed = speed;
        this.stamina = stamina;
        this.special = special;
    }

    get speed() { return this.#speed; }
    get stamina() { return this.#stamina; }
    get special() { return this.#special; }

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

    getType() { return "Гонщик"; }
    getClassName() { return "racer"; }
    getExtra() { return [`⚡ Скорость: ${this.speed}`, `💪 Выносливость: ${this.stamina}`, `✨ Особенность: ${this.special}`]; }

    update(data) {
        super.update(data);
        this.speed = data.speed;
        this.stamina = data.stamina;
        this.special = data.special;
    }

    toJSON() {
        return { ...super.toJSON(), speed: this.speed, stamina: this.stamina, special: this.special };
    }
}

class LightningMcQueenCard extends RacerCard {
    constructor(id, name, description, speed, stamina, special, imageUrl = "", preset = true) {
        super(id, name, description, speed, stamina, special, imageUrl, preset);
    }

    getType() { return "Гонщик №95"; }
    getClassName() { return "racer mcqueen"; }
}

class MaterCard extends RacerCard {
    constructor(id, name, description, speed, stamina, special, imageUrl = "", preset = true) {
        super(id, name, description, speed, stamina, special, imageUrl, preset);
    }

    getType() { return "Эвакуатор"; }
    getClassName() { return "racer mater"; }
}

class SallyCarreraCard extends RacerCard {
    constructor(id, name, description, speed, stamina, special, imageUrl = "", preset = true) {
        super(id, name, description, speed, stamina, special, imageUrl, preset);
    }

    getType() { return "Адвокат"; }
    getClassName() { return "racer sally"; }
}

class LocationCard extends Card {
    #difficulty;
    #effect;

    constructor(id, name, description, difficulty, effect, imageUrl = "", preset = true) {
        super(id, name, description, imageUrl, preset);
        this.difficulty = difficulty;
        this.effect = effect;
    }

    get difficulty() { return this.#difficulty; }
    get effect() { return this.#effect; }

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

    getType() { return "Локация"; }
    getClassName() { return "location"; }
    getExtra() { return [`🗺️ Сложность: ${this.difficulty}/5`, `✨ Эффект: ${this.effect}`]; }

    update(data) {
        super.update(data);
        this.difficulty = data.difficulty;
        this.effect = data.effect;
    }

    toJSON() {
        return { ...super.toJSON(), difficulty: this.difficulty, effect: this.effect };
    }
}

class RadiatorSpringsCard extends LocationCard {
    constructor(id, name, description, difficulty, effect, imageUrl = "", preset = true) {
        super(id, name, description, difficulty, effect, imageUrl, preset);
    }

    getType() { return "Радиатор-Спрингс"; }
    getClassName() { return "location radiator"; }
}

class RainbowBridgeCard extends LocationCard {
    constructor(id, name, description, difficulty, effect, imageUrl = "", preset = true) {
        super(id, name, description, difficulty, effect, imageUrl, preset);
    }

    getType() { return "Радужный мост"; }
    getClassName() { return "location rainbow"; }
}

class ThunderGulchCard extends LocationCard {
    constructor(id, name, description, difficulty, effect, imageUrl = "", preset = true) {
        super(id, name, description, difficulty, effect, imageUrl, preset);
    }

    getType() { return "Овраг Грома"; }
    getClassName() { return "location thunder"; }
}

const STORAGE_KEY = "lab5_cars_deck";

const baseCards = [
    new LightningMcQueenCard(
        "preset-mcqueen",
        "Молния Маккуин",
        "1 победитель, 42 лузера",
        10,
        8,
        "Кчау! При финише +2 к скорости",
        "./img/mc.jpg"
    ),
    new MaterCard(
        "preset-mater",
        "Метр",
        "Лучший друг Маккуина. Туповат, но милашка",
        5,
        9,
        "Восстанавливает 3 выносливости после гонки",
        "./img/mtr.jpg"
    ),
    new SallyCarreraCard(
        "preset-sally",
        "Салли Каррера",
        "Хозяйка мотеля. Любит извилистые дороги.",
        7,
        7,
        "Плавный ход: +2 к маневренности на извилистых трассах",
        "./img/sally.jpg"
    ),
    new RadiatorSpringsCard(
        "preset-radiator",
        "Радиатор-Спрингс",
        "Уютный городок на трассе 66. Здесь всё начиналось.",
        2,
        "Все гонщики восстанавливают 2 выносливости",
        "./img/radiator.jpg"
    ),
    new RainbowBridgeCard(
        "preset-rainbow",
        "Радужный мост",
        "Живописный мост с потрясающим видом.",
        3,
        "Гонщики получают +1 к скорости на этой трассе",
        "./img/rainbow.jpg"
    ),
    new ThunderGulchCard(
        "preset-thunder",
        "Овраг Грома",
        "Опасное место с крутыми поворотами и грязью.",
        5,
        "Скорость -1, но победитель получает двойную награду",
        "./img/grom.jpg"
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
        case "LightningMcQueenCard":
            return new LightningMcQueenCard(data.id, data.name, data.description, data.speed, data.stamina, data.special, data.imageUrl, data.preset);
        case "MaterCard":
            return new MaterCard(data.id, data.name, data.description, data.speed, data.stamina, data.special, data.imageUrl, data.preset);
        case "SallyCarreraCard":
            return new SallyCarreraCard(data.id, data.name, data.description, data.speed, data.stamina, data.special, data.imageUrl, data.preset);
        case "RadiatorSpringsCard":
            return new RadiatorSpringsCard(data.id, data.name, data.description, data.difficulty, data.effect, data.imageUrl, data.preset);
        case "RainbowBridgeCard":
            return new RainbowBridgeCard(data.id, data.name, data.description, data.difficulty, data.effect, data.imageUrl, data.preset);
        case "ThunderGulchCard":
            return new ThunderGulchCard(data.id, data.name, data.description, data.difficulty, data.effect, data.imageUrl, data.preset);
        case "RacerCard":
            return new RacerCard(data.id, data.name, data.description, data.speed, data.stamina, data.special, data.imageUrl, data.preset);
        case "LocationCard":
            return new LocationCard(data.id, data.name, data.description, data.difficulty, data.effect, data.imageUrl, data.preset);
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
        location.reload();
    }
}

function buildContent() {
    const wrapper = document.createElement("div");
    wrapper.className = "content-grid";
    wrapper.append(buildRacersSection(), buildLocationsSection());
    
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
    
    const customRacers = state.customCards.filter(card => card instanceof RacerCard);
    const customLocations = state.customCards.filter(card => card instanceof LocationCard);
    
    customRacers.forEach(card => grid.append(card.render(false)));
    customLocations.forEach(card => grid.append(card.render(false)));
    
    if (customRacers.length === 0 && customLocations.length === 0) return null;
    
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
        field("new-image", "Ссылка на изображение (URL)"),
        selectField("new-type", "Тип карты", [
            ["racer", "Гонщик"],
            ["location", "Локация"]
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

    form.append(racerExtra, locationExtra);

    const typeSelect = form.querySelector("#new-type");
    typeSelect.addEventListener("change", () => {
        racerExtra.style.display = typeSelect.value === "racer" ? "block" : "none";
        locationExtra.style.display = typeSelect.value === "location" ? "block" : "none";
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
        } else {
            const difficulty = form.querySelector("#new-difficulty").value;
            const effect = form.querySelector("#new-location-effect").value;
            card = new LocationCard(id, name, description, difficulty, effect, imageUrl, false);
        }

        state.customCards.unshift(card);
        saveState();
        buildPage();
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
        textareaField(`edit-description-${card.id}`, "Описание карты", card.description, true),
        field(`edit-image-${card.id}`, "Ссылка на изображение", card.imageUrl, true),
        ...extraFields(card),
        button("💾 Сохранить изменения", "button primary", null, "submit"),
        messageBlock(`msg-${card.id}`)
    );

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
            description: form.querySelector(`#edit-description-${card.id}`).value,
            imageUrl: form.querySelector(`#edit-image-${card.id}`).value
        };

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

    return [
        numberField(`extra-a-${card.id}`, "Сложность (1-5)", 1, 5, card.difficulty, true),
        textareaField(`extra-b-${card.id}`, "Эффект", card.effect, true)
    ];
}

function field(id, labelText, value = "", filled = false) {
    const div = document.createElement("div");
    div.className = "form-group";
    div.innerHTML = `<label for="${id}">${labelText}</label><input type="text" id="${id}" name="${id}">`;
    const input = div.querySelector("input");
    if (filled) {
        input.value = value;
    } else {
        input.placeholder = value;
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
    } else {
        textarea.placeholder = value;
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
    } else {
        input.placeholder = value;
    }
    return div;
}

function selectField(id, labelText, items) {
    const div = document.createElement("div");
    div.className = "form-group";
    div.innerHTML = `<label for="${id}">${labelText}</label><select id="${id}" name="${id}"></select>`;
    const select = div.querySelector("select");

    items.forEach(item => {
        const option = document.createElement("option");
        option.value = item[0];
        option.textContent = item[1];
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
    el.textContent = "";
    el.className = "form-message";
}
