export class Byte {
    value: number = 0;
    max: number = 0xff;

    constructor (value = 0) {
        this.setValue(value);
    }

    setValue (value = 0) {
        this.value = Math.floor(value % this.max);
    }
}