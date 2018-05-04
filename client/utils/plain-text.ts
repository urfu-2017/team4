const el = document.createElement('div');

export default function (html: string) {
    el.innerHTML = html;
    const text = el.textContent;
    el.innerHTML = '';

    return text;
}
