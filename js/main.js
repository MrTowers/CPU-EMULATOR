import { loadJSON } from "./LoadJSON.js";
import { Machine } from "./Machine.js";
import { Parser } from "./Parser.js";
let code = "";
const PC = new Machine();
loadJSON("test.asm", (data) => {
    code = data;
    start();
});
function start() {
    Parser.parse(PC, code);
    tick();
}
function tick() {
    if (PC.stopped) {
        console.log(PC);
        return;
    }
    setTimeout(() => {
        PC.tick();
        document.body.innerText = `command: ${PC.lastCommand}, ticks: ${PC.ticks}, ic: ${PC.ic.value}, stack: ${PC.sp.value}
        ${PC.ram.getValueAtAdress(0x1ff).toString(16)}, 
        ${PC.ram.getValueAtAdress(0x1fe).toString(16)},
        ${PC.ram.getValueAtAdress(0x1fd).toString(16)},
        ${PC.ram.getValueAtAdress(0x1fc).toString(16)},
        ${PC.ram.getValueAtAdress(0x1fb).toString(16)},
        ${PC.ram.getValueAtAdress(0x1fa).toString(16)},`;
        tick();
    }, 1000);
}
