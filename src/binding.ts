import { IBuildable, IBuilder } from "./builder";
import { Direction } from "./ibindable";

export class Binding implements IBuildable {
    private id: string;
    private direction: Direction;

    constructor(id: string, direction: Direction){
        this.id = id;
        this.direction = direction;
    }

    get Id(): string {
        return this.id;
    }

    get Direction(): Direction {
        return this.direction;
    }

    build(builder: IBuilder): void {
        builder.buildBinding(this.id, this.direction)
    }

    static fromString(direction: string): Direction {
        return direction === 'in' ? Direction.In : Direction.Out;
    }
}