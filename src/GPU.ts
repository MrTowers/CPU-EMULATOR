import { Machine } from "./Machine.js";

export class GPU {
    canvas: HTMLCanvasElement;
    ctx: CanvasRenderingContext2D;

    constructor () {
        this.canvas = <HTMLCanvasElement> document.createElement("canvas");
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.canvas.style.backgroundColor = "black";
        document.body.appendChild(this.canvas);
        this.ctx = <CanvasRenderingContext2D>this.canvas.getContext("2d");
    }

    tick (PC: Machine) {
        this.ctx.clearRect(0, 0, 500, 500);
        for (let i = 0; i < 1024; i++) {
            let cell = PC.ram.getValueAtAdress(0x200 + i);
            if (cell) {
                this.ctx.fillStyle = "white";
                this.ctx.fillRect((i % 32) * this.canvas.width / 32, Math.floor(i / 32) * this.canvas.height / 32, this.canvas.width / 32, this.canvas.height / 32);
            }
        }
    }
}