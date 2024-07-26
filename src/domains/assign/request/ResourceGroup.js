import { logger } from '../../../utils/logger.js';
import { ApiRequest } from '../../../utils/apiRequest.js';
import { Token } from '../../../utils/generateToken.js';
import { Vault } from './Vault.js';
import { BackUp } from './BackUp.js';

import '../../../utils/env.js';

export class ResourceGroup {
    constructor(subscriptionId = null, resourceGroup = null) {
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

    #url(subscriptionId = this.subscriptionId, resourceGroup = this.resourceGroup) {
        const resourceGroupUrl = resourceGroup ? `/${resourceGroup}` : ``;
        const url = `/subscriptions/${subscriptionId}/resourceGroups${resourceGroupUrl}?api-version=2021-04-01`;
        return url;
    }

    get(subscriptionId, resourceGroup = null) {
        return new Promise(async (resolve, reject) => {
            const url = this.#url(subscriptionId, resourceGroup);
            const headers = await this.#header();

            this.request
                .get(url, { headers })
                .then((response) => {
                    logger.info(`Get RG List Successfully`);
                    resolve(response.value || []);
                })
                .catch((err) => {
                    logger.error(`Get RG List Err`, err.response.data);
                    reject({ code: 1, message: 'ResourceGroupNotFound' });
                });
        });
    }

    create(namingData) {
        return new Promise(async (resolve, reject) => {
            const resourceGroup = namingData.RGname;
            const data = { location: 'koreacentral' };
            const url = this.#url(process.env.SUBSCRIPTION15, resourceGroup);
            const headers = await this.#header();

            this.request
                .put(url, { headers, data })
                .then((response) => {
                    logger.info(`Create RG Successfully`);
                    resolve(response);
                })
                .catch((err) => {
                    logger.error(`Create RG Err`, err.response.data);
                    reject({ message: `${resourceGroup} already exists.` });
                });
        });
    }

    requestDeleteRG(resourceGroup = this.resourceGroup) {
        return new Promise(async (resolve, reject) => {
            const url = this.#url();
            const headers = await this.#header();

            this.request
                .delete(url, { headers })
                .then((response) => {
                    logger.info(`Delete Resource Group Successfully : ${resourceGroup}`);
                    resolve(response);
                })
                .catch((err) => {
                    logger.error(`Delete RG Err`, err.response.data);
                    reject({ message: `Resource group ${resourceGroup} could not be found.` });
                });
        });
    }

    delete(subscriptionId, resourceGroup) {
        return new Promise(async (resolve, reject) => {
            try {
                const vault = new Vault(subscriptionId, resourceGroup);
                const vaultList = await vault.get();
                if (vaultList.length == 0) {
                    await this.requestDeleteRG(subscriptionId, resourceGroup);
                    resolve({ code: 200 });
                } else {
                    await Promise.all(
                        vaultList.map(async ({ name }) => {
                            const isDisable = await vault.disableConfig(name);
                            const itemId = await vault.getProtectedItems(name);
                            const backup = new BackUp(itemId);
                            await backup.stop();
                            await backup.delete();
                            await this.requestDeleteRG(subscriptionId, resourceGroup);
                        })
                    );
                    resolve({ code: 200 });
                }
            } catch (error) {
                reject(error);
            }
        });
    }

    deleteAll(subscriptionId) {
        return new Promise(async (resolve, reject) => {
            try {
                const RGs = await this.get(subscriptionId);
                await RGs.forEach((rg) => this.delete(subscriptionId, rg.name));
                //모든 deleteRG가 병렬로 실행, 모든 deleteRG가 완료되었는지 여부 상관없이 다음 요소 진행
                resolve({ code: 200 });
            } catch (err) {
                reject(err);
            }
        });
    }
    checkExistence(subscriptionId, resourceGroup) {
        return new Promise(async (resolve, reject) => {
            /*
             * RG 있으면 false, 없으면 true
             */
            this.get(subscriptionId, resourceGroup)
                .then(() => resolve(false))
                .catch(() => resolve(true));
        });
    }
}
