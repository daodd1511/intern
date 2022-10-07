import { AnimeDto } from '@js-camp/core/dtos/anime/anime.dto';
import { AnimeDetailDto } from '@js-camp/core/dtos/anime/animeDetail.dto';
import { PaginationDto } from '@js-camp/core/dtos/pagination.dto';
import { PaginationConfig } from '@js-camp/core/interfaces/pagination';
import { AnimeMapper } from '@js-camp/core/mappers/anime/anime.mapper';
import { AnimeDetailMapper } from '@js-camp/core/mappers/anime/animeDetail.mapper';
import { PaginationMapper } from '@js-camp/core/mappers/pagination.mapper';
import { Anime } from '@js-camp/core/models/anime/anime';
import { AnimeDetail } from '@js-camp/core/models/anime/animeDetail';
import { Pagination } from '@js-camp/core/models/pagination';
import { assertNonNull } from '@js-camp/core/utils/assertNonNull';

import { api } from '../api/api';
import { convertDate } from '../utils/convertDate';

export namespace AnimeService {

  /**
   * Get anime data from the server.
   * @param PaginationConfig Option for request parameters.
   */
  export async function getAnime({ limit, page, ordering, type, search }: PaginationConfig): Promise<Pagination<Anime>> {
    const params = PaginationMapper.toDto({ limit, page, ordering, type, search });
    const animeResponse = await api.get<PaginationDto<AnimeDto>>(
      `anime/anime/`, { params },
    );
    return PaginationMapper.fromDto(animeResponse.data, animeDto => AnimeMapper.fromDto(animeDto));
  }

  /**
   * Get anime detail from the server.
   * @param id ID of the anime.
   */
  export async function getAnimeDetail(id: string): Promise<AnimeDetail> {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    const animeDetailResponse = await api.get<AnimeDetailDto>(`anime/anime/${id}/`);
    return AnimeDetailMapper.fromDto(animeDetailResponse.data);
  }

  /**
   * Render image.
   * @param url Url of the image.
   */
  export function renderImage(url: string): void {
    const mediaElement = document.querySelector('.anime-detail__media');
    assertNonNull(mediaElement);
    mediaElement.innerHTML += `<img src="${url}" class="anime-detail__image" alt="Anime Image"></img>`;
  }

  /** Render trailer. */
  export function renderTrailerButton(): void {
    const mediaElement = document.querySelector('.anime-detail__media');
    assertNonNull(mediaElement);
    mediaElement.innerHTML += `<button type="button" class="waves-effect waves-light btn trailer-btn">Watch Trailer!</button>
  `;
  }

  /**
   * Render content.
   * @param data Anime data.
   */
  export function renderContent(data: AnimeDetail): void {
    const contentElement = document.querySelector<HTMLDivElement>('.anime-detail__content');
    assertNonNull(contentElement);
    contentElement.innerHTML = `
    <p>English Title: ${data.englishTitle}</p>
    <p>Japanese Title: ${data.japaneseTitle}</p>
    <p>Type: ${data.type}</p>
    <p>Status: ${data.status}</p>
    <p>Synopsis: ${data.synopsis}</p>
    <p>Airing: ${data.airing}</p>
    <p>Aired Start: ${convertDate(data.aired.start)}</p>
    <p>Aired End: ${convertDate(data.aired.end)}</p>
    <p>Studio List: ${data.studioList.map(studio => studio.name)}</p>
    <p>Genre List: ${data.genreList.map(genre => genre.name)}</p>`;
  }

  /**
   * Open trailer.
   * @param youtubeId Youtube trailer Id.
   */
  export function openTrailer(youtubeId: string): void {
    const modalWrapper = document.querySelector<HTMLDivElement>('.modal-wrapper');
    const modalWrapperOverlay = document.querySelector<HTMLDivElement>('.modal-wrapper__overlay');
    const modalWrapperInner = document.querySelector<HTMLDivElement>('.modal-wrapper__inner');
    assertNonNull(modalWrapper);
    assertNonNull(modalWrapperOverlay);
    assertNonNull(modalWrapperInner);
    modalWrapper.classList.remove('hidden');
    modalWrapperInner.innerHTML = `
    <iframe
      src="https://www.youtube-nocookie.com/embed/${youtubeId}"
      title="Trailer"
      frameborder="0"
      allowfullscreen
      class="video">
    </iframe>`;
    const video = document.querySelector<HTMLIFrameElement>('.video');
    assertNonNull(video);
    modalWrapperOverlay.addEventListener('click', () => {
    video.setAttribute('src', '');
    modalWrapper.classList.add('hidden');
  });
  }

  /**
   * Open full size image.
   * @param imageURL Image URL to open.
   */
  export function openFullSizeImage(imageURL: string): void {
    const modalWrapper = document.querySelector<HTMLDivElement>('.modal-wrapper');
    const modalWrapperOverlay = document.querySelector<HTMLDivElement>('.modal-wrapper__overlay');
    assertNonNull(modalWrapper);
    assertNonNull(modalWrapperOverlay);
    modalWrapper.classList.remove('hidden');
    const modalWrapperInner = document.querySelector<HTMLDivElement>('.modal-wrapper__inner');
    assertNonNull(modalWrapperInner);
    modalWrapperInner.innerHTML = `<img src="${imageURL}" alt="Anime Image" class="image"></img>`;
    modalWrapperOverlay.addEventListener('click', () => {
    modalWrapper.classList.add('hidden');
  });
  }

  /**
   * Handle media click .
   * @param imageURL Image URL.
   * @param trailerURL Trailer URL.
   */
  export function handleMediaClick(imageURL: string, trailerURL: string | null): void {
    const imageElement = document.querySelector<HTMLImageElement>('.anime-detail__image');
    assertNonNull(imageElement);
    imageElement.addEventListener('click', () => openFullSizeImage(imageURL));
    if (trailerURL) {
      const trailerButton = document.querySelector('.trailer-btn');
      assertNonNull(trailerButton);
      trailerButton.addEventListener('click', () => openTrailer(trailerURL));
    }
  }
}
