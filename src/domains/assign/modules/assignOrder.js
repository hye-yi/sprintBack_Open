class Node {
    constructor(value) {
        this.value = value;
        this.next = null;
    }
}

class SingletonParticipantOrder {
    constructor(limit) {
        this.limit = limit;
        this.head = null;
        this.tail = null;
        this.number = 1;
    }

    addParticipant() {
        if (this.number <= this.limit) {
            const newNode = new Node(this.number);
            if (!this.head) {
                this.head = newNode;
                this.tail = newNode;
            } else {
                this.tail.next = newNode;
                this.tail = newNode;
            }
            return this.number++;
        } else {
            return -1; // 모든 번호가 할당됨
        }
    }

    cancelParticipant(number) {
        let current = this.head;
        let previous = null;

        while (current !== null) {
            if (current.value === number) {
                if (previous === null) {
                    this.head = current.next;
                } else {
                    previous.next = current.next;
                }
                return;
            }
            previous = current;
            current = current.next;
        }
    }
}

function createParticipantOrderFactory() {
    const instances = [];

    return {
        createParticipantOrder: function (limit) {
            let instance = instances.find((inst) => !inst.used);
            if (!instance) {
                instance = new SingletonParticipantOrder(limit);
                instances.push({ instance, used: true });
            } else {
                instance.used = true;
            }
            return instance;
        },
    };
}

const factory = createParticipantOrderFactory();

export const FundamentalsOrder = factory.createParticipantOrder(100);
export const AKSDevOrder = factory.createParticipantOrder(14);
export const AdvancedOrder = factory.createParticipantOrder(100);
export const KubAKSOrder = factory.createParticipantOrder(14);
