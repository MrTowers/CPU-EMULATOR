export function loadJSON(src, callback = (data) => { }) {
    const x = new XMLHttpRequest();
    x.open("get", src);
    x.onload = () => {
        callback(x.responseText);
    };
    x.send();
}
