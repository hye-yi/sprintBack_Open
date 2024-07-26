import { logger } from '../../utils/logger.js';
import { assignFundamentals, assignAKSDevops, assignAdvanced, assignKubAKS } from './interface/assignByProgram.js';
import {
    terminateFundamentals,
    terminateAKSDevops,
    terminateAdvanced,
    terminateKubAKS,
} from './interface/terminateByProgram.js';
import '../../utils/env.js';

export class ResourceService {
    constructor(participantRepository, academyRepository) {
        this.participantRepository = participantRepository;
        this.academyRepository = academyRepository;
    }

    async assignParticipant(body) {
        return new Promise(async (resolve, reject) => {
            const { participantId, academyId, programId } = body;
            const academy = await this.academyRepository.find({ academyId });
            const { OpenStart } = academy[0];

            const insertParicipant = async (data) => {
                await this.participantRepository.edit(
                    { participantId },
                    { eduInfo: data, flag: 'active' }
                );
            }

            try {
                switch (programId) {
                    case '101':
                        const assignResult_101 = await assignFundamentals(OpenStart);
                        await insertParicipant(assignResult_101)
                        resolve({ code: 200 });
                        break;
                    case '102':
                        const assignResult_102 = await assignAKSDevops();
                        await insertParicipant(assignResult_102)
                        resolve({ code: 200 });
                        break;
                    case '103':
                        const assignResult_103 = await assignAdvanced(OpenStart);
                        await insertParicipant(assignResult_103)
                        resolve({ code: 200 });
                        break;
                    case '104':
                        const assignResult_104 = await assignKubAKS();
                        await insertParicipant(assignResult_104)
                        resolve({ code: 200 });
                        break;
                    default:
                        resolve({ code: 400, message: 'Invalid programId' });
                        break;
                }
            } catch (error) {
                reject({ message: error });
            }
        });
    }

    async terminateParticipant(body) {
        return new Promise(async (resolve, reject) => {
            const { participantId, programId, eduInfo } = body;
            try {
                await this.participantRepository.edit({ participantId }, { flag: 'closed' });
                switch (programId) {
                    case '101':
                        await terminateFundamentals(eduInfo);
                        resolve({ code: 200 });
                        break;
                    case '102':
                        await terminateAKSDevops(eduInfo);
                        resolve({ code: 200 });
                        break;
                    case '103':
                        await terminateAdvanced(eduInfo);
                        resolve({ code: 200 });
                        break;
                    case '104':
                        await terminateKubAKS(eduInfo);
                        resolve({ code: 200 });
                        break;
                    default:
                        resolve({ code: 400, message: 'Invalid programId' });
                        break;
                }
            } catch (error) {
                reject({ message: error });
            }
        });
    }

    async closeAcademy(body) {
        return new Promise(async (resolve, reject) => {
            const { programId, academyId } = body;
            try {
                await this.academyRepository.edit({ academyId }, { status: 'closed' });
                switch (programId) {
                    case '101':
                        await terminateKubAKS({ assignSubscriptionId: process.env.SUBSCRIPTION15 });
                        resolve({ code: 200 });
                        break;
                    case '102':
                        resolve({ code: 200 });
                        break;
                    case '103':
                        resolve({ code: 200 });
                        break;
                    case '104':
                        resolve({ code: 200 });
                        break;
                    case '201':
                        resolve({ code: 200 });
                        break;
                    default:
                        resolve({ code: 400, message: 'Invalid programId' });
                        break;
                }
            } catch (error) {
                reject({ message: error });
            }
        });
    }
}
