import { logger } from '../../utils/logger.js';
import { v4 } from 'uuid';

export class AcademyService {
    constructor(academyRepository, participantRepository) {
        this.academyRepository = academyRepository;
        this.participantRepository = participantRepository;
    }

    async getAcademy(query) {
        return new Promise(async (resolve, reject) => {
            logger.info('getAcademy: ', JSON.stringify(query));
            const academy = await this.academyRepository.find(query);
            resolve(academy);
        });
    }

    async addAcademy(body) {
        return new Promise(async (resolve, reject) => {
            logger.info('addAcademy');
            const { programId, OpenStart } = body;
            const isDuplicated = await this.#checkDuplicated({ programId, OpenStart });

            if (isDuplicated) reject({ message: 'Duplicated', code: 1 });
            else {
                const insertData = { ...body, status: 'active', academyId: v4() };
                this.academyRepository
                    .insert(insertData)
                    .then((res) => resolve(res))
                    .catch((err) => {
                        logger.error(`err : ${err}`);
                        reject({ message: 'Service Error', code: 2 });
                    });
            }
        });
    }

    async editAcademy(body) {
        return new Promise(async (resolve, reject) => {
            const { academyId, OpenStart, programId } = body;
            logger.info(`editAcademy: ${academyId}`);

            const academy = await this.academyRepository.find({ OpenStart, programId });

            if (academy.length == 0) {
                //교육 시작 날짜를 바꾼 경우
                this.academyRepository
                    .edit({ academyId }, body)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            } else if (academy[0].academyId != academyId)
                reject({ message: 'Duplicated', code: 1 }); //교육 시작 날짜가 동일한 교육이 있는 경우
            else
                this.academyRepository
                    .edit({ academyId }, body)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
        });
    }

    async deleteAcademy(query) {
        return new Promise(async (resolve, reject) => {
            logger.info('deleteAcademy');
            const enrolledParticipant = await this.participantRepository.find(query);
            /* 해당 교육에 등록된 참석자가 없어야 교육 삭제 가능 */
            if (enrolledParticipant.length == 0) {
                const deleteResult = await this.academyRepository.delete(query);
                resolve(deleteResult);
            } else reject({ message: 'There are enrolled students in the education.', code: 1 });
        });
    }

    #checkDuplicated(query) {
        return new Promise((resolve, reject) => {
            this.academyRepository
                .find(query)
                .then((res) => {
                    if (res.length > 0) {
                        logger.info(`Duplicated`);
                        resolve(true);
                    } else resolve(false);
                })
                .catch((error) => reject(error));
        });
    }
}
