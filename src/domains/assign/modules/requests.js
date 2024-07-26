import { Token } from '../../../utils/generateToken.js';
import { ApiRequest } from '../../../utils/apiRequest.js';
import { logger } from '../../../utils/logger.js';
import { v4 } from 'uuid';
import '../../../utils/env.js';

const AZURE_BASE_URL = `https://management.azure.com`;

export function requestGetListVaults(subscriptionId, resourceGroup) {
    return new Promise(async (resolve, reject) => {
        logger.info(`5 Get Vaults List`);
        const token = await new Token().azureToken();
        const request = new ApiRequest(AZURE_BASE_URL);
        const url = `/subscriptions/${subscriptionId}/resourceGroups/${resourceGroup}/providers/Microsoft.RecoveryServices/vaults?api-version=2016-06-01`;
        const headers = { Authorization: `Bearer ${token}` };

        await request
            .get(url, { headers })
            .then((response) => {
                resolve(response.value);
            })
            .catch(() => {
                reject({ code: 1, message: `Resource group ${resourceGroup} could not be found.` });
            });
    });
}

export function requestAssignIAMtoRG(userId, namingData) {
    return new Promise(async (resolve, reject) => {
        logger.info(`Assign IAM to RG`);
        const newUUID = v4();
        const RGname = namingData.RGname;
        const token = await new Token().azureToken();
        const request = new ApiRequest(AZURE_BASE_URL);
        const properties = JSON.stringify({
            properties: {
                roleDefinitionId: `/subscriptions/${process.env.SUBSCRIPTION15}/providers/Microsoft.Authorization/roleDefinitions/8e3af657-a8ff-443c-a75c-2fe8c4bcb635`,
                principalId: userId,
            },
        });
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
        const url = `/subscriptions/${process.env.SUBSCRIPTION15}/resourceGroups/${RGname}/providers/Microsoft.Authorization/roleAssignments/${newUUID}?api-version=2015-07-01`;
        request
            .put(url, { headers, data: properties })
            .then((response) => resolve(response))
            .catch((err) => reject({ message: err }));
    });
}

export function requestAssignRBAC(userId) {
    // https://learn.microsoft.com/en-us/rest/api/authorization/role-assignments/create?view=rest-authorization-2022-04-01&tabs=HTTP
    return new Promise(async (resolve, reject) => {
        logger.info(`Assign RBAC to Participant`);

        const token = await new Token().graphToken();
        const request = new ApiRequest(`https://graph.microsoft.com/v1.0`);

        const roles = [
            { name: 'Privileged_Role_Administrator', id: 'e8611ab8-c189-46e8-94e1-60213ab1f814' }, // 권한 있는 역할 관리자
            { name: 'Application_Administrator', id: '62e90394-69f5-4237-9190-012177145e10' }, // 전역관리자
        ];

        const mkProperties = (roleId) =>
            JSON.stringify({
                '@odata.type': '#microsoft.graph.unifiedRoleAssignment',
                RoleDefinitionId: roleId,
                PrincipalId: userId,
                DirectoryScopeId: '/',
            });

        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
        const result = await Promise.all(
            roles.map(async (role) => {
                const url = `/roleManagement/directory/roleAssignments`;
                await request.post(url, { headers, data: mkProperties(role.id) });
            })
        );
        resolve(result);
    });
}

export function requestAssignIAMtoSubscription(userId, namingData) {
    return new Promise(async (resolve, reject) => {
        logger.info(`Assign IAM to Subscription`);
        const newUUID = v4();
        const token = await new Token().azureToken();
        const subscriptionId = namingData.subscriptionId;
        const request = new ApiRequest(AZURE_BASE_URL);
        const properties = JSON.stringify({
            properties: {
                roleDefinitionId: `/subscriptions/${subscriptionId}/providers/Microsoft.Authorization/roleDefinitions/8e3af657-a8ff-443c-a75c-2fe8c4bcb635`,
                principalId: userId,
            },
        });
        const headers = {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
        };
        const url = `/subscriptions/${subscriptionId}/providers/Microsoft.Authorization/roleAssignments/${newUUID}?api-version=2015-07-01`;
        request
            .put(url, { headers, data: properties })
            .then((response) => resolve(response))
            .catch((err) => reject({ message: err }));
    });
}

export const requestIsRG = (subscriptionId, resourceGroup) => {
    return new Promise(async (resolve, reject) => {
        const token = await new Token().azureToken();
        const request = new ApiRequest(AZURE_BASE_URL);
        const url = `/subscriptions/${subscriptionId}/resourcegroups/${resourceGroup}?api-version=2021-04-01`;
        const headers = { Authorization: `Bearer ${token}` };
        /*
         * RG 있으면 false, 없으면 true
         */
        request
            .get(url, { headers })
            .then(() => resolve(false))
            .catch(() => resolve(true));
    });
};

export const requestGetRGlist = (subscriptionId) => {
    return new Promise(async (resolve, reject) => {
        logger.info(`2 Get RG List`);
        const token = await new Token().azureToken();
        const request = new ApiRequest(AZURE_BASE_URL);
        const url = `/subscriptions/${subscriptionId}/resourceGroups?api-version=2021-04-01`;
        const headers = { Authorization: `Bearer ${token}` };

        request
            .get(url, { headers })
            .then((response) => {
                resolve(response.value || []);
            })
            .catch((err) => {
                reject({ code: 1, message: 'ResourceGroupNotFound' });
            });
    });
};
