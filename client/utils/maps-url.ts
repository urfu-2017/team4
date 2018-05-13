const baseUrl = 'https://static-maps.yandex.ru/1.x/?size=650,450&l=map&z=14';

export default function (lat: number, lon: number) {
    const coords = [lat, lon].join(',');
    return `${baseUrl}&ll=${coords}&pt=${coords},round`;
}
