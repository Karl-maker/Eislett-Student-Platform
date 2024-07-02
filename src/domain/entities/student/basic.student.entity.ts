import Student from "./interface.student.entity";
import bcrypt from 'bcrypt';

export default class BasicStudent implements Student {
    firstName: string;
    lastName: string;
    email: string;
    hashPassword: string = "";
    id?: string | number | undefined;
    deactivated: boolean;
    createdAt: Date;
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
    coins: number;
    profileImage?: {
        url?: string;
        key?: string;
    };

    constructor(params: {
        firstName: string;
        lastName: string;
        email: string;
        hashPassword?: string;
        password?: string;
        id?: string | number | undefined;
        createdAt?: Date;
        deactivated: boolean;
        confirmed: boolean;
        coins?: number;
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
            type?: string;
        };
    }) {
        const {
            firstName,
            lastName,
            email,
            hashPassword,
            password,
            id,
            createdAt,
            deactivated,
            confirmation,
            confirmed,
            recovery,
            displayName,
            profileImage,
            coins
        } = params;

        this.firstName = firstName;
        this.lastName = lastName;
        this.email = email;
        this.id = id;
        this.createdAt = createdAt || new Date();
        this.deactivated = deactivated;
        this.confirmation = confirmation;
        this.confirmed = confirmed;
        this.recovery = recovery;
        this.displayName = displayName;
        this.profileImage = profileImage;
        this.coins = coins;
        
        if (password) {
            this.password = password; // This will trigger the setter
        } else {
            this.hashPassword = hashPassword || '';
        }
    }

    set password(p: string) {
        this.hashPassword = this.hashPasswordSync(p);
    }

    checkPassword(password: string) : boolean {
        return bcrypt.compareSync(password, this.hashPassword)
    };

    private hashPasswordSync(password: string): string {
        const saltRounds = 10;
        return bcrypt.hashSync(password, saltRounds);
    }
}