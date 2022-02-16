import { Byte } from "./Byte.js";
import { Chat } from "./Chat.js";
import { Int } from "./Int.js";
import { sleepS } from "./main.js";
import { Memory } from "./Memory.js";



export class Machine {
    ra: Byte = new Byte();
    rb: Byte = new Byte();
    ram: Memory = new Memory();
    ic: Int = new Int();
    sp: Byte = new Byte(0xff);
    output!: Chat;

    stopped: boolean = false;
    jumped: boolean = false;

    lastCommand: string = "";
    ticks: number = 0;
    nops: number = 0;

    tick() {
        if (this.nops > 5) {
            this.stopped = true;
            //alert("no code error");
        }
        this.execute();
        if (this.jumped) {
            this.jumped = false;
        }
        else {
            this.ic.setValue(this.ic.value + 2);
        }
        this.ticks++;
    }

    stackPush(value = 0) {
        this.ram.setValueAtAdress(this.sp.value + 0x100, value);
        this.sp.setValue(this.sp.value - 1);
    }

    stackPop() {
        this.sp.setValue(this.sp.value + 1);
        let value = this.ram.getValueAtAdress(this.sp.value + 0x100);
        this.ram.setValueAtAdress(this.sp.value + 0x100, 0);
        return value;
    }

    resetMemory() {
        this.ram.clear();
        this.ra.setValue();
        this.rb.setValue();
        this.ic.setValue();
    }

    setchat(chat: Chat) {
        this.output = chat;
    }

    execute() {
        if (!this.stopped) {
            const cmd = this.ram.getValueAtAdress(0x0600 + this.ic.value);
            const val = this.ram.getValueAtAdress(0x0600 + this.ic.value + 1);
            let nop = false;

            switch (cmd) {
                case 0x00: {
                    nop = true;
                    this.lastCommand = "nop";
                    break;
                }
                case 0x01: {
                    this.ra.setValue(this.ram.getValueAtAdress(val));
                    this.lastCommand = "lda";
                    break;
                }

                case 0x02: {
                    this.rb.setValue(this.ram.getValueAtAdress(val));
                    this.lastCommand = "ldb";
                    break;
                }

                case 0x03: {
                    this.ra.setValue(val);
                    this.lastCommand = "ila";
                    break;
                }

                case 0x04: {
                    this.rb.setValue(val);
                    this.lastCommand = "ilb";
                    break;
                }

                case 0x05: {
                    this.ra.setValue(this.ra.value + this.rb.value);
                    this.lastCommand = "add";
                    break;
                }

                case 0x06: {
                    this.ra.setValue(this.ra.value - this.rb.value);
                    this.lastCommand = "sub";
                    break;
                }

                case 0x07: {
                    this.jumped = true;
                    this.ic.setValue((val * 2));
                    this.lastCommand = "jmp";
                    break;
                }

                case 0x08: {
                    console.log(`out data: ${this.ra.value.toString()}`);
                    this.lastCommand = "cmd";
                    break;
                }

                case 0x09: {
                    this.ram.setValueAtAdress(val, this.ra.value);
                    this.lastCommand = "sta";
                    break;
                }

                case 0x0a: {
                    this.ram.setValueAtAdress(val, this.rb.value);
                    this.lastCommand = "stb";
                    break;
                }

                case 0x0b: {
                    this.stopped = true;
                    this.lastCommand = "brk";
                    break;
                }

                case 0x0c: {
                    if (this.ra.value == this.rb.value) {
                        //console.error("equal");
                        this.jumped = true;
                        this.ic.setValue(val * 2);
                        this.lastCommand = "beq";
                    }
                    break;
                }

                case 0x0d: {
                    if (this.ra.value != this.rb.value) {
                        this.jumped = true;
                        this.ic.setValue(val * 2);
                        this.lastCommand = "bne";
                    }
                    break;
                }

                case 0x0e: {
                    if (this.ra.value > this.rb.value) {
                        this.jumped = true;
                        this.ic.setValue(val * 2);
                        this.lastCommand = "brh";
                    }
                    break;
                }

                case 0x0f: {
                    if (this.ra.value < this.rb.value) {
                        this.jumped = true;
                        this.ic.setValue(val * 2);
                        this.lastCommand = "brl";
                    }
                    break;
                }

                case 0x10: {
                    this.ra.setValue(this.ra.value * this.rb.value);
                    this.lastCommand = "mul";
                    break;
                }

                case 0x11: {
                    this.ra.setValue(Math.floor(this.ra.value / this.rb.value));
                    this.lastCommand = "div";
                    break;
                }

                case 0x12: {
                    this.stackPush(this.ic.value);
                    this.ic.setValue(val * 2);
                    this.jumped = true;
                    this.lastCommand = "jsr";
                    break;
                }

                case 0x13: {
                    let x = this.stackPop();
                    this.ic.setValue(x);
                    this.lastCommand = "rts";
                    break;
                }

                case 0x14: {
                    this.ra.setValue(this.ram.getValueAtAdress(val + this.rb.value));
                    this.lastCommand = "laob";
                    break;
                }

                case 0x15: {
                    this.rb.setValue(this.ram.getValueAtAdress(val + this.ra.value));
                    this.lastCommand = "lboa";
                    break;
                }

                case 0x16: {
                    this.ram.setValueAtAdress(this.rb.value + val, this.ra.value);
                    this.lastCommand = "sto";
                    break;
                }

                case 0x17: {
                    this.lastCommand = "slp";
                    sleepS(val);
                    break;
                }

                case 0x18: {
                    if (this.ra.value == 32) {
                        this.output.addLetter("\xa0");
                    }
                    else {
                        this.output.addLetter(String.fromCharCode(this.ra.value));
                    }
                    this.lastCommand = "cho";
                    break;
                }

                case 0x19: {
                    this.output.clear();
                    this.lastCommand = "ccl";
                    break;
                }

                case 0x1a: {
                    this.output.removeLast();
                    this.lastCommand = "crl";
                    break;
                }

                default: {
                    alert("runtime error");
                    this.stopped = true;
                }
            }

            if (nop) {
                this.nops++;
            }
            else {
                this.nops = 0;
            }
        }
    }
}