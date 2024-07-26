import { logger } from "../../utils/logger.js";

export class ProgramService {
  constructor(programRepository) {
    this.programRepository = programRepository;
  }

  async getProgram(query) {
    try {
      logger.info(JSON.stringify(query));
      const programs = await this.programRepository.find(query);
      return programs;
    } catch (error) {
      throw new Error("Error while fetching programs");
    }
  }
}
