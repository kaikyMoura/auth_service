import { Role } from '../enums/role.enum';

/**
 * The type for the register user response
 * @typedef {Object} RegisterUserResponse
 * @property {Object} user - The user
 * @property {string} user.id - The id of the user
 * @property {string} user.email - The email of the user
 * @property {string} user.firstName - The first name of the user
 * @property {string} user.lastName - The last name of the user
 * @property {string} user.phone - The phone of the user
 * @property {string} user.avatar - The avatar of the user
 * @example
 * ```typescript
 * {
 *   user: {
 *     id: '123',
 *     email: 'test@test.com',
 *     firstName: 'John',
 *     lastName: 'Doe',
 *     phone: '1234567890',
 *     avatar: 'https://example.com/avatar.png',
 *   },
 * }
 * ```
 */
export type RegisterUserResponse = {
  /**
   * The user
   */
  user: {
    /**
     * The id of the user
     */
    id: string;
    /**
     * The email of the user
     */
    email: string;
    /**
     * The first name of the user
     */
    firstName: string;
    /**
     * The last name of the user
     */
    lastName: string;
    /**
     * The phone of the user
     */
    phone: string;
    /**
     * The role of the user
     */
    role: Role;
    /**
     * The avatar of the user
     */
    avatar?: string;
  };
};
