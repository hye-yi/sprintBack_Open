import { ProgramModel } from "./ProgramModel.js";
import { logger } from "../../utils/logger.js";

export class ProgramRepository {
  async find(query) {
    try {
      const program = await ProgramModel.find(query);
      return program;
    } catch (error) {
      throw new Error("Error while fetching Programs");
    }
  }
}
