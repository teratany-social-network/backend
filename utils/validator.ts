export default function isValidName(name: string): boolean {
    return /^[a-z\s]+$/i.test(name);
}