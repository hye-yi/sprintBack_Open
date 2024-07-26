import { logger } from '../../../utils/logger.js';
import { ApiRequest } from '../../../utils/apiRequest.js';
import { Token } from '../../../utils/generateToken.js';
import '../../../utils/env.js';

export class BackUp {
    constructor(itemId) {
        this.request = new ApiRequest(`https://management.azure.com`);
        this.itemId = itemId;
    }
    #url() {
        return `https://management.azure.com${this.itemId}?api-version=2021-02-10`;
    }
    async #header() {
        const token = await new Token().azureToken();
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
    }

    stop() {
        return new Promise(async (resolve, reject) => {
            const data = {
                properties: {
                    protectionState: 'ProtectionStopped',
                },
            };
            const url = this.#url();
            const headers = await this.#header();
            this.request
                .put(url, { headers, data })
                .then((response) => {
                    logger.info(`11 Stop BackUp Successfully`);
                    resolve(response);
                })
                .catch((err) => {
                    logger.error(`11 Stop BackUp Err`, err.response.data);
                    reject({ code: 4, message: 'Stop BackUp Err' });
                });
        });
    }

    delete() {
        return new Promise(async (resolve, reject) => {
            const url = this.#url();
            const headers = await this.#header();

            this.request
                .delete(url, { headers })
                .then((response) => {
                    logger.info(`12 Delete BackUp Successfully`);

                    resolve(response);
                })
                .catch((err) => {
                    logger.error(`12 Delete BackUp Err`, err.response.data);
                    reject({ code: 5, message: 'Delete BackUp Err' });
                });
        });
    }
}
