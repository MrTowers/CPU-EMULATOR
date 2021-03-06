export class Byte {
    constructor(value = 0) {
        this.value = 0;
        this.max = 0xffff;
        this.setValue(value);
    }
    setValue(value = 0) {
        if (value > this.max) {
            this.value = Math.floor(value % this.max);
        }
        else {
            this.value = value;
        }
    }
}
