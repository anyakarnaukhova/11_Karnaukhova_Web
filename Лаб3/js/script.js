function startMemeTest() {
    if (!confirm('Тест "Кто ты из Майнкрафта?". Пройдёшь?')) {
        alert('Ну и дурак(');
        return;
    }

    let answers = {
        ovca: 0,
        block: 0,
        slizen: 0,
        zhitel: 0
    };

    let answer1 = prompt('Вопрос 1:\nКакой цвет тебе больше нравится?\n\n1) Зелёный\n2) Жёлтый\n3) Коричневый\n4) Белый\n\nВведи номер ответа:');
    
    if (answer1 === null) {
        alert('Тест прерван.');
        return;
    }
    
    answer1 = answer1.trim();
    if (answer1 === '' || isNaN(answer1) || !Number.isInteger(Number(answer1)) || answer1 < 1 || answer1 > 4) {
        alert('Введи число от 1 до 4.');
        return;
    }
    
    if (answer1 === '1') answers.slizen++;
    else if (answer1 === '2') answers.zhitel++;
    else if (answer1 === '3') answers.block++;
    else if (answer1 === '4') answers.ovca++;

    let answer2 = prompt('Вопрос 2:\nТвой идеальный день?\n\n1) Проснуться и нифига не делать\n2) Отдраить всю хату, приготовить, поработать\n3) Попрыгать, побегать и почавкать\n4) Спать весь день лол\n\nВведи номер ответа:');
    
    if (answer2 === null) {
        alert('Тест прерван.');
        return;
    }
    
    answer2 = answer2.trim();
    
    if (answer2 === '' || isNaN(answer2) || !Number.isInteger(Number(answer2)) || answer2 < 1 || answer2 > 4) {
        alert('Введи число от 1 до 4.');
        return;
    }
    
    if (answer2 === '1') answers.block++;
    else if (answer2 === '2') answers.zhitel++;
    else if (answer2 === '3') answers.slizen++;
    else if (answer2 === '4') answers.ovca++;

    let answer3 = prompt('Вопрос 3:\nКак тебя описывают друзья?\n\n1) Милый няшка\n2) Противный\n3) У меня нет друзей :(\n4) Спокойный, терпеливый\n\nВведи номер ответа:');
    
    if (answer3 === null) {
        alert('Тест прерван.');
        return;
    }
    answer3 = answer3.trim();
    
    if (answer3 === '' || isNaN(answer3) || !Number.isInteger(Number(answer3)) || answer3 < 1 || answer3 > 4) {
        alert('Введи число от 1 до 4.');
        return;
    }
    
    if (answer3 === '1') answers.ovca++;
    else if (answer3 === '2') answers.slizen++;
    else if (answer3 === '3') answers.block++;
    else if (answer3 === '4') answers.zhitel++;

    let answer4 = prompt('Вопрос 4:\nКак ты ведёшь себя в конфликте?\n\n1) Убегаю и прячусь\n2) Прыгаю и ору\n3) Спокойно решаю проблему\n4) Манипулирую\n\nВведи номер ответа:');
    
    if (answer4 === null) {
        alert('Тест прерван.');
        return;
    }
    
    answer4 = answer4.trim();
    
    if (answer4 === '' || isNaN(answer4) || !Number.isInteger(Number(answer4)) || answer4 < 1 || answer4 > 4) {
        alert('Введи число от 1 до 4.');
        return;
    }
    
    if (answer4 === '1') answers.ovca++;
    else if (answer4 === '2') answers.slizen++;
    else if (answer4 === '3') answers.block++;
    else if (answer4 === '4') answers.zhitel++;

    let result = '';
    let maxCount = Math.max(answers.ovca, answers.block, answers.slizen, answers.zhitel);
    
    if (maxCount === answers.ovca) {
        result = '🐑 Ты - овца :)\n\nМирный, добрый. Тебя все любят, но иногда пользуются твоей добротой.';
    } else if (maxCount === answers.block) {
        result = '🌱 Ты — блок земли :)\n\nНадёжный, скучноватый, но без тебя никуда';
    } else if (maxCount === answers.slizen) {
        result = '🟢 Ты — слизень :(\n\nЭнергичный, весёлый, но иногда бесишь';
    } else if (maxCount === answers.zhitel) {
        result = '🧔 Ты — мирный житель :)\n\nНо изумрудов не дам';
    }

    if (answers.ovca === maxCount && answers.block === maxCount && answers.slizen === maxCount && answers.zhitel === maxCount) {
        result = '🐑 Ты — овца! (потому что ничья, а овцы милее)';
    } else if (answers.ovca === maxCount && answers.slizen === maxCount) {
        result = '🐑 Ты — овца! (чуть-чуть слизня, но больше овца)';
    } else if (answers.ovca === maxCount && answers.block === maxCount) {
        result = '🐑 Ты — овца! (с примесью земли, но всё ещё овца)';
    } else if (answers.ovca === maxCount && answers.zhitel === maxCount) {
        result = '🐑 Ты — овца! (почти мирный житель, но все таки овца)';
    } else if (answers.slizen === maxCount && answers.block === maxCount) {
        result = '🟢 Ты — слизень! (мог бы стать блоком земли, но не дожал)';
    } else if (answers.slizen === maxCount && answers.zhitel === maxCount) {
        result = '🟢 Ты — слизень! (мирный прикольный слизень)';
    } else if (answers.block === maxCount && answers.zhitel === maxCount) {
        result = '🌱 Ты — блок земли! (с деловой жилкой)';
    }

    alert('Твой результат:\n\n' + result);

    if (confirm('Хочешь пройти тест заново?')) {
        startMemeTest();
    } else {
        alert('Заходи ещё!');
    }
}