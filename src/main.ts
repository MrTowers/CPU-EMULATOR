import { Byte } from "./Byte.js";
import { GPU } from "./GPU.js";
import { loadJSON } from "./LoadJSON.js";
import { Machine } from "./Machine.js";
import { Parser } from "./Parser.js";

let code = "";
const info: HTMLDivElement = <HTMLDivElement> document.getElementById("info");

const PC = new Machine();
const gpu = new GPU();

loadJSON("test.asm", (data) => {
    code = data;
    start();
});

function wait (time = 0) {
    return new Promise((res, rej) => {
        setTimeout(() => {
            res(1);
        }, time * 1000);
    });
}

function start () {
    Parser.parse(PC, code);
    tick();
}

export function sleepS (time = 0) {
    sleepTime = time;
}

let sleepTime = 0;

document.addEventListener("keydown", (e) => {
    PC.ram.setValueAtAdress(0xff, e.keyCode);
});

async function tick () {
    if (PC.stopped) {
        console.log(PC);
        return;
    }
    if (sleepTime) {
        await wait(sleepTime);
        sleepTime = 0;
    }
    setTimeout(() => {
        PC.ram.setValueAtAdress(0xfe, Math.random() * 0xff);
        PC.tick();
        info.innerText = `command: ${PC.lastCommand}, ticks: ${PC.ticks}, ic: ${PC.ic.value.toString(16)}, stack: ${PC.sp.value.toString(16)}
        ${PC.ram.getValueAtAdress(0x1ff).toString(16)}, 
        ${PC.ram.getValueAtAdress(0x1fe).toString(16)},
        ${PC.ram.getValueAtAdress(0x1fd).toString(16)},
        ${PC.ram.getValueAtAdress(0x1fc).toString(16)},
        ${PC.ram.getValueAtAdress(0x1fb).toString(16)},
        ${PC.ram.getValueAtAdress(0x1fa).toString(16)},`;
        gpu.tick(PC);
        tick();
    }, 0);
}