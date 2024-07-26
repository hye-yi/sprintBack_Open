import { logger } from "../../utils/logger.js";

export class ResourceController {
  constructor(participantService, resourceService) {
    this.participantService = participantService;
    this.resourceService = resourceService;
  }

  async assignParticipant(req, res) {
    try {
      logger.info("[ PUT /assign ]");
      const { body } = req;
      const assign = await this.resourceService.assignParticipant(body);
      res.json(assign);
    } catch (error) {
      logger.error("[ PUT /assign ]", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  async terminateParticipant(req, res) {
    try {
      logger.info("[ PUT /terminate ]");
      const { body } = req;
      const terminate = await this.resourceService.terminateParticipant(body);
      res.json(terminate);
    } catch (error) {
      logger.error("[ PUT /terminate ]", error.message);
      res.status(500).json({ error: error.message });
    }
  }

  async closeAcademy(req, res) {
    try {
      logger.info("[ PUT /academy/close ]");
      const { body } = req;
      const terminate = await this.resourceService.closeAcademy(body);
      res.json(terminate);
    } catch (error) {
      logger.error("[ PUT /academy/close ]", error.message);
      res.status(500).json({ error: error.message });
    }
  }
}