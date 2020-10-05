/**
 * @enum
 * @name UserRole
 * @description Hardcoded list of Users Roles. Role inferences the permissions of the respective user
 */
export enum UserRole {
    /**
     * Can manage (create, update, delete) users
     */
    Admin = 'Admin',

    /**
     * Can approve, decline, cancel payments
     */
    BackOffice = 'BackOffice',

    /**
     * - Can create Accounts
     * - Can create Payments
     * - Can cancel Payments (which hadn't been approved or declined)
     */
    Client = 'Client',
}
