import { logger } from '../../../utils/logger.js'
import { ApiRequest } from '../../../utils/apiRequest.js';
import { Token } from '../../../utils/generateToken.js';
import '../../../utils/env.js';

export class Role {
    constructor() {
        this.request = new ApiRequest(`https://graph.microsoft.com/v1.0`)
    }

    async #header() {
        const token = await new Token().graphToken();
        return ({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        })
    }

    get(userId) {
        return new Promise(async (resolve, reject) => {
            const url = `/roleManagement/directory/roleAssignments?$filter = principalId eq \'${userId}\'`
            const headers = await this.#header()

            this.request.get(url, { headers })
                .then(response => {
                    logger.info(`Get Assigned Role Successfully`);
                    resolve(response.value)
                })
                .catch((err) => {
                    logger.error(`Get Assigned Role Err`, err.response.data);
                    reject({ code: 1, message: 'ResourceNotFound' })
                })
        })
    }

    delete(roleId) {
        return new Promise(async (resolve, reject) => {
            const url = `/roleManagement/directory/roleAssignments/${roleId}`
            const headers = await this.#header()

            this.request.delete(url, { headers })
                .then(() => {
                    logger.info(`Delete Roles ${roleId}`);
                    resolve({ code: 200 })
                })
                .catch((err) => {
                    logger.error(`Delete Role Err`, err.response.data);
                    reject({ code: 2, message: 'Delete Role Request Fail' })
                })
        })
    }
}