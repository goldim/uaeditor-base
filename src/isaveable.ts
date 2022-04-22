export interface ISaveable {
    wasSaved(): boolean;
    save(): void;
}