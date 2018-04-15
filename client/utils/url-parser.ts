const urlRegExp = /(https?:\/\/|\/\/)([\wа-я.-]+)\.([0-9a-zа-я-]{2,8}\.?)(\/[\wа-яА-Я.?\-=%&]*)*\/?/;

export default text => {
    const urls = text.match(urlRegExp);
    if (!urls) {
        return undefined;
    }

    return urls[0];
};
