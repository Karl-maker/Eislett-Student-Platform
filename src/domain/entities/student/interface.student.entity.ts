import Entity from "../base/interface.entity";

export default interface Student extends Entity {
    firstName: string;
    lastName: string;
    email: string;
    hashPassword: string;
    deactivated: boolean;
    password?: string;
    confirmed: boolean;
    confirmation?: {
        code: string;
        expiresAt: Date;
    };
    recovery?: {
        code: string;
        expiresAt: Date;
    };
    displayName?: string;
    profileImage?: {
        url?: string;
        key?: string;
    };

    checkPassword: (password: string) => boolean;
}