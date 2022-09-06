import { fetchAnimeDetail } from '@js-camp/react/store/animeDetail/dispatchers';
import { selectAnimeDetail, selectIsAnimeDetailLoading } from '@js-camp/react/store/animeDetail/selectors';
import { useAppDispatch, useAppSelector } from '@js-camp/react/store/store';
import { Box, CircularProgress, Typography } from '@mui/material';
import { FC, memo, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

import styles from './AnimeDetail.module.css';

const AnimeDetailComponent: FC = () => {
  const [searchParams] = useSearchParams();
  const animeId = Number(searchParams.get('id'));
  const dispatch = useAppDispatch();
  const animeDetail = useAppSelector(state => selectAnimeDetail(state, animeId));
  const isAnimeDetailLoading = useAppSelector(selectIsAnimeDetailLoading);
  useEffect(() => {
    if (animeId) {
      dispatch(fetchAnimeDetail(animeId));
    }
  }, [searchParams.get('id'), dispatch]);

  if (isAnimeDetailLoading) {
    return (
      <Box className={styles['loader']}>
        <CircularProgress color="secondary"/>
      </Box>
    );
  }

  if (animeDetail === undefined) {
    return (
      <Box className={styles['anime-detail']}>
        <Typography variant="h4">Select anime on the left for more details!</Typography>
      </Box>
    );
  }

  return (
    <Box className={styles['anime-detail']}>
      {JSON.stringify(animeDetail, null, 2)}
    </Box>
  );
};

export const AnimeDetail = memo(AnimeDetailComponent);
