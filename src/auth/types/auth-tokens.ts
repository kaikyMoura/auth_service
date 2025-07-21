/**
 * The type for the auth tokens.
 * @typedef {Object} AuthTokens
 * @property {string} accessToken - The access token for the user.
 * @property {string} refreshToken - The refresh token for the user.
 * @property {number} expiresIn - The expiration time of the access token in seconds.
 */
export type AuthTokens = {
  /**
   * The access token for the user.
   */
  accessToken: string;
  /**
   * The refresh token for the user.
   */
  refreshToken: string;
  /**
   * The expiration time of the access token in seconds.
   */
  expiresIn: number;
};