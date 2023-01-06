import './css/styles.css'
import debounce from 'lodash.debounce'
import Notiflix from 'notiflix'

Notiflix.Notify.init({
    width: '500px',
    position: 'right-top',
    fontSize: '20px',
})

const DEBOUNCE_DELAY = 300;

const searchBox = document.querySelector("#search-box");
const countryList = document.querySelector(".country-list");
const countryInfo = document.querySelector(".country-info");

searchBox.addEventListener("input", debounce(searchCountry, DEBOUNCE_DELAY));

function searchCountry(evt) {
    let countryName = evt.target.value.trim();
    if (countryName) {
        fetchCountries(countryName)
            .then(countries => createMarkup(countries))
            .catch(() => createErrorMessage())
    } else {
        clearMarkUp();
    }
}



function fetchCountries(name) {

    return fetch(`https://restcountries.com/v3.1/name/${name}?fields=name,capital,population,flags,languages
`)
    .then(response => {
        if (!response.ok) {
        throw new Error(response.statusText);
        }
        return response.json();
    })
}

function createMarkup(data) {
    if (data.length > 10) {
        Notiflix.Notify.info(`Too many matches found. Please enter a more specific name.`);
    } else if (data.length === 1) {
        countryList.innerHTML = addCountriesInfo(data);
        console.log("data.length = 1")
    } else {
        countryInfo.innerHTML = addCountriesList(data);
    }

}

function createErrorMessage() {
    Notiflix.Notify.failure(`Oops, there is no country with that name`);
}

function clearMarkUp() {
    countryList.innerHTML = "";
    countryInfo.innerHTML = "";
}

function addCountriesList(data) {
    clearMarkUp();
    return data.map(item => `<li class="country-item">
        <div class="info-wrapper">
        <img src="${item.flags.svg}" width = 50px></img>
        <p class="country-name">${item.name.official}</p>   
        </div>
        </li>`).join(``);
}

function addCountriesInfo(data) {
    clearMarkUp();
    // const markup = data.map(({name: {official}, flags: {svg}, capital, population, languages: }) => )
    return data.map(item => `<li class="country-item">
        <div class="info-wrapper">
        <img src="${item.flags.svg}" width = 50px></img>
        <p class="country-name bold">${item.name.official}</p>  
        </div>
        <p>Capital: ${item.capital}</p>
        <p>Population: ${item.population}</p>
        <p>Languages: ${item.languages}</p>
        </li>`).join(``);
}