import './css/styles.css'
import debounce from 'lodash.debounce'
import Notiflix from 'notiflix'
import fetchCountries from './fetchCountries'

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

    clearMarkUp();
    
    if (countryName) {
        fetchCountries(countryName)
            .then(countries => createMarkup(countries))
            .catch(() => createErrorMessage())
    } else {
        clearMarkUp();
    }
}



function createMarkup(data) {
    if (data.length > 10) {
        Notiflix.Notify.info(`Too many matches found. Please enter a more specific name.`);
    } else if (data.length === 1) {
        countryList.innerHTML = addCountryInfo(data);
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
    return data.map(item => `<li class="country-item">
        <div class="info-wrapper">
        <img src="${item.flags.svg}" width = 50px></img>
        <p class="country-name">${item.name.official}</p>   
        </div>
        </li>`).join(``);
}

function addCountryInfo(data) {
    return data.map(({ name: { official }, flags: { svg }, capital, population, languages }) => {
        const countryLang = Object.values(languages).join(', ');
                            return `<li class="country-item">
                                    <div class="info-wrapper">
                                    <img src="${svg}" width = 50px></img>
                                    <p class="country-name bold">${official}</p>
                                    </div>
                                    <p>Capital: ${capital}</p>
                                    <p>Population: ${population}</p>
                                    <p>Languages: ${countryLang}</p>
                                    </li >`})
                        .join(``);
}