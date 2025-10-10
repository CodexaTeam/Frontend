/**
 * @interface UserDto
 * @description Represents the data transfer object for a user.
 */
export interface UserDto {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: 'arrendador' | 'arrendatario';
}
