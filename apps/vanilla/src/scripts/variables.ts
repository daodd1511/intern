import { Option } from './interfaces';

/** Initial page or first page. */
export const FIRST_PAGE = 0;

/** Default sort value. */
export const DEFAULT_SORT = '';

/** Default search value. */
export const DEFAULT_SEARCH = '';

/** Default search value. */
export const DEFAULT_TYPE = '';

/** Number of pages to display. */
export const NUMBER_OF_PAGES = 9;

/** Number of items per request. */
export const LIMIT = 10;

/** Available options for sorting. */
export enum Ordering {
  EnglishTitle = 'title_eng',
  Status = 'status',
  AiredStart = 'aired__startswith',
}

/** Available value for sorting options. */
export const SORT_OPTIONS: readonly Option[] =
  [
    { text: 'Default', value: '' },
    { text: 'English Title', value: Ordering.EnglishTitle },
    { text: 'Aired Start', value: Ordering.AiredStart },
    { text: 'Status', value: Ordering.Status },
  ];

/** Available direction for sorting options. */
export const SORT_DIRECTIONS: readonly Option[] =
  [
    { text: 'Ascending', value: '' },
    { text: 'Descending', value: '-' },
  ];

/** Available type for filtering. */
export const FILTERING_TYPES: readonly Option[] =
[
  { text: 'None', value: '' },
  { text: 'Tv', value: 'TV' },
  { text: 'Ova', value: 'OVA' },
  { text: 'Movie', value: 'MOVIE' },
  { text: 'Special', value: 'SPECIAL' },
  { text: 'Ona', value: 'ONA' },
  { text: 'Music', value: 'MUSIC' },
];
