export class RecordSet {
    private records: any = {};

    get(key: string): string {
        return this.records[key];
    }

    set(key: string, value: string): void {
        this.records[key] = value;
    }
}