import * as got from 'got';

import { Request } from '../rpc/request';
import { Response } from '../rpc/response';
import { WEATHER_API_TOKEN } from '../config';

interface Params {
    city: string;
}

export default async function(request: Request<Params>, response: Response) {
    const { body } = await got('http://api.openweathermap.org/data/2.5/forecast', {
        json: true,
        query: {
            q: request.params.city,
            units: 'metric',
            lang: 'ru',
            APPID: WEATHER_API_TOKEN
        }
    });

    if (!body || !body.list || !body.list[0]) {
        return response.success(null);
    }

    const weather = body.list[0].main;
    response.success({ temperature: Math.round(weather.temp) });
}
