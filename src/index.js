import { fetchCountries } from './fetchCountries';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import './css/styles.css';

const DEBOUNCE_DELAY = 300;

const refs = {
  nameInput: document.querySelector('#search-box'),
  countryList: document.querySelector('.country-list'),
};

refs.nameInput.addEventListener('input', debounce(onNameInput, DEBOUNCE_DELAY));

function onNameInput(event) {
  const inputedRequest = event.target.value.trim();

  if (inputedRequest !== '') {
    fetchCountries(inputedRequest)
      .then(countries => {
        renderCountriesList(countries);
      })
      .catch(error => {
        console.log(error);
        notifyFailure();
      });
  } else refs.countryList.innerHTML = '';
}

function renderCountriesList(countries) {
  if (countries.length > 10) {
    notifyInfo();
  } else if (countries.length >= 2 && countries.length <= 10) {
    refs.countryList.innerHTML = getMarkupOfSeveralCountry(countries);
  } else if (countries.length === 1) {
    refs.countryList.innerHTML = getMarkupOfOneCountry(countries);
  }
}

function getMarkupOfSeveralCountry(data) {
  return data
    .map(({ name: { official }, flags: { svg } }) => {
      return `<li>
                <div class="title-info">
                  <img src="${svg}" width="75 px" alt="Flag of ${official}">
                  <p>${official}</p>
                </div></li>`;
    })
    .join('');
}

function getMarkupOfOneCountry(data) {
  return data.map(
    ({
      name: { official },
      capital,
      population,
      flags: { svg },
      languages,
    }) => {
      return `<li>
              <div class="title-info">
                <img src="${svg}" width="75 px" alt="Flag of ${official}">
                <p><b>${official}</b></p>
              </div>
              <p><b>Capital</b>: ${capital}</p>
              <p><b>Population</b>: ${population}</p>
              <p><b>Languages</b>: ${Object.values(languages).join(', ')}</p>
          </li>`;
    }
  );
}

function notifyInfo() {
  Notify.info('Too many matches found. Please enter a more specific name.');
}

function notifyFailure() {
  Notify.failure('Oops, there is no country with that name');
}
