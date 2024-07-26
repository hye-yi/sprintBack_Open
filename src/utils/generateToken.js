import axios from 'axios';
import qs from 'qs';
import './env.js';

export class Token {
    constructor() { }

    async graphToken() {
        return await this.#generateToken('graph.microsoft.com');
    }

    async azureToken() {
        return await this.#generateToken('management.azure.com');
    }

    #generateToken(scope) {
        const data = qs.stringify({
            grant_type: 'client_credentials',
            client_id: process.env.CLIENT_ID,
            scope: `https://${scope}/.default`,
            client_secret: process.env.CLIENT_SECRET,
        });
        const options = {
            method: 'post',
            url: `https://login.microsoftonline.com/${process.env.TENANT_ID}/oauth2/v2.0/token`,
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
            },
            data: data,
        };

        return new Promise((resolve, reject) => {
            axios(options)
                .then((response) => resolve(response.data.access_token))
                .catch(() => reject({ message: 'Token Error' }));
        });
    }
}
