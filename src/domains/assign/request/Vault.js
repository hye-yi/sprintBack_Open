import { logger } from '../../../utils/logger.js';
import { ApiRequest } from '../../../utils/apiRequest.js';
import { Token } from '../../../utils/generateToken.js';
import '../../../utils/env.js';

export class Vault {
    constructor(subscriptionId, resourceGroup) {
        this.request = new ApiRequest(`https://management.azure.com`);
        this.subscriptionId = subscriptionId;
        this.resourceGroup = resourceGroup;
    }

    async #header() {
        const token = await new Token().azureToken();
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
    }

    #url(additionalURL) {
        const additional = additionalURL ? `/${additionalURL}` : ``;
        const url = `https://management.azure.com/subscriptions/${this.subscriptionId}/resourceGroups/${this.resourceGroup}/providers/Microsoft.RecoveryServices/vaults${additional}`;
        return url;
    }
    get() {
        return new Promise(async (resolve, reject) => {
            const url = this.#url(`?api-version=2016-06-01`);
            const headers = await this.#header();

            this.request
                .get(url, { headers })
                .then((response) => {
                    logger.info(`Get Vaults List Successfully`);
                    resolve(response.data);
                })
                .catch((err) => {
                    logger.error(`Get Vaults List Err`, err.response.data);
                    reject({ code: 1, message: 'Get Vaults List Err`' });
                });
        });
    }

    disableConfig(vaultName) {
        return new Promise(async (resolve, reject) => {
            const url = this.#url(`/${vaultName}/backupconfig/vaultconfig?api-version=2021-02-10`);
            const headers = await this.#header();
            const data = {
                properties: {
                    enhancedSecurityState: 'Disabled',
                    softDeleteFeatureState: 'Disabled',
                },
            };
            this.request
                .put(url, { headers, data })
                .then((response) => {
                    logger.info(`8 Disable Vaults Config`);

                    resolve(response.properties);
                })
                .catch((err) => {
                    logger.error(`8 Disable Vaults Config Err`, err.response.data);
                    reject({ code: 2, message: 'Disable Vaults Config Err' });
                });
        });
    }

    getProtectedItems(vaultName) {
        return new Promise(async (resolve, reject) => {
            const url = this.#url(`/${vaultName}/backupProtectedItems?api-version=2021-02-10`);
            const headers = await this.#header();

            this.request
                .get(url, { headers })
                .then(({ value }) => {
                    const protectedItemId = value.length > 0 ? value[0].id : false;
                    const protectionState = value.length > 0 ? value[0].properties.protectionState : '';

                    logger.info(`8-2 Get Protected Items List Successfully`);

                    resolve({ protectedItemId, protectionState });
                })
                .catch((err) => {
                    logger.error(`8-2 Get Protected Items List`, err.response.data);
                    reject({ code: 3, message: 'Get Protected Items List Err' });
                });
        });
    }

    deleteRecovery(vaultName) {
        return new Promise(async (resolve, reject) => {
            const url = this.#url(`/${vaultName}?api-version=2016-06-01`);
            // const url = `https://management.azure.com/subscriptions/${this.subscriptionId}/resourceGroups/${this.resourceGroup}/providers/Microsoft.RecoveryServices/vaults/${vaultName}?api-version=2016-06-01`
            const headers = await this.#header();

            this.request
                .delete(url, { headers, data })
                .then((response) => {
                    logger.info(`9 Delete Recovery Successfully`);
                    resolve(response);
                })
                .catch((err) => {
                    logger.error(`9 Delete Recovery Err`, err.response.data);
                    reject();
                });
        });
    }
}
