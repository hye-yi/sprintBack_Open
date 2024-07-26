import { IdNamingData } from '../modules/IdNamingData.js';
import { FundamentalsOrder, AKSDevOrder, AdvancedOrder, KubAKSOrder } from '../modules/assignOrder.js';
import { requestAssignIAMtoRG, requestAssignRBAC, requestAssignIAMtoSubscription } from '../modules/requests.js';
import '../../../utils/env.js';
import { ResourceGroup } from '../request/ResourceGroup.js';
import { User } from '../request/User.js';

export function assignFundamentals(OpenStart) {
    return new Promise(async (resolve, reject) => {
        // [Fundamentals]
        //(1) 사용자 생성
        //(2) 리소스 그룹 생성
        //(3) 리소스 그룹에 역할 할당
        try {
            const RG = new ResourceGroup();
            const USER = new User();
            const namingData = new IdNamingData('101').setData(OpenStart, FundamentalsOrder);
            const [user, rg] = await Promise.all([USER.create(namingData), RG.create(namingData)]);
            await requestAssignIAMtoRG(user.id, namingData);
            const result = {
                userPrincipalId: user.displayName,
                userPrincipalName: user.userPrincipalName,
                userId: user.id,
                userPassword: namingData.password,
                assignSubscriptionId: process.env.SUBSCRIPTION15,
                assignSubscriptionName: 'Cl***** Sprint 15',
                assignResourceGroup: rg.name,
            };
            resolve(result);
        } catch (error) {
            reject({ message: error });
        }
    });
}

export function assignAKSDevops() {
    return new Promise(async (resolve, reject) => {
        // [AKS+DevOps]
        //(1) 생성되어있는 사용자와 매칭
        try {
            const namingData = new IdNamingData('102').setDataAlreadyAssigned(AKSDevOrder);
            const result = namingData.alreadyAssigned;
            resolve(result);
        } catch (error) {
            reject({ message: error });
        }
    });
}

export function assignAdvanced(OpenStart) {
    return new Promise(async (resolve, reject) => {
        // [Azure Expert]
        //(1) 사용자 생성
        //(2) 구독에 역할 할당
        //(3) 사용자에 역할 할당 (전역 관리자, 권한 있는 역할 관리자)
        try {
            const USER = new User();
            const namingData = new IdNamingData('103').setData(OpenStart, AdvancedOrder);
            const user = await USER.create(namingData);
            await requestAssignIAMtoSubscription(user.id, namingData);
            await requestAssignRBAC(user.id);
            const result = {
                userPrincipalId: user.displayName,
                userPrincipalName: user.userPrincipalName,
                userId: user.id,
                userPassword: namingData.password,
                assignSubscriptionId: namingData.subscriptionId,
                assignSubscriptionName: `Cl***** Sprint ${namingData.order}`,
                assignResourceGroup: '',
            };
            resolve(result);
        } catch (error) {
            reject({ message: error });
        }
    });
}

export function assignKubAKS() {
    return new Promise(async (resolve, reject) => {
        // [Kubernetes+AKS]
        //(1) 생성되어있는 사용자와 매칭
        try {
            const namingData = new IdNamingData('102').setDataAlreadyAssigned(KubAKSOrder);
            // 104용 USER는 102와 같이 사용함.
            const result = namingData.alreadyAssigned;
            resolve(result);
        } catch (error) {
            reject({ message: error });
        }
    });
}
