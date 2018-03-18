import UsersStore from '../domain/users-store';
import UIStore from '../domain/ui-store';

const SERVER_UNAVAILABLE_MESSAGE = 'Server doesn\'t respond';
const defaultOptions = {
    mode: 'cors',
    credentials: 'include',
    headers: {
        Accept: 'application/json'
    }
};

/**
 * Wrapper fetch
 * @param {RequestInfo} url
 * @param {RequestInit} options
 * @returns {Promise<{status, statusText, body: *}>}
 */
export default async (url, options = null) => {
    let response = null;

    try {
        response = await fetch(url, { ...options, ...defaultOptions });
    } catch (e) {
        UIStore.showError(SERVER_UNAVAILABLE_MESSAGE);

        return { status: 0, statusText: SERVER_UNAVAILABLE_MESSAGE, body: null };
    }

    const { status, statusText } = response;

    if (status === 403 || status === 401) {
        UsersStore.clear();

        return { status, statusText, body: null };
    }

    return {
        status,
        statusText,
        body: await response.json()
    };
};
