/**
 * @class User
 * @description Represents the domain model for a user.
 */
export class User {
  constructor(
    public id: number,
    public name: string,
    public email: string,
    public role: 'arrendador' | 'arrendatario'
  ) {}
}
