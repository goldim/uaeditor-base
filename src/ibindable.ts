export enum Direction {
    In,
    Out
}

export interface IBindable {
    Id: string;
    bindTo(another: IBindable, direction: Direction): void;
    unbindWith(another: IBindable): void;

    wasBound(): boolean;
    wasBoundTo(another: IBindable): boolean;
}