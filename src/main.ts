import { Byte } from "./Byte.js";
import { Chat } from "./Chat.js";
import { GPU } from "./GPU.js";
import { loadJSON } from "./LoadJSON.js";
import { Machine } from "./Machine.js";
import { Parser } from "./Parser.js";

let code = "";
const info: HTMLDivElement = <HTMLDivElement> document.getElementById("info");
const ram: HTMLDivElement = <HTMLDivElement> document.getElementById("ram");



const PC = new Machine();
const gpu = new GPU();
const machineInside = document.createElement("canvas");
const mIctx = machineInside.getContext("2d")!;

machineInside.width = 500;
machineInside.height = 100;
machineInside.style.backgroundColor = "black";

document.body.appendChild(machineInside);

const chat = new Chat();
PC.setchat(chat);

loadJSON("test.dasm", (data) => {
    code = data;
    start();
    drawRam();
});

function drawRam () {
    ram.innerText = "";

    let txt = "";

    for (let i = 0; i < 4; i++){
        let startVal = 0x1000;
        let ramvalue = PC.ram.getValueAtAdress(Number(i + startVal));
        txt += `${Number(i).toString(16)}: ${ramvalue.toString(16)}, `;
        if (i % 10 == 0) {
            txt += "\n";
        }
    }

    ram.innerText = txt;
}

let drawLogicScale = 0.1;
let drawRamScale = drawLogicScale;

function clamp (input = 0, min = 0, max = 0):number {
    return Math.min(Math.max(input, min), max);
}

function hexConv (value = 0) {
    let str = value.toString(16);
    while(str.length < 6) {
        str = "0" + str;
    }
    return str;
}

function drawLogic () {
    mIctx.clearRect(0, 0, 500, 100);
    mIctx.fillStyle = "white";
    mIctx.fillRect((PC.ic.value + 0x600 )* drawLogicScale, 0, 1 * drawLogicScale, 50);

    //ram draw

    for (let i = 0; i < 1000 / drawRamScale; i++) {
        let val = PC.ram.getValueAtAdress(i + 0x0);
        if (val != 0) {
            mIctx.fillStyle = "#" + hexConv(Math.pow(val, 10));
            mIctx.fillRect(i * drawRamScale, 50, drawRamScale, 50);
        }
    }
}

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
        PC.ram.setValueAtAdress(0xfe, Math.floor(Math.random() * 0xff));
        try {
            PC.tick();
            drawRam();
            drawLogic();
        }
        catch (e) {
            console.log("runtime error #2 at " + PC.ic.value);
            PC.stopped = true;
        }
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