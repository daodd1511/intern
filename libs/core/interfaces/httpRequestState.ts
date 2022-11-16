import { HttpError } from '../models/httpError';

/** Http state for request. */
export interface HttpRequestState<T> {

  /** Loading state. */
  readonly isLoading: boolean;

  /** Error state. */
  readonly error?: HttpError;

  /** Data state. */
  readonly data?: T;
}
