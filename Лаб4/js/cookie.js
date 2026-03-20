function setCookie(name, value, days) {
    const date = new Date();
    date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
    const expires = "expires=" + date.toUTCString();
    document.cookie = name + "=" + JSON.stringify(value) + ";" + expires + ";path=/";
}

function getCookie(name) {
    const cookieName = name + "=";
    const cookies = document.cookie.split(';');
    
    for (let cookie of cookies) {
        cookie = cookie.trim();
        if (cookie.indexOf(cookieName) === 0) {
            const value = cookie.substring(cookieName.length, cookie.length);
            return JSON.parse(value);
        }
    }
    return null;
}
function deleteCookie(name) {
    setCookie(name, "", -1);
}