export class Byte {
    constructor(value = 0) {
        this.value = 0;
        this.max = 0xff;
        this.setValue(value);
    }
    setValue(value = 0) {
        this.value = Math.floor(value % this.max);
    }
}
