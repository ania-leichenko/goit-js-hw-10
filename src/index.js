import './css/styles.css';
import debounce from 'lodash.debounce';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { fetchCountries } from './fetchCountries';

const DEBOUNCE_DELAY = 300;

const input = document.getElementById('search-box');
const list = document.querySelector('.country-list');
const info = document.querySelector('.country-info');

const cleanValue = ref => (ref.innerHTML = '');

const onChangeInput = e => {
  const correctInputValue = e.target.value.trim();

  if (!correctInputValue) {
    cleanValue(list);
    cleanValue(info);
    return;
  }

  fetchCountries(correctInputValue)
    .then(data => {
      if (data.length > 10) {
        Notify.info(
          'Too many matches found. Please enter a more specific name'
        );
        return;
      }
      renderHtmlElement(data);
    })
    .catch(err => {
      cleanValue(list);
      cleanValue(info);
      Notify.failure('Oops, there is no country with that name');
    });
};

const renderHtmlElement = data => {
  if (data.length === 1) {
    cleanValue(list);
    const markupInfo = createInfo(data);
    info.innerHTML = markupInfo;
  } else {
    cleanValue(info);
    const markupList = createList(data);
    list.innerHTML = markupList;
  }
};

const createList = data => {
  return data
    .map(
      ({ name, flags }) =>
        `<li><img src="${flags.png}" alt="${name.official}" width="60" height="40">${name.official}</li>`
    )
    .join('');
};

const createInfo = data => {
  return data.map(
    ({ name, capital, population, flags, languages }) =>
      `<h1><img src="${flags.png}" alt="${
        name.official
      }" width="40" height="40">${name.official}</h1>
      <p>Capital: ${capital}</p>
      <p>Population: ${population}</p>
      <p>Languages: ${Object.values(languages)}</p>`
  );
};

input.addEventListener('input', debounce(onChangeInput, DEBOUNCE_DELAY));
