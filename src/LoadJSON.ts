export function loadJSON (src: string, callback = (data: string) => {}) {
    const x = new XMLHttpRequest();
    x.open("get", src);
    x.onload = () => {
        callback(x.responseText);
    }
    x.send();
}