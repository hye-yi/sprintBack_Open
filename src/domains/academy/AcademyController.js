import { logger } from "../../utils/logger.js";

export class AcademyController {
  constructor(academyService, participantService) {
    this.academyService = academyService;
    this.participantService = participantService;
  }

  async getAcademy(req, res) {
    try {
      logger.info("[ GET /academy ]");
      const query = req.query ?? {};
      const academy = await this.academyService.getAcademy(query);
      const result = await Promise.all(
        academy.map(async ({ academyId, _doc }) => {
          const participant = await this.participantService.getParticipant({ academyId, });
          return { ..._doc, participantCnt: participant.length };
        })
      );
      res.json(result);
    } catch (error) {
      logger.error("[ GET /academy ]", error);
      res.status(500).json({ error: error.message });
    }
  }

  async addAcademy(req, res) {
    try {
      logger.info("[ POST /academy ]");
      const { body } = req;
      const academy = await this.academyService.addAcademy(body);
      res.status(200).json(academy);
    } catch (error) {
      logger.error("[ POST /academy ]", error);
      res.status(500).json({ error: error.message });
    }
  }

  async editAcademy(req, res) {
    try {
      logger.info("[ PUT /academy ]");
      const { body } = req;
      const academy = await this.academyService.editAcademy(body);
      res.status(200).json(academy);
    } catch (error) {
      logger.error("[ PUT /academy ]", error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteAcademy(req, res) {
    try {
      logger.info("[ DELETE /academy ]");
      const { body } = req;
      const academy = await this.academyService.deleteAcademy(body);
      res.status(200).json(academy);
    } catch (error) {
      logger.error("[ DELETE /academy ]", error);
      res.status(500).json({ error: error.message });
    }
  }
}
