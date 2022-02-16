export class Chat {
    constructor() {
        this.ref = document.createElement("code");
        document.body.appendChild(document.createElement("br"));
        document.body.appendChild(this.ref);
        this.ref.innerText = "chat test";
    }
    addLetter(letter = "") {
        this.ref.innerText += letter;
    }
    clear() {
        this.ref.innerText = "";
    }
    removeLast() {
        this.ref.innerText = this.ref.innerText.slice(0, this.ref.innerText.length - 1);
    }
}
