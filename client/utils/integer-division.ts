export default (value: number, divisor: number): number => {
    const result = value / divisor;

    if (result > 0) {
        return Math.floor(result);
    }

    return Math.ceil(result);
};
