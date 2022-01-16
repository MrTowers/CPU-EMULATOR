import { Label } from "./Label.js";
import { Machine } from "./Machine.js";

export class Parser {
    static labels: Label[] = [];
    static definedVars: any[] = [];
    static parse (machine: Machine, code: string) {
        const lines = code.split("\n");

        const objs = [];


        for (let i in lines) {
            let line = lines[i];

            while (line.charCodeAt(0) == 32) {
                line = line.slice(1, line.length);
            }

            line = line.split("\r")[0];

            if (line != "" && !line.startsWith("define")) {
                const linearr = line.split(" ");
                const instruction = linearr[0];
                const value = linearr[1];
                objs.push({instruction, value});
            }

            if (line.startsWith("define")) {
                line = line.split("define")[1];
                line.trim();
                const linearr = line.split(" ");
                const name = linearr[1];
                const value = Number(linearr[2]);
                this.definedVars.push({name, value});
            }
        }

        console.log(this.definedVars);

        const instructionarr = [];

        for (let i in objs) {
            const obj = objs[i];

            if (obj.instruction.endsWith(":")) {
                this.labels.push(new Label(obj.instruction.split(":")[0], Number(i) - this.labels.length));
            }
            else {
                instructionarr.push(obj);
            }
        }

        const instructionarr2 = [];

        for (let i in instructionarr) {
            const instr = instructionarr[i];

            if (instr.value) {
                if (Number(instr.value) == null || isNaN(Number(instr.value))) {
                    const label = this._findLabelByName(instr.value);
                    if (label == null) {
                        const defined = this._findDefinedByName(instr.value);
                        if (defined == null) {
                            alert("parsing error #1");
                            return;
                        }
                        else {
                            instructionarr2.push({instruction: instr.instruction, value: defined.value});
                        }
                    }
                    else {
                        instructionarr2.push({instruction: instr.instruction, value: label.position});
                    }
                    
                }
                else {
                    instructionarr2.push({instruction: instr.instruction, value: Number(instr.value)});
                }
            }

            else {
                instructionarr2.push({instruction: instr.instruction, value: Number(instr.value)});
            }
        }

        //  INSTRUCTION SET HEREEE

        const instructionarr3 = [];

        for (let i in instructionarr2) {
            const instr = instructionarr2[i];
            const instrnew = {instruction: 0, value: instr.value};

            switch (instr.instruction) {
                case "lda": {
                    instrnew.instruction = 0x01;
                    break;
                }

                case "ldb": {
                    instrnew.instruction = 0x02;
                    break;
                }

                case "ila": {
                    instrnew.instruction = 0x03;
                    break;
                }

                case "ilb": {
                    instrnew.instruction = 0x04;
                    break;
                }

                case "add": {
                    instrnew.instruction = 0x05;
                    break;
                }

                case "sub": {
                    instrnew.instruction = 0x06;
                    break;
                }

                case "jmp": {
                    instrnew.instruction = 0x07;
                    break;
                }

                case "cmd": {
                    instrnew.instruction = 0x08;
                    break;
                }

                case "sta": {
                    instrnew.instruction = 0x09;
                    break;
                }

                case "stb": {
                    instrnew.instruction = 0x0a;
                    break;
                }

                case "brk": {
                    instrnew.instruction = 0x0b;
                    break;
                }

                case "beq": {
                    instrnew.instruction = 0x0c;
                    break;
                }

                case "bne": {
                    instrnew.instruction = 0x0d;
                    break;
                }

                case "brh": {
                    instrnew.instruction = 0x0e;
                    break;
                }

                case "brl": {
                    instrnew.instruction = 0x0f;
                    break;
                }

                case "mul": {
                    instrnew.instruction = 0x10;
                    break;
                }

                case "div": {
                    instrnew.instruction = 0x11;
                    break;
                }

                case "jsr": {
                    instrnew.instruction = 0x12;
                    break;
                }

                case "rts": {
                    instrnew.instruction = 0x13;
                    break;
                }

                default: {
                    alert("parsing error #2");
                    return;
                }
            }

            instructionarr3.push(instrnew);
        }

        //console.log(instructionarr3);

        machine.resetMemory();

        let adr = 0;

        for (let i in instructionarr3) {
            const instr = instructionarr3[i];
            machine.ram.setValueAtAdress(adr + 0x0600, instr.instruction);
            machine.ram.setValueAtAdress(adr + 0x0600 + 1, instr.value);
            adr+=2;
        }
    }

    static _findLabelByName (name = "") {
        for (let i in this.labels) {
            if (this.labels[i].name == name) {
                return this.labels[i];
            }
        }
    }

    static _findDefinedByName (name = "") {
        for (let i in this.definedVars) {
            if (this.definedVars[i].name == name) {
                return this.definedVars[i];
            }
        }
    }
}