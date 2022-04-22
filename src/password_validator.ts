export class PasswordValidator {
    static validate(password: string): boolean {
        const notEmpty = password !== "";
        return notEmpty;
    }
}