import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  Inject,
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Sort } from '@angular/material/sort';
import { ActivatedRoute, Params, Router } from '@angular/router';
import {
  Anime,
  AnimeSort,
  AnimeSortDirection,
  AnimeSortField,
  AnimeType,
} from '@js-camp/core/models/anime/anime';

import { UntilDestroy, untilDestroyed } from '@ngneat/until-destroy';

import {
  BehaviorSubject,
  combineLatestWith,
  debounceTime,
  map,
  merge,
  Observable,
  startWith,
  switchMap,
  tap,
  take,
  catchError,
  of,
} from 'rxjs';

import { AnimeListQueryParams } from '@js-camp/core/models/anime-query-params';

import { HttpRequestState } from '@js-camp/core/interfaces/httpRequestState';
import { Pagination } from '@js-camp/core/models/pagination';

import { AnimeService, ErrorService } from '../../../../core/services';

const PARAMS_CHANGE_DEBOUNCE_TIME = 700;
const INITIAL_LOADING = false;
const defaultParams = {
  length: 0,
  page: 0,
  limit: 25,
  search: '',
  sort: {
    field: AnimeSortField.None,
    direction: AnimeSortDirection.Ascending,
  },
};

/** Anime table component. */
@UntilDestroy()
@Component({
  selector: 'camp-table',
  templateUrl: './table.component.html',
  styleUrls: ['./table.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit {
  /** Anime list observer. */
  public readonly animeList$: Observable<HttpRequestState<Pagination<Anime>>>;

  /** Anime list observer. */
  public readonly params$: Observable<AnimeListQueryParams>;

  /** Initial page size value. */
  public readonly pageSize = defaultParams.limit;

  /** Anime type value. */
  public readonly animeTypeList: readonly AnimeType[] = [
    AnimeType.Tv,
    AnimeType.Movie,
    AnimeType.Music,
    AnimeType.Ona,
    AnimeType.Ova,
    AnimeType.Special,
  ];

  /** Anime search from control. */
  public readonly searchControl = new FormControl(defaultParams.search);

  /** Type filter form control. */
  public readonly filterTypeControl = new FormControl();

  /** Current page subject. */
  protected readonly currentPage$ = new BehaviorSubject<number>(
    defaultParams.page,
  );

  /** Sort subject. */
  protected readonly sort$ = new BehaviorSubject<AnimeSort>(defaultParams.sort);

  /** Loading subject. */
  private readonly _isLoading$ = new BehaviorSubject<boolean>(INITIAL_LOADING);

  /** Loading observer. */
  public readonly isLoading$ = this._isLoading$.asObservable();

  /** Anime table column. */
  public displayedColumns = [
    'image',
    'titleEng',
    'titleJpn',
    'airedStart',
    'type',
    'status',
  ] as const;

  private window: Window | null;

  public constructor(
    private readonly animeService: AnimeService,
    private readonly route: ActivatedRoute,
    private readonly router: Router,
    private readonly errorService: ErrorService,
    @Inject(DOCUMENT) private document: Document,
  ) {
    this.window = this.document.defaultView;
    this.params$ = this.currentPage$.pipe(
      combineLatestWith(
        this.searchControl.valueChanges.pipe(
          startWith(this.searchControl.value),
        ),
        this.filterTypeControl.valueChanges.pipe(
          startWith(this.filterTypeControl.value),
        ),
        this.sort$,
      ),
      debounceTime(PARAMS_CHANGE_DEBOUNCE_TIME),
      map(([currentPage, _search, _filter, sort]) => {
        const params = {
          limit: defaultParams.limit,
          page: currentPage,
          sort,
          search: this.searchControl.value ?? '',
          type: this.filterTypeControl.value ?
            this.filterTypeControl.value :
            [],
        };
        return params;
      }),
    );
    this.animeList$ = this.params$.pipe(
      switchMap(params =>
        this.animeService.fetchAnime(params).pipe(
          map(data => ({ isLoading: false, data })),
          catchError((error: unknown) => of({
            isLoading: false,
            error: this.errorService.getError(error),
          })),
          startWith({ isLoading: true }),
        )),
    );
  }

  /** @inheritdoc */
  public ngOnInit(): void {
    const setDataFromParamsSideEffect$ = this.route.queryParams.pipe(
      tap(params => {
        this.setDataFromParamsToComponent(params);
      }),
      take(1),
    );

    const resetPaginationSideEffect$ = merge(
      this.searchControl.valueChanges,
      this.filterTypeControl.valueChanges,
    ).pipe(tap(() => this.currentPage$.next(defaultParams.page)));

    const goToTopOfPageSideEffect$ = this.currentPage$.pipe(
      tap(() => this.goToTopOfPage()),
    );

    const navigateSideEffect$ = this.params$.pipe(
      tap(({ limit, page, sort, search, type }) => {
        const queryParamsForUrl = {
          limit,
          page,
          field: sort.field,
          direction: sort.direction,
          search,
          type: type.toString(),
        };
        this.router.navigate([], {
          queryParams: queryParamsForUrl,
          queryParamsHandling: 'merge',
        });
      }),
    );

    // Merge all side effects and subscribe.
    merge(
      resetPaginationSideEffect$,
      goToTopOfPageSideEffect$,
      setDataFromParamsSideEffect$,
      navigateSideEffect$,
    )
      .pipe(untilDestroyed(this))
      .subscribe();
  }

  /**
   * Handle changes in paginator.
   * @param event Paginator event emission.
   */
  public onPaginatorChange(event: PageEvent): void {
    this.currentPage$.next(event.pageIndex);
  }

  /**
   * Handle changes in sort.
   * @param event Sort event emission.
   */
  public onSortChange(event: Sort): void {
    const newSortValue = {
      direction: event.direction as AnimeSortDirection,
      field: event.direction ?
        (event.active as AnimeSortField) :
        AnimeSortField.None,
    };
    this.sort$.next(newSortValue);
  }

  /**
   * Table tracking function.
   * @param _index Index of the anime.
   * @param anime Anime data.
   */
  public trackAnimeById(_index: number, anime: Anime): number {
    return anime.id;
  }

  /**
   * Sync data from params to components.
   * @param params Params value from URL.
   */
  private setDataFromParamsToComponent(params: Params): void {
    if (params['type']) {
      this.filterTypeControl.setValue(params['type'].split(','));
    }
    if (params['search']) {
      this.searchControl.setValue(params['search']);
    }
    this.sort$.next({
      field: params['field'] ?? defaultParams.sort.field,
      direction: params['direction'] ?? defaultParams.sort.direction,
    });
    this.currentPage$.next(params['page'] || defaultParams.page);
  }

  /** Scroll to top of page. */
  private goToTopOfPage(): void {
    if (this.window) {
      this.window.scrollTo({
        top: 0,
        behavior: 'smooth',
      });
    }
  }

  /**
   * Open detail page when click on table row.
   * @param anime Anime data.
   */
  public openDetailPage(anime: Anime): void {
    this.router.navigate([`/anime/detail/${anime.id}`]);
  }
}
