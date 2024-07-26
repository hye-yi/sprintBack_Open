import { logger } from '../../../utils/logger.js';
import { requestGetListVaults, requestIsRG, requestGetRGlist } from '../modules/requests.js';
import { Vault } from '../request/Vault.js';
import { BackUp } from '../request/BackUp.js';
import '../../../utils/env.js';
import { ResourceGroup } from '../request/ResourceGroup.js';
import { User } from '../request/User.js';

export function terminateFundamentals(eduInfo) {
    return new Promise(async (resolve, reject) => {
        // [Fundamentals]
        //(1) 사용자 삭제
        //(2) 작업증명 유무
        //(2-1) 작업증명 삭제 (매우 복잡함)
        //---(1) Get Protected items List
        //---(2) 일시삭제,보안기능 disable
        //---(3) 백업 중지
        //---(4) 백업 삭제
        //---(5) 작업증명 삭제
        //(3) 리소스 그룹 삭제
        try {
            const { userId, userPrincipalName, assignSubscriptionId, assignResourceGroup } = eduInfo;

            const user = new User();
            await Promise.all([
                user.delete(userId, userPrincipalName),
                deleteRG(assignSubscriptionId, assignResourceGroup),
            ]);
            let interval = setInterval(() => {
                requestIsRG(assignSubscriptionId, assignResourceGroup).then((isRG) => {
                    if (isRG) {
                        console.log(`Delete ${assignResourceGroup}`);
                        clearInterval(interval);
                        resolve({ code: 200, message: 'Success' });
                    } else console.log('Not Deleted');
                });
            }, 1000);
        } catch (error) {
            reject(error);
        }
    });
}
export function terminateAKSDevops(eduInfo) {
    return new Promise(async (resolve, reject) => {
        // [AKS+DevOps]
        //(1) 구독 내의 리소스 삭제
        try {
            const { assignSubscriptionId } = eduInfo;
            await deleteAllRG(assignSubscriptionId);
            resolve({ code: 200 });
        } catch (error) {
            reject(error);
        }
    });
}
export function terminateAdvanced(eduInfo) {
    return new Promise(async (resolve, reject) => {
        // [Azure Expert]
        //(1) 사용자 삭제
        //(2) 구독 내의 리소스 삭제
        try {
            const user = new User();
            const { userId, userPrincipalName, assignSubscriptionId } = eduInfo;
            await Promise.all([user.delete(userId, userPrincipalName), deleteAllRG(assignSubscriptionId)]);
            resolve({ code: 200 });
        } catch (error) {
            logger.info(`terminateAdvanced ${error}`);
            reject(error);
        }
    });
}
export function terminateKubAKS(eduInfo) {
    return new Promise(async (resolve, reject) => {
        // [Kubernetes+AKS]
        //(1) 구독 내의 리소스 삭제
        try {
            const { assignSubscriptionId } = eduInfo;
            await deleteAllRG(assignSubscriptionId);
            resolve({ code: 200 });
        } catch (error) {
            reject(error);
        }
    });
}

/**  Private Function  **/

function deleteRG(subscriptionId, resourceGroup) {
    return new Promise(async (resolve, reject) => {
        try {
            logger.info(`4 Delete RG ${resourceGroup}`);
            const vaultList = await requestGetListVaults(subscriptionId, resourceGroup);
            const RG = new ResourceGroup(subscriptionId, resourceGroup);
            if (vaultList.length == 0) {
                await RG.requestDeleteRG();
                resolve({ code: 200 });
            } else {
                await deleteVault(subscriptionId, resourceGroup, vaultList, RG);
                resolve({ code: 200 });
            }
        } catch (err) {
            reject(err);
        }
    });
}

function deleteAllRG(subscriptionId) {
    return new Promise(async (resolve, reject) => {
        try {
            const RGs = await requestGetRGlist(subscriptionId);
            await Promise.all(
                RGs.map(async (rg) => {
                    const rgName = rg.name;
                    await deleteRG(subscriptionId, rgName);
                })
            );
            //모든 deleteRG가 병렬로 실행, 모든 deleteRG가 완료되었는지 여부 상관없이 다음 요소 진행
            resolve({ code: 200 });
        } catch (err) {
            logger.info(`deleteAllRG ${err}`);
            reject({ code: 1, message: 'Delete RG Fail' });
        }
    });
}

function deleteVault(subscriptionId, resourceGroup, vaultList, RG) {
    return new Promise(async (resolve, reject) => {
        try {
            const vault = new Vault(subscriptionId, resourceGroup);
            const result = await Promise.all(
                vaultList.map(async ({ name }) => {
                    const [isDisable, { protectedItemId }] = await Promise.all([
                        vault.disableConfig(name),
                        vault.getProtectedItems(name),
                    ]);
                    if (protectedItemId) {
                        const backup = new BackUp(protectedItemId);
                        await backup.stop();
                        //백업 stop()하고 연달아 delete() 불가, 시간간격을 줘야 됨.
                        setTimeout(() => {
                            let interval1 = setInterval(async () => {
                                const { protectionState } = await vault.getProtectedItems(name);
                                if (protectionState === 'ProtectionStopped') {
                                    await backup.delete();
                                    clearInterval(interval1);
                                }
                            }, 3000);
                        }, 3000);
                    }
                    let interval2 = setInterval(async () => {
                        const { protectedItemId } = await vault.getProtectedItems(name);
                        if (protectedItemId == false) {
                            await RG.requestDeleteRG();
                            clearInterval(interval2);
                        }
                    }, 3000);

                    return { protectedItemId, isDisable };
                })
            );
        } catch (err) {
            reject(err);
        }
    });
}
