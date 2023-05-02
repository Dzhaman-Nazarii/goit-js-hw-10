import debounce from 'lodash.debounce';
import './css/styles.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.querySelector('#search-box');
const container = document.querySelector('.country-info');
const list = document.querySelector('.country-list');

const onInput = debounce(evt => {
  const name = evt.target.value.trim();
  if (!name) {
    container.innerHTML = '';
    list.innerHTML = '';
    return;
  }
  fetchCountries(name)
    .then(choiceCountry)
    .catch(error => console.log(error));
  container.innerHTML = '';
  list.innerHTML = '';
  return;
}, DEBOUNCE_DELAY);

function choiceCountry(countries) {
  const arrLength = countries.length;
  if (arrLength > 10) {
    Notify.info('Too many matches found. Please enter a more specific name.');
    container.innerHTML = '';
    list.innerHTML = '';
    return;
  }
  if (arrLength === 1) {
    list.innerHTML = '';
    return renderCountryInfo(countries);
  }
  if (arrLength > 1) {
    container.innerHTML = '';
    return renderCountriesAll(countries);
  }
  container.innerHTML = '';
  list.innerHTML = '';
}

function renderCountryInfo(countries) {
  const markup = countries
    .map(country => {
      return `<div class="country">
      <img src="${country.flags.svg}" width="50" height="30" alt="flag of ${
        country.name.official
      }">
      <h2 class="country-title">${country.name.official}</h2></div>
            <p><b>Capital</b>: ${country.capital}</p>
            <p><b>Population</b>: ${country.population}</p>
            <p><b>Languages</b>: ${Object.values(country.languages)}</p>`;
    })
    .join('');
  container.innerHTML = markup;
}

function renderCountriesAll(countries) {
  const markup = countries
    .map(country => {
      return `<li class="country">
      <img src="${country.flags.svg}" width="50" height="30" alt="flag of ${country.name.official}">
      <p>${country.name.official}</p></li>`;
    })
    .join('');
  list.innerHTML = markup;
}

input.addEventListener('input', onInput);
