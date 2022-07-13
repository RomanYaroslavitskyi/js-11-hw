import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { getRefs } from './js/refs';
import { renderCardsMarkup } from './js/render-markup';
import { fetchImages } from './js/fetch-img';
import { noMorePages } from './js/service';

const { formEl, galleryEl, btnEl, textEl } = getRefs();

let page = null;
let nameImg = '';
const parePage = 40;

const Lightbox = new SimpleLightbox('.gallery a', {
  captionSelector: 'img',
  captionsData: 'alt',
  captionPosition: 'bottom',
  captionDelay: 250,
  animationSpeed: 250,
  preloading: false,
  docClose: false,
  widthRatio: 1,
  doubleTapZoom: 1.5,
});

btnEl.classList.add('hidden');

formEl.addEventListener('submit', getUserValue);
btnEl.addEventListener('click', onClickMoreImg);

async function getUserValue(e) {
  e.preventDefault();
  galleryEl.innerHTML = '';
  nameImg = e.target.elements.searchQuery.value.trim();
  if (!nameImg) return;
  page = 1;

  try {
    const userValue = await fetchImages(nameImg);
    const userData = userValue.data;
    if (!userData.total) {
      return Notify.failure(
        'Sorry, there are no images matching your search query. Please try again.'
      );
    }

    textEl.innerHTML = '';

    Notify.success(`Hooray! We found ${userData.totalHits} images.`);
    renderCardsMarkup(userData.hits);

    btnEl.classList.remove('hidden');
    noMorePages(userData);

    Lightbox.refresh();
  } catch (error) {
    console.log(error.message);
  }
}

async function onClickMoreImg() {
  try {
    if (page !== null) {
      page += 1;
      const userValue = await fetchImages(nameImg);
      const userData = userValue.data;
      renderCardsMarkup(userData.hits);
      noMorePages(userData);
      Lightbox.refresh();
    }
  } catch (error) {
    console.log(error.message);
  }
}

export { parePage, page, nameImg };
