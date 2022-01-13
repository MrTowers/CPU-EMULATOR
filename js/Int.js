import { Byte } from "./Byte.js";
export class Int extends Byte {
    constructor() {
        super();
        this.max = 0xffffffff;
    }
}
