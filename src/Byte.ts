export class Byte {
    value: number = 0;
    max: number = 0xffff;

    constructor (value = 0) {
        this.setValue(value);
    }

    setValue (value = 0) {
        if (value > this.max) {
            this.value = Math.floor(value % this.max);
        }
        else {
            this.value = value;
        }
    }
}