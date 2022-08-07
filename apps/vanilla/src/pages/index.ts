import { PaginationConfig } from '@js-camp/core/interfaces/pagination';

import { AnimeService } from '../services/animeService';
import { LIMIT, FIRST_PAGE, DEFAULT_SORT, DEFAULT_SEARCH } from '../scripts/variables';
import { Navbar } from '../namespaces/navbar';
import { AuthService } from '../services/authService';

import { getAnime } from '../scripts/anime';

import { renderTable } from '../scripts/animeTable';
import { renderSortOptions } from '../scripts/sort';
import { renderFilterOptions } from '../scripts/filter';
import { initSearch } from '../scripts/search';

import { Navbar } from '../namespaces/navbar';
import { PaginationLocalStorage } from '../scripts/constants';
import { StorageService } from '../services/storageService';

window.addEventListener('load', async(): Promise<void> => {
  await Navbar.render();
  initHomepage();
  await AuthService.navigateToLoginIfNotAuthenticated();
  Navbar.renderNavbar();
});
const initHomepage = async(): Promise<void> => {
  resetTableState();
  const paginationConfig: PaginationConfig = {
    limit: LIMIT,
    page: FIRST_PAGE,
    ordering: '',
    type: '',
    search: '',
  };
  const anime = await AnimeService.getAnime(paginationConfig);
  renderTable(anime);
  renderSortOptions();
  renderFilterOptions();
  initSearch();
};

/** Reset the table state. */
export function resetTableState(): void {
  StorageService.set(PaginationLocalStorage.active, FIRST_PAGE);
  StorageService.set(PaginationLocalStorage.sort, DEFAULT_SORT);
  StorageService.set(PaginationLocalStorage.search, DEFAULT_SEARCH);
}
