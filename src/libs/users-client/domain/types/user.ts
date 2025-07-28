import { Role } from '@/libs/users-client/domain/enums/role.enum';

/**
 * The type for the user.
 * @typedef {Object} User
 * @property {string} id - The id of the user.
 * @property {string} email - The email of the user.
 * @property {string} firstName - The first name of the user.
 * @property {string} lastName - The last name of the user.
 * @property {string} phone - The phone of the user.
 * @property {string} avatar - The avatar of the user.
 * @property {Role} role - The role of the user.
 * @property {boolean} isActive - The active status of the user.
 * @property {Date} createdAt - The created at date of the user.
 * @property {Date} updatedAt - The updated at date of the user.
 */
export type User = {
  /**
   * The id of the user.
   */
  id: string;

  /**
   * The email of the user.
   */
  email: string;

  /**
   * The first name of the user.
   */
  firstName: string;

  /**
   * The last name of the user.
   */
  lastName: string;

  /**
   * The phone of the user.
   */
  phone: string;

  /**
   * The avatar of the user.
   */
  avatar?: string;

  /**
   * The role of the user.
   */
  role?: Role;

  /**
   * The birth date of the user.
   */
  birthDate?: Date;

  /**
   * The gender of the user.
   */
  gender?: string;

  /**
   * The address of the user.
   */
  address?: string;

  /**
   * The city of the user.
   */
  city?: string;

  /**
   * The state of the user.
   */
  state?: string;

  /**
   * The zip code of the user.
   */
  zipCode?: string;
  /**
   * The country of the user.
   */
  country?: string;

  /**
   * The active status of the user.
   */
  isActive: boolean;

  /**
   * The created at date of the user.
   */
  createdAt: Date;

  /**
   * The updated at date of the user.
   */
  updatedAt: Date;

  /**
   * The deleted at date of the user.
   */
  deletedAt?: Date;
};
