const urlRegExp = /(https?:\/\/|\/\/)?([\w.-]+)\.([a-z]{2,6}\.?)(\/[\w.?\-=%]*)*\/?/;

export default (text) => {
    const urls = text.match(urlRegExp);
    if (!urls) {
        return undefined;
    }

    return urls[0];
};
