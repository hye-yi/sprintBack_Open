import { logger } from '../../../utils/logger.js';
import { ApiRequest } from '../../../utils/apiRequest.js';
import { Token } from '../../../utils/generateToken.js';
import '../../../utils/env.js';
import { Role } from './Role.js';

export class User {
    constructor() {
        this.request = new ApiRequest(`https://graph.microsoft.com/v1.0`);
    }

    async #header() {
        const token = await new Token().graphToken();
        return {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
    }

    create(namingData) {
        return new Promise(async (resolve, reject) => {
            const userPrincipalId = namingData.userPrincipalId;
            const pw = namingData.password;

            const data = {
                accountEnabled: true,
                displayName: userPrincipalId,
                mailNickname: userPrincipalId,
                userPrincipalName: `${userPrincipalId}@cl*****ssprint.onmicrosoft.com`,
                passwordProfile: {
                    forceChangePasswordNextSignIn: true,
                    password: pw,
                },
            };
            const headers = await this.#header();

            this.request
                .post(`/users`, { headers, data })
                .then((response) => {
                    logger.info(`Create User `, userPrincipalId);
                    resolve(response);
                })
                .catch(() => {
                    logger.error(`Create User Err`, err.response.data);
                    reject({ message: `${userPrincipalId} already exists.` });
                });
        });
    }

    delete(userId, userPrincipalName) {
        return new Promise(async (resolve, reject) => {
            const url = `/users/${userPrincipalName}`;
            const headers = await this.#header();
            try {
                await this.#deleteRole(userId);
                this.request.delete(url, { headers }).then(() => resolve({ code: 200 }));
            } catch (error) {
                reject({ code: 3, message: 'Delete User Request Fail' });
            }
        });
    }

    #deleteRole(userId) {
        return new Promise(async (resolve, reject) => {
            try {
                const role = new Role();
                const roles = await role.get(userId);
                await Promise.all(roles.map((i) => role.delete(i.id)));
                resolve({ code: 200 });
            } catch (error) {
                logger.info(`deleteRole ${error}`);
                reject(error);
            }
        });
    }
}
