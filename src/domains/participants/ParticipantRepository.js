import { ParticipantModel } from "./ParticipantModel.js";
import { logger } from "../../utils/logger.js";

export class ParticipantRepository {
  async find(query) {
    try {
      const participant = await ParticipantModel.find(query);
      return participant;
    } catch (error) {
      throw new Error("Error while fetching Participant");
    }
  }

  async insert(data) {
    return new Promise(async (resolve, reject) => {
      const participant = new ParticipantModel(data);
      participant.save()
        .then((res) => resolve(res))
        .catch((err) => {
          logger.error(`DB Error: ${err}`);
          reject(err);
        });
    });
  }

  async edit(query, data) {
    return new Promise(async (resolve, reject) => {
      const updateResult = await ParticipantModel.updateOne(query, data);
      resolve(updateResult);
    });
  }

  async delete(query) {
    return new Promise(async (resolve, reject) => {
      const deleteResult = await ParticipantModel.deleteOne(query);
      resolve(deleteResult);
    });
  }
}
