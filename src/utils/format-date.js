export default function goodDate(time) {
    const dt = new Date(time);
    const hours = dt.getHours();
    const minutes = String(dt.getMinutes()).padStart(2, '0');
    const seconds = String(dt.getSeconds()).padStart(2, '0');

    return `${hours}:${minutes}:${seconds}`;
}
