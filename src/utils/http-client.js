import UsersStore from '../domain/users-store';
import UIStore from '../domain/ui-store';

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
        const message = 'Server doesn\'t respond';

        UIStore.showError(message);

        return { status: 0, statusText: message, body: null };
    }

    const { status, statusText } = response;

    if (status === 403 || status === 401) {
        UsersStore.clear();

        return { status, statusText, body: null };
    }

    const body = await response.json();

    return { status, statusText, body };
};
