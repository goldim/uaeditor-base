export interface ILoader {
    load(path: string): string,
    loadEmpty(): string;
}