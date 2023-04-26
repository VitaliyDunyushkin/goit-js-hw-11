// const axios = require('axios');
import axios from 'axios';
import { Notify } from 'notiflix/build/notiflix-notify-aio';

const refs = {
  searchForm: document.getElementById('search-form'),
  gallery: document.querySelector('.gallery'),
  loadBtn: document.getElementById('load-btn'),
};

refs.searchForm.addEventListener('submit', onFormSubmit);
refs.loadBtn.addEventListener('click', onLoadBtnClick);

const per_page = 40;
let page = 1;
let searchText = '';

function onFormSubmit(event) {
  event.preventDefault();

  searchText = event.target.elements.searchQuery.value.trim();
  if (searchText === '') {
    refs.searchForm.reset();
    return Notify.warning('Please, write your request!!!');
  }
  console.log(searchText);

  refs.gallery.innerHTML = '';
  page = 1;
  getGallery(searchText);
}

function onLoadBtnClick() {
  getGallery(searchText);
}

/////--------------

async function getGallery(searchText) {
  try {
    const response = await axios.get('https://pixabay.com/api/', {
      params: {
        key: '35598116-086839572ecc040a3411fcb61',
        q: searchText,
        image_type: 'photo',
        orientation: 'horisontal',
        orientation: true,
        page: page,
        per_page: per_page,
      },
    });
    if (response.data.total === 0) {
      throw new Error(
        Notify.failure(
          'Sorry, there are no images matching your search query. Please try again.'
        )
      );
    }

    console.dir(response);
    const array = response.data.hits;

    console.log('data = ', array);
    // console.log('webformatUR = ', array[1].webformatURL);
    // console.log('tags = ', array[1].tags);
    // console.log('likes = ', array[1].likes);
    // console.log('views = ', array[1].views);
    // console.log('comments = ', array[1].comments);
    // console.log('downloads = ', array[1].downloads);

    const markup = array.reduce(
      (markup, { webformatURL, tags, likes, views, comments, downloads }) => {
        return (
          markup +
          createMarkup(webformatURL, tags, likes, views, comments, downloads)
        );
      },
      ''
    );

    // console.log('markup = ', markup);

    refs.gallery.insertAdjacentHTML('beforeend', markup);

    // console.log(Math.ceil(response.data.totalHits / per_page));
    if (Math.ceil(response.data.totalHits / per_page) === page) {
      Notify.failure(
        'We are sorry, but you have reached the end of search results.'
      );
      refs.loadBtn.classList.add('hidden');
      return;
    }

    page += 1;
    refs.loadBtn.classList.remove('hidden');
  } catch (error) {
    console.error(error);
  }
}

function createMarkup(webformatURL, tags, likes, views, comments, downloads) {
  return `<div class="photo-card">
      <img src="${webformatURL}" alt="${tags}" width=300 height=200 loading="lazy" />
      <div class="info">
        <p class="info-item">
          <b>likes:<br>${likes}</b>
        </p>
        <p class="info-item">
          <b>views:<br>${views}</b>
        </p>
        <p class="info-item">
          <b>comments:<br>${comments}</b>
        </p>
        <p class="info-item">
          <b>downloads:<br>${downloads}</b>
        </p>
      </div>
    </div>`;
}
