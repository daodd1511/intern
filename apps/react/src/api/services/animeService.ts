import { PaginationDto } from '@js-camp/core/dtos/pagination.dto';

import { Anime } from '@js-camp/core/models/anime';

import { AnimeDto } from '@js-camp/core/dtos/anime/anime.dto';
import { AnimeMapper } from '@js-camp/core/mappers/anime/anime.mapper';
import { PaginationMapper } from '@js-camp/core/mappers/pagination.mapper';
import { AnimeQueryParamsMapper } from '@js-camp/core/mappers/anime-query-params.mapper';
import { AnimeListQueryParams } from '@js-camp/core/models/anime-query-params';

import { Pagination } from '@js-camp/core/models/pagination';

import {
  AnimeDetail,
  AnimeDetailPost,
} from '@js-camp/core/models/anime/animeDetail';
import { AnimeDetailDto } from '@js-camp/core/dtos/anime/animeDetail.dto';
import { AnimeDetailMapper } from '@js-camp/core/mappers/anime/animeDetail.mapper';

import { http } from '..';

export namespace AnimeService {
  const URL = 'anime/anime/';
  let nextUrl: string | null = null;

  /**
   * Fetches a page of anime with specify params.
   * @param queryParams Anime query parameters for the request.
   */
  export async function fetchAnimePage(
    queryParams: AnimeListQueryParams,
  ): Promise<Pagination<Anime>> {
    const { data: animeResponse } = await http.get<PaginationDto<AnimeDto>>(
      URL,
      {
        params: AnimeQueryParamsMapper.toDto(queryParams),
      },
    );
    const animePage = PaginationMapper.fromDto(animeResponse, animeDto =>
      AnimeMapper.fromDto(animeDto));
    setNextUrl(animePage.next);
    return animePage;
  }

  /** Fetch next page of anime list. */
  export async function fetchNextAnimePage(): Promise<Pagination<Anime> | null> {
    if (nextUrl === null) {
      return null;
    }

    const animeResponse = await http.get<PaginationDto<AnimeDto>>(nextUrl);
    const animePage = PaginationMapper.fromDto(animeResponse.data, animeDto =>
      AnimeMapper.fromDto(animeDto));
    setNextUrl(animePage.next);
    return animePage;
  }

  /**
   * Set the next url for the next page.
   * @param url The next url.
   */
  function setNextUrl(url: string | null) {
    nextUrl = url;
  }

  /**
   * Fetch anime by id.
   * @param id Anime id.
   */
  export async function fetchAnimeById(
    id: AnimeDetail['id'],
  ): Promise<AnimeDetail> {
    const { data: animeDetailResponse } = await http.get<AnimeDetailDto>(
      `${URL}${id}/`,
    );
    return AnimeDetailMapper.fromDto(animeDetailResponse);
  }

  /**
   * Delete anime.
   * @param id Anime id.
   */
  export async function deleteAnime(id: AnimeDetail['id']): Promise<void> {
    const deleteUrl = `${URL}${id}/`;
    await http.delete<AnimeDetailDto>(deleteUrl);
  }

  /**
   * Update anime.
   * @param animeId Id of the anime.
   * @param animeData Anime data.
   */
  export async function updateAnime(
    animeId: Anime['id'],
    animeData: AnimeDetailPost,
  ): Promise<AnimeDetail> {
    const updatePath = `anime/anime/${animeId}/`;

    const { data: animeUpdateResponse } = await http.put<AnimeDetailDto>(
      updatePath,
      AnimeDetailMapper.toDto(animeData),
    );
    return AnimeDetailMapper.fromDto(animeUpdateResponse);
  }

  /**
   * Add new anime.
   * @param animeData Anime data.
   */
  export async function addAnime(
    animeData: AnimeDetailPost,
  ): Promise<AnimeDetail> {
    const addPath = `anime/anime/`;
    const { data: animeAddResponse } = await http.post<AnimeDetailDto>(
      addPath,
      AnimeDetailMapper.toDto(animeData),
    );
    return AnimeDetailMapper.fromDto(animeAddResponse);
  }
}
