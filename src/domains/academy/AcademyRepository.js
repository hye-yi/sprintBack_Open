import { AcademyModel } from "./AcademyModel.js";
import { logger } from "../../utils/logger.js";

export class AcademyRepository {
  async find(query) {
    return new Promise(async (resolve, reject) => {
      const academy = await AcademyModel.find(query).sort({ "OpenStart": 1 })
      resolve(academy);
    });
  }

  async insert(data) {
    return new Promise(async (resolve, reject) => {
      const academy = new AcademyModel(data);
      academy.save()
        .then((res) => resolve(res))
        .catch((err) => {
          logger.error(`DB Error: ${err}`);
          reject(err);
        });
    });
  }

  async edit(query, data) {
    return new Promise(async (resolve, reject) => {
      const updateResult = await AcademyModel.updateOne(query, data);
      resolve(updateResult);
    });
  }

  async delete(query) {
    return new Promise(async (resolve, reject) => {
      const deleteResult = await AcademyModel.deleteOne(query);
      resolve(deleteResult);
    });
  }
}
