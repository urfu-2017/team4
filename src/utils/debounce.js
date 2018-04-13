export default function debounce(callback, wait, context = this) {
    let timeout = null;
    let callbackArgs = null;

    const later = () => callback.apply(context, callbackArgs);

    return function (...args) {
        callbackArgs = args;
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}
