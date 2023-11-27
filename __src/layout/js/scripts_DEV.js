import { createElementFromHTML } from "./helpers";

//////////////////////////////////////////////////////////////////////////////////////////
//    Фетчим
//////////////////////////////////////////////////////////////////////////////////////////
var myHeaders = new Headers();

const tokenMy = "E5H2ZM1-KS24HC0-GN1GASP-Y6E51QF";
const tokenTheir = "P3RTS9G-2YH4XAV-QWKVWAZ-E9XFFDQ";

myHeaders.append("X-API-KEY", tokenMy);

var requestOptions = {
    method: "GET",
    headers: myHeaders,
    redirect: "follow",
};

let fetchedData;

fetch(
    "https://api.kinopoisk.dev/v1.4/movie?rating.imdb=8-10&limit=24",
    requestOptions
)
    .catch(() => {
        showError("неизвестен");
    })
    .then((response) => {
        console.log(response.status); // Will show you the status
        console.log("response.ok " + response.ok); // Will show you the status
        if (response.status !== 200) {
            showError(response.status);
            throw new Error("HTTP status " + response.status);
        }
        return response.json();
    })
    .then((data) => {
        fetchedData = data;
    })
    .then(() => console.log(fetchedData))
    .then(() => fetchedData.docs.map((item) => showMovies(item)))
    .finally(() => removePreloader());

//////////////////////////////////////////////////////////////////////////////////////////
//    Выводим каталог
//////////////////////////////////////////////////////////////////////////////////////////

const moviesCatalog = document.querySelector(".js-movies-catalog");

const showMovies = (item) => {
    const block = createElementFromHTML(`
    <div class="movie-item">
    <div class="movie-item__title"><h3>${item.name}</h3></div>
    <div class="movie-item__pic">
        <img src="${item.poster.previewUrl}" alt="${item.name}" />
    </div>
</div>

`);
    moviesCatalog.append(block);
};

//////////////////////////////////////////////////////////////////////////////////////////
//    Для стилизации работаем с локальной копией, чтоб не злить апиху (вместо fetch)
//////////////////////////////////////////////////////////////////////////////////////////
// import { tempdata } from "./tempdata";
// tempdata.docs.map((item) => showMovies(item));

//////////////////////////////////////////////////////////////////////////////////////////
//    Если ошибка, показываем ее
//////////////////////////////////////////////////////////////////////////////////////////

function showError(code) {
    const block = createElementFromHTML(`
    <div class="error">
    <div class="error__text">
        Увы, произошла ошибка <span>(код ${code})</span> 😭. <br />
        Попробуйте зайти попозже.
    </div>
</div>
    `);
    moviesCatalog.replaceWith(block);
}

//////////////////////////////////////////////////////////////////////////////////////////
//    Убираем прелоадер
//////////////////////////////////////////////////////////////////////////////////////////

function removePreloader() {
    document.querySelector(".js-preloader").remove();
}

//////////////////////////////////////////////////////////////////////////////////////////
//    Form
//////////////////////////////////////////////////////////////////////////////////////////

import { maskPhone } from "./maskPhone";
const form = document.querySelector("form");
const nameField = document.getElementById("name");
const telField = document.getElementById("tel");
const submitButton = form.querySelector("input[type=submit]");
const formResult = document.querySelector(".js-form-result");

nameField.addEventListener("input", areBothFieldsValidated);
telField.addEventListener("input", areBothFieldsValidated);

maskPhone(telField);

const showFormResult = (name, tel) => {
    formResult.innerHTML = "";
    const block = createElementFromHTML(
        `
    <div class="form-result">
        <div class="form-result__name"><strong>Имя: </strong> ${name}</div>
        <div class="form-result__tel"><strong>Телефон: </strong>${tel}</div>
    </div>   
        `
    );
    formResult.append(block);
};

function areBothFieldsValidated() {
    const telDigits = telField.value.replace(/[^0-9\\.]+/g, "");

    telDigits.length >= 11 && nameField.value.length >= 2
        ? (submitButton.disabled = false)
        : (submitButton.disabled = true);
}

form.addEventListener("submit", (e) => {
    e.preventDefault();
    showFormResult(nameField.value, telField.value);
    form.reset();
    submitButton.disabled = true;
});
