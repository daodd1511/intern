import { assertNonNull } from '@js-camp/core/utils/assertNonNull';
import { PaginationConfig } from '@js-camp/core/interfaces/pagination';

import { AnimeService } from '../services/animeService';

import { StorageService } from '../services/storageService';

import { LIMIT, FIRST_PAGE, NUMBER_OF_PAGES } from './variables';
import { PaginationLocalStorage } from './constants';
import { renderTable } from './animeTable';

/** Half number of pages to display. */
const HALF_NUMBER_OF_PAGES = Math.floor(NUMBER_OF_PAGES / 2);

/**
 * Render pagination.
 * @param displayPages Pages number  to display.
 */
export async function renderPagination(displayPages: number): Promise<void> {
  const activePage = await StorageService.get<number>(PaginationLocalStorage.active);
  assertNonNull(activePage);
  const currentPage = activePage + 1;
  const wrapper = document.querySelector<HTMLDivElement>('.pagination');
  assertNonNull(wrapper);
  wrapper.innerHTML = ``;
  let firstDisplayPage = (currentPage - HALF_NUMBER_OF_PAGES);
  let lastDisplayPage = (currentPage + HALF_NUMBER_OF_PAGES);

  if (firstDisplayPage < FIRST_PAGE) {
    firstDisplayPage = FIRST_PAGE;
    lastDisplayPage = NUMBER_OF_PAGES;
  }

  if (lastDisplayPage > displayPages) {
    firstDisplayPage = displayPages - (NUMBER_OF_PAGES - FIRST_PAGE);
    if (firstDisplayPage < FIRST_PAGE) {
      firstDisplayPage = FIRST_PAGE;
    }
    lastDisplayPage = displayPages;
  }

  for (let page = firstDisplayPage; page <= lastDisplayPage; page++) {
    wrapper.innerHTML += `
    <li>
      <button index=${page}  class="btn waves-effect pagination__button ${page + 1 === currentPage ? 'pagination__button-active' : ''}">
        ${page + 1}
      </button>
    </li>`;
  }
  wrapper.innerHTML = `
  <li>
    <button index=${FIRST_PAGE}  class="btn waves-effect pagination__button">
      First
    </button>
  </li>${wrapper.innerHTML}`;

  wrapper.innerHTML += `
  <li>
    <button index=${displayPages}  class="btn waves-effect pagination__button">
      Last
    </button>
  </li>`;
  const paginateButton = document.querySelectorAll('.pagination__button');
  paginateButton.forEach(element => {
    element.addEventListener('click', async() => {
      const currentIndex = element.getAttribute('index');
      assertNonNull(currentIndex);
      StorageService.set(PaginationLocalStorage.active, parseInt(currentIndex, 10));
      const sortSetting = await StorageService.get<string>(PaginationLocalStorage.sort);
      const searchQuery = await StorageService.get<string>(PaginationLocalStorage.search);
      const filterType = await StorageService.get<string>(PaginationLocalStorage.type);
      assertNonNull(filterType);
      assertNonNull(sortSetting);
      assertNonNull(searchQuery);

      const paginationConfig: PaginationConfig = {
        limit: LIMIT,
        page: parseInt(currentIndex, 10),
        ordering: sortSetting,
        type: filterType,
        search: searchQuery,
      };
      const animeList = await AnimeService.getAnime(paginationConfig);
      renderTable(animeList);
    });
  });
}
