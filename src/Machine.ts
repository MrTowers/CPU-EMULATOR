import { Byte } from "./Byte.js";
import { Int } from "./Int.js";
import { Memory } from "./Memory.js";

export class Machine {
    ra: Byte = new Byte();
    rb: Byte = new Byte();
    ram: Memory = new Memory();
    ic: Int = new Int();

    stopped: boolean = false;
    jumped: boolean = false;

    tick() {
        this.execute();
        if (this.jumped) {
            this.jumped = false;
        }
        else {
            this.ic.setValue(this.ic.value += 2);
        }
    }

    resetMemory() {
        this.ram.clear();
        this.ra.setValue();
        this.rb.setValue();
        this.ic.setValue();
    }

    execute() {
        if (!this.stopped) {
            const cmd = this.ram.getValueAtAdress(0x0600 + this.ic.value);
            const val = this.ram.getValueAtAdress(0x0600 + this.ic.value + 1);

            switch (cmd) {
                case 0x00: {
                    this.stopped = true;
                    break;
                }
                case 0x01: {
                    this.ra.setValue(this.ram.getValueAtAdress(val));
                    break;
                }

                case 0x02: {
                    this.rb.setValue(this.ram.getValueAtAdress(val));
                    break;
                }

                case 0x03: {
                    this.ra.setValue(val);
                    break;
                }

                case 0x04: {
                    this.rb.setValue(val);
                    break;
                }

                case 0x05: {
                    this.ra.setValue(this.ra.value + this.rb.value);
                    break;
                }

                case 0x06: {
                    this.ra.setValue(this.ra.value - this.rb.value);
                    break;
                }

                case 0x07: {
                    this.jumped = true;
                    this.ic.setValue((val * 2));
                    break;
                }

                case 0x08: {
                    console.log(`out data: ${this.ra.value.toString(16)}`);
                    break;
                }

                case 0x09: {
                    this.ram.setValueAtAdress(val, this.ra.value);
                    break;
                }

                case 0x0a: {
                    this.ram.setValueAtAdress(val, this.rb.value);
                    break;
                }

                case 0x0b: {
                    this.stopped = true;
                    break;
                }

                case 0x0c: {
                    if (this.ra.value == this.rb.value) {
                        //console.error("equal");
                        this.jumped = true;
                        this.ic.setValue(val * 2);
                    }
                    break;
                }

                case 0x0d: {
                    if (this.ra.value != this.rb.value) {
                        this.jumped = true;
                        this.ic.setValue(val * 2);
                    }
                    break;
                }

                default: {
                    alert("runtime error");
                    this.stopped = true;
                }
            }
        }
    }
}