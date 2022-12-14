import { Immerable, OmitImmerable } from './immerable';

interface ErrorData {
  readonly [key: string]: string[];
}

/** HttpError. */
export class HttpError extends Immerable {

  /** Error detail. */
  public readonly detail: string;

  /** Error code. */
  public readonly code?: string;

  /** Error data. */
  public readonly data?: ErrorData;

  public constructor(error: ErrorInitArgs) {
    super();
    this.detail = error.detail;
    this.data = error.data;
    this.code = error.code;
  }
}

type ErrorInitArgs = OmitImmerable<HttpError>;
