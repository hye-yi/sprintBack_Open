import moment from 'moment';
import '../../../utils/env.js';

export class IdNamingData {
    constructor(programId) {
        this._userPrincipalId = null;
        this.date = null;
        this.order = null;
        this._programId = programId;
    }
    setData(OpenStart, participantList) {
        this.date = moment(OpenStart).format('YYMMDD');
        this.order = participantList.addParticipant();
        this._userPrincipalId = `sprint_${this._programId}_${this.date}_${this.order}`;
        return this;
    }
    setDataAlreadyAssigned(participantList) {
        this.order = participantList.addParticipant();
        this._userPrincipalId = `sprint_${this._programId}_0000_${this.order}`;
        return this;
    }
    get RGname() {
        return `EduRG-${this._programId}-${this.date}-${this.order}`;
    }
    get userPrincipalId() {
        return this._userPrincipalId;
    }
    get programId() {
        return this._programId;
    }
    get password() {
        const pw = {
            101: 'Cl******22!',
            102: 'devops12#$',
            103: 'Advanced12#$',
        };
        return pw[this._programId];
    }
    get alreadyAssigned() {
        const result = this.#alreadyAssigned.find((i) => i.userPrincipalId == this.userPrincipalId);
        return result;
    }
    get subscriptionId() {
        const subscriptionNames = [
            '',
            process.env.SUBSCRIPTION01,
            process.env.SUBSCRIPTION02,
            process.env.SUBSCRIPTION03,
            process.env.SUBSCRIPTION04,
            process.env.SUBSCRIPTION05,
            process.env.SUBSCRIPTION06,
            process.env.SUBSCRIPTION07,
            process.env.SUBSCRIPTION08,
            process.env.SUBSCRIPTION09,
            process.env.SUBSCRIPTION10,
            process.env.SUBSCRIPTION11,
            process.env.SUBSCRIPTION12,
            process.env.SUBSCRIPTION13,
            process.env.SUBSCRIPTION14,
            process.env.SUBSCRIPTION15,
        ];
        return subscriptionNames[this.order];
    }
    #alreadyAssigned = [
        {
            userPrincipalId: 'sprint_102_0000_1',
            userPassword: 'devops12#$',
            userPrincipalName: 'sprint_102_0000_1@cl*****sprint.onmicrosoft.com',
            assignSubscriptionId: '*********-****-****-****-************',
            assignSubscriptionName: 'Cl***** Sprint 01',
            assignResourceGroup: '',
            userId: '*********-****-****-****-************',
        },
        {
            userPrincipalId: 'sprint_102_0000_2',
            userPassword: 'devops12#$',
            userPrincipalName: 'sprint_102_0000_2@cl*****sprint.onmicrosoft.com',
            assignSubscriptionId: '*********-****-****-****-************',
            assignSubscriptionName: 'Cl***** Sprint 02',
            assignResourceGroup: '',
            userId: '*********-****-****-****-************',
        },
        {
            userPrincipalId: 'sprint_102_0000_3',
            userPassword: 'devops12#$',
            userPrincipalName: 'sprint_102_0000_3@cl*****sprint.onmicrosoft.com',
            assignSubscriptionId: '*********-****-****-****-************',
            assignSubscriptionName: 'Cl***** Sprint 03',
            assignResourceGroup: '',
            userId: '*********-****-****-****-************',
        },
        {
            userPrincipalId: 'sprint_102_0000_4',
            userPassword: 'devops12#$',
            userPrincipalName: 'sprint_102_0000_4@cl*****sprint.onmicrosoft.com',
            assignSubscriptionId: '*********-****-****-****-************',
            assignSubscriptionName: 'Cl***** Sprint 04',
            assignResourceGroup: '',
            userId: '*********-****-****-****-************',
        },
        {
            userPrincipalId: 'sprint_102_0000_5',
            userPassword: 'devops12#$',
            userPrincipalName: 'sprint_102_0000_5@cl*****sprint.onmicrosoft.com',
            assignSubscriptionId: '*********-****-****-****-************',
            assignSubscriptionName: 'Cl***** Sprint 05',
            assignResourceGroup: '',
            userId: '*********-****-****-****-************',
        },
        {
            userPrincipalId: 'sprint_102_0000_6',
            userPassword: 'devops12#$',
            userPrincipalName: 'sprint_102_0000_6@cl*****sprint.onmicrosoft.com',
            assignSubscriptionId: '*********-****-****-****-************',
            assignSubscriptionName: 'Cl***** Sprint 06',
            assignResourceGroup: '',
            userId: '*********-****-****-****-************',
        },
        {
            userPrincipalId: 'sprint_102_0000_7',
            userPassword: 'devops12#$',
            userPrincipalName: 'sprint_102_0000_7@cl*****ssprint.onmicrosoft.com',
            assignSubscriptionId: '*********-****-****-****-************',
            assignSubscriptionName: 'Cl***** Sprint 07',
            assignResourceGroup: '',
            userId: '*********-****-****-****-************',
        },
        {
            userPrincipalId: 'sprint_102_0000_8',
            userPassword: 'devops12#$',
            userPrincipalName: 'sprint_102_0000_8@cl*****sprint.onmicrosoft.com',
            assignSubscriptionId: '*********-****-****-****-************',
            assignSubscriptionName: 'Cl***** Sprint 08',
            assignResourceGroup: '',
            userId: '*********-****-****-****-************',
        },
        {
            userPrincipalId: 'sprint_102_0000_9',
            userPassword: 'devops12#$',
            userPrincipalName: 'sprint_102_0000_9@cl*****sprint.onmicrosoft.com',
            assignSubscriptionId: '*********-****-****-****-************',
            assignSubscriptionName: 'Cl***** Sprint 09',
            assignResourceGroup: '',
            userId: '*********-****-****-****-************',
        },
        {
            userPrincipalId: 'sprint_102_0000_10',
            userPassword: 'devops12#$',
            userPrincipalName: 'sprint_102_0000_10@cl*****sprint.onmicrosoft.com',
            assignSubscriptionId: '*********-****-****-****-************',
            assignSubscriptionName: 'Cl***** Sprint 10',
            assignResourceGroup: '',
            userId: '*********-****-****-****-************',
        },
        {
            userPrincipalId: 'sprint_102_0000_11',
            userPassword: 'devops12#$',
            userPrincipalName: 'sprint_102_0000_11@cl*****sprint.onmicrosoft.com',
            assignSubscriptionId: '*********-****-****-****-************',
            assignSubscriptionName: 'Cl***** Sprint 11',
            assignResourceGroup: '',
            userId: '*********-****-****-****-************',
        },
        {
            userPrincipalId: 'sprint_102_0000_12',
            userPassword: 'devops12#$',
            userPrincipalName: 'sprint_102_0000_12@cl*****sprint.onmicrosoft.com',
            assignSubscriptionId: '*********-****-****-****-************',
            assignSubscriptionName: 'Cl***** Sprint 12',
            assignResourceGroup: '',
            userId: '*********-****-****-****-************',
        },
        {
            userPrincipalId: 'sprint_102_0000_13',
            userPassword: 'devops12#$',
            userPrincipalName: 'sprint_102_0000_13@cl*****sprint.onmicrosoft.com',
            assignSubscriptionId: '*********-****-****-****-************',
            assignSubscriptionName: 'Cl***** Sprint 13',
            assignResourceGroup: '',
            userId: '*********-****-****-****-************',
        },
        {
            userPrincipalId: 'sprint_102_0000_14',
            userPassword: 'devops12#$',
            userPrincipalName: 'sprint_102_0000_14@cl*****sprint.onmicrosoft.com',
            assignSubscriptionId: '*********-****-****-****-************',
            assignSubscriptionName: 'Cl***** Sprint 14',
            assignResourceGroup: '',
            userId: '*********-****-****-****-************',
        },
    ];
}
