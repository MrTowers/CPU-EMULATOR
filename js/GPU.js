export class GPU {
    constructor() {
        this.canvas = document.createElement("canvas");
        this.canvas.width = 500;
        this.canvas.height = 500;
        this.canvas.style.backgroundColor = "black";
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext("2d");
    }
    tick(PC) {
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
