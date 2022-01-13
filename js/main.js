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
        //console.log(PC);
        return;
    }
    setTimeout(() => {
        PC.tick();
        console.log(`ra: ${PC.ra.value.toString(16)}, rb: ${PC.rb.value.toString(16)}, ic: ${PC.ic.value.toString(16)}`);
        tick();
    }, 1000);
}
