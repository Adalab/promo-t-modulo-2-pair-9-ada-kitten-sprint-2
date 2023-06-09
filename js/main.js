'use strict';

/* Elementos que usamos en el HTML */
const newFormElement = document.querySelector('.js-new-form');
const listElement = document.querySelector('.js-list');
const searchButton = document.querySelector('.js-button-search');
const buttonAdd = document.querySelector('.js-btn-add');
const buttonCancelForm = document.querySelector('.js-btn-cancel');
const inputDesc = document.querySelector('.js-input-desc');
const inputPhoto = document.querySelector('.js-input-photo');
const inputName = document.querySelector('.js-input-name');
const inputRace = document.querySelector('.js-input-race');

const linkNewFormElememt = document.querySelector('.js-button-new-form');
const labelMessageError = document.querySelector('.js-label-error');
const input_search_desc = document.querySelector('.js_in_search_desc');
const input_search_race = document.querySelector('.js_in_search_race');
const GITHUB_USER = '<IreneTaPa>';
const SERVER_URL = `https://dev.adalab.es/api/kittens/${GITHUB_USER}`;

//Objetos con cada gatito

let kittenDataList = [];
const kittenListStored = JSON.parse(localStorage.getItem('kittensList'));

if (kittenListStored) {
    console.log(kittenListStored);
  renderKittenList(kittenListStored);
  kittenDataList = kittenListStored;
} else {
  fetch(SERVER_URL)
    .then((response) => response.json())
    .then((data) => {
      const results = data.results;
      kittenDataList = results;
      console.log(results);
      renderKittenList(kittenDataList);
      localStorage.setItem('kittensList', JSON.stringify(kittenDataList));
    })
    .catch((error) => {
      console.error(error);
    });
}

//Funciones
function renderKitten(kittenData) {
    const liElement = document.createElement('li');
    liElement.classList.add('card');
    const articleElement = document.createElement('article');
    liElement.appendChild(articleElement);
    const imgElement = document.createElement('img');
    imgElement.classList.add('card_img');
    imgElement.src = kittenData.image;
    const h3Title = document.createElement('h3');
    h3Title.classList.add('card_title');
    articleElement.appendChild(h3Title);

    return liElement;
//   const kitten = `<li class="card">
//     <article>
//       <img
//         class="card_img"
//         src=${kittenData.image}
//         alt="gatito"
//       />
//       <h3 class="card_title">${kittenData.name}</h3>
//       <h3 class="card_race">${kittenData.race}</h3>
//       <p class="card_description">
//       ${kittenData.desc}
//       </p>
//     </article>
//     </li>`;
//   return kitten;
}

function renderKittenList(kittenDataList) {
  listElement.innerHTML = '';
  for (const kittenItem of kittenDataList) {
    listElement.innerHTML += renderKitten(kittenItem);
  }
}

//Mostrar/ocultar el formulario
function showNewCatForm() {
  newFormElement.classList.remove('collapsed');
}
function hideNewCatForm() {
  newFormElement.classList.add('collapsed');
}

function handleClickNewCatForm(event) {
  event.preventDefault();
  if (newFormElement.classList.contains('collapsed')) {
    showNewCatForm();
  } else {
    hideNewCatForm();
  }
}

   let valueDesc = inputDesc.value;
   let valuePhoto = inputPhoto.value;
   let valueName = inputName.value;

//Adicionar nuevo gatito
function addNewKitten(event) {
  event.preventDefault();
  //obtener la información de los gatitos del formulario
  const newImage = inputPhoto.value;
  const newDescription = inputDesc.value;
  const newName = inputName.value;
  const newRace = inputRace.value;
  //nuevo objeto con la info del gatito
  const newKittenDataObject = {
    image: newImage,
    name: newName,
    desc: newDescription,
    race: newRace,
  };
  /*kittenDataList.push(newKittenDataObject);
  if (valueDesc === '' || valuePhoto === '' || valueName === '') {
    labelMessageError.innerHTML = '¡Uy! parece que has olvidado algo';
  } else if (valueDesc !== '' && valuePhoto !== '' && valueName !== '') {
    labelMessageError.innerHTML = '¡Mola! ¡Un nuevo gatito en Adalab!';
  }*/



  fetch(`https://dev.adalab.es/api/kittens/${GITHUB_USER}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(newKittenDataObject),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data.success) {
        kittenDataList.push(newKittenDataObject);
        localStorage.setItem('newKitten', JSON.stringify(newKittenDataObject));
        renderKittenList(kittenDataList);
        labelMessageError.innerHTML = '¡Mola! ¡Un nuevo gatito en Adalab!';
      } else if (valueDesc === '' || valuePhoto === '' || valueName === '') {
        labelMessageError.innerHTML = '¡Uy! parece que has olvidado algo';
      }
    });
}

//Cancelar la búsqueda de un gatito
function cancelNewKitten(event) {
  event.preventDefault();
  newFormElement.classList.add('collapsed');
  inputDesc.value = '';
  inputPhoto.value = '';
  inputName.value = '';
  inputRace.value = '';
}

//Filtrar por descripción
function filterKitten(event) {
  event.preventDefault();
  const searchDescription = kittenDataList
    .filter((data) => data.desc.includes(input_search_desc.value))
    .filter((data2) =>
      data2.race.toLowerCase().includes(input_search_race.value)
    );
  renderKittenList(searchDescription);
}

//Mostrar el litado de gatitos en el HTML


//Eventos
linkNewFormElememt.addEventListener('click', handleClickNewCatForm);
searchButton.addEventListener('click', filterKitten);
buttonAdd.addEventListener('click', addNewKitten);
buttonCancelForm.addEventListener('click', cancelNewKitten);
