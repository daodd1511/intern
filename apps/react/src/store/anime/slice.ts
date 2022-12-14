import { createSlice } from '@reduxjs/toolkit';

import { addAnime, deleteAnime, fetchAnimePage, fetchNextAnimePage, updateAnime } from './dispatchers';
import { initialState, animeAdapter, State } from './state';

export const animeSlice = createSlice({
  name: 'anime',
  initialState,
  reducers: {
    clearAnimeList(state) {
      animeAdapter.removeAll(state as State);
    },
  },
  extraReducers: builder => builder
    .addCase(fetchAnimePage.pending, state => {
      state.isLoading = true;
    })
    .addCase(fetchAnimePage.fulfilled, (state, action) => {
      animeAdapter.setAll(state as State, action.payload.results);
      state.isLoading = false;
    })
    .addCase(fetchAnimePage.rejected, (state, action) => {
      if (action.error.message) {
        state.error = action.error.message;
      }
      state.isLoading = false;
    })
    .addCase(fetchNextAnimePage.pending, state => {
      state.isLoading = true;
    })
    .addCase(fetchNextAnimePage.fulfilled, (state, action) => {
      if (action.payload !== null) {
        animeAdapter.addMany(state as State, action.payload.results);
      }
      state.isLoading = false;
    })
    .addCase(fetchNextAnimePage.rejected, (state, action) => {
      if (action.error.message) {
        state.error = action.error.message;
      }
      state.isLoading = false;
    })
    .addCase(deleteAnime.pending, state => {
      state.isDeleting = true;
    })
    .addCase(deleteAnime.fulfilled, (state, action) => {
      animeAdapter.removeOne(state as State, action.payload);
      state.isDeleting = false;
    })
    .addCase(deleteAnime.rejected, (state, action) => {
      if (action.error.message) {
        state.error = action.error.message;
      }
      state.isDeleting = false;
    })
    .addCase(updateAnime.pending, state => {
      state.isLoading = true;
    })
    .addCase(updateAnime.fulfilled, (state, action) => {
      animeAdapter.setOne(state as State, action.payload);
      state.isLoading = false;
    })
    .addCase(updateAnime.rejected, (state, action) => {
      if (action.error.message) {
        state.error = action.error.message;
      }
      state.isLoading = false;
    })
    .addCase(addAnime.pending, state => {
      state.isSubmitting = true;
    })
    .addCase(addAnime.fulfilled, (state, action) => {
      animeAdapter.addOne(state as State, action.payload);
      state.isSubmitting = false;
    })
    .addCase(addAnime.rejected, (state, action) => {
      if (action.error.message) {
        state.error = action.error.message;
      }
      state.isSubmitting = false;
    }),
});

export const { clearAnimeList } = animeSlice.actions;
