import { logger } from "../../utils/logger.js";

export class ProgramController {
  constructor(programService) {
    this.programService = programService;
  }

  async getPrograms(req, res) {
    try {
      logger.info("[ GET /programs ]");
      const query = req.query ?? {};
      const programs = await this.programService.getProgram(query);
      res.json(programs);
    } catch (error) {
      logger.error("[ GET /participant ]", error);
      res.status(500).json({ error: error.message });
    }
  }
}
