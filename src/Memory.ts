import { Byte } from "./Byte.js";

export class Memory {
    adresses: Byte[] = [];

    constructor (size = 0xffff) {
        for (let i = 0; i < size; i++) {
            this.adresses.push(new Byte());
        }
    }

    setValueAtAdress (adress = 0, value = 0) {
        this.adresses[adress].setValue(value);
    }

    getValueAtAdress (adress = 0) {
        return this.adresses[adress].value;
    }

    clear () {
        let size = this.adresses.length;
        this.adresses = [];
        for (let i = 0; i < size; i++) {
            this.adresses.push(new Byte());
        }
    }
}