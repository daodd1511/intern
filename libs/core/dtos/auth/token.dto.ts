/** JWT token DTO. */
export interface TokenDto {

  /** Refresh token.*/
  readonly refresh: string;

  /** Access token. */
  readonly access: string;
}
