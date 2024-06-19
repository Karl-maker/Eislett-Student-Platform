// Add this interface declaration in a global.d.ts file or in a file where it will be picked up by TypeScript
declare namespace Express {
    export interface Request {
        user?: {
            id: string | number
        }; // Define the user property to hold user information
    }
}
