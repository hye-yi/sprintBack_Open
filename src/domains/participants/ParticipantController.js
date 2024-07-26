import { logger } from "../../utils/logger.js";

export class ParticipantController {
  constructor(participantService) {
    this.participantService = participantService;
  }

  async getParticipant(req, res) {
    try {
      logger.info("[ GET /participant ]");
      const query = req.query ?? {};
      const participant = await this.participantService.getParticipant(query);
      res.json(participant);
    } catch (error) {
      logger.error("[ GET /participant ]", error);
      res.status(500).json({ error });
    }
  }

  async addParticipant(req, res) {
    try {
      logger.info("[ POST /participant ]");
      const { body } = req;
      const participant = await this.participantService.addParticipant(body);
      res.status(200).json(participant);
    } catch (error) {
      logger.error("[ GET /participant ]", error);
      res.status(500).json({ error });
    }
  }

  async editParticipant(req, res) {
    try {
      logger.info("[ PUT /participant ]");
      const { body } = req;
      const participant = await this.participantService.editParticipant(body);
      res.status(200).json(participant);
    } catch (error) {
      logger.error("[ PUT /participant ]", error);
      res.status(500).json({ error: error.message });
    }
  }

  async deleteParticipant(req, res) {
    try {
      logger.info("[ DELETE /participant ]");
      const { body } = req;
      const participant = await this.participantService.deleteParticipant(body);
      res.status(200).json(participant);
    } catch (error) {
      logger.error("[ DELETE /participant ]", error);
      res.status(500).json({ error: error.message });
    }
  }
}

