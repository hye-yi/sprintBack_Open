import { logger } from '../../utils/logger.js';
import { v4 } from 'uuid';

export class ParticipantService {
    constructor(participantRepository, programRepository) {
        this.participantRepository = participantRepository;
        this.programRepository = programRepository;
    }

    async getParticipant(query) {
        try {
            logger.info(JSON.stringify(query));
            const participant = await this.participantRepository.find(query);
            return participant;
        } catch (error) {
            throw new Error('Error while fetching participants');
        }
    }

    async addParticipant(body) {
        return new Promise(async (resolve, reject) => {
            logger.info('addParticipant');
            const { programId, email, academyId } = body;
            const isCapacityExceeded = await this.#checkCapacityExceeded(programId, academyId);
            const isDuplicated = await this.#checkDuplicated({ academyId, email });
            if (isDuplicated) reject({ message: 'Duplicated', code: 1 });
            else if (isCapacityExceeded) {
                logger.error(`Capacity exceeded`);
                reject({ message: 'Capacity exceeded', code: 2 });
            } else {
                /* Power BI 교육은 할당시스템 불필요 -> 할당 버튼 없음 */
                const flag = programId == '201' ? 'none' : 'deactive';
                const insertData = { ...body, flag, participantId: v4(), eduInfo: { userPrincipalId: '' } };
                // flag 순서 : deactive -> active -> closed
                this.participantRepository
                    .insert(insertData)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
            }
        });
    }

    async editParticipant(body) {
        return new Promise(async (resolve, reject) => {
            const { participantId, email } = body;

            const participant = await this.participantRepository.find({ participantId });
            if (email != participant[0].email) {
                //이메일이 수정되었을 때
                if (participant[0].flag != "deactive") reject({ message: 'Already Assigned', code: 2 });
                else {
                    const isDuplicated = await this.#checkDuplicated({ email });
                    if (isDuplicated) reject({ message: 'Duplicated', code: 1 });
                    else
                        this.participantRepository
                            .edit({ participantId }, body)
                            .then((res) => resolve(res))
                            .catch((err) => reject(err));
                }
            } else
                this.participantRepository
                    .edit({ participantId }, body)
                    .then((res) => resolve(res))
                    .catch((err) => reject(err));
        });
    }

    async deleteParticipant(query) {
        return new Promise(async (resolve, reject) => {
            logger.info('deleteParticipant');
            const participant = await this.participantRepository.find(query);
            if (participant[0].eduInfo.userPrincipalId) reject({ message: '삭제 불가능', code: 1 });
            else {
                const deleteResult = await this.participantRepository.delete(query);
                resolve(deleteResult);
            }
        });
    }

    /*
     * true : 등록된 교육생의 수가 수용 인원과 같거나 많거나
     */
    #checkCapacityExceeded(programId, academyId) {
        return new Promise(async (resolve, reject) => {
            const program = await this.programRepository.find({ programId });
            const { maxParticipantsPerAcademy } = program[0];
            const participant = await this.participantRepository.find({ academyId });

            /* maxParticipantsPerAcademy < 0 이면 수용 인원 제한이 없음. */
            const isExceeded = maxParticipantsPerAcademy < 0 ? false : maxParticipantsPerAcademy <= participant.length;
            resolve(isExceeded);
        });
    }

    /*
     *동일 차수 프로그램에 중복되는 이메일이 있는지 확인
     */
    #checkDuplicated(query) {
        return new Promise((resolve, reject) => {
            this.participantRepository
                .find(query)
                .then((res) => {
                    if (res.length > 0) {
                        logger.error(`Duplicated`);
                        resolve(true);
                    } else resolve(false);
                })
                .catch((error) => reject(error));
        });
    }
}
