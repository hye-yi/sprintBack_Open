import express from "express";

import { AcademyRepository } from "../domains/academy/AcademyRepository.js";

import { ParticipantRepository } from "../domains/participants/ParticipantRepository.js";
import { ParticipantService } from "../domains/participants/ParticipantService.js";
import { ParticipantController } from "../domains/participants/ParticipantController.js";
import { ProgramRepository } from "../domains/programs/ProgramRepository.js";

import { ResourceController } from "../domains/assign/ResourceController.js";
import { ResourceService } from "../domains/assign/ResourceService.js";

const router = express.Router();

const programRepository = new ProgramRepository();

const academyRepository = new AcademyRepository();

const participantRepository = new ParticipantRepository();
const participantService = new ParticipantService(participantRepository, programRepository);
const participantController = new ParticipantController(participantService);

const resourceService = new ResourceService(participantRepository, academyRepository)
const resourceController = new ResourceController(participantService, resourceService)

router
    .route("/")
    .get((req, res) => { participantController.getParticipant(req, res); })
    .post((req, res) => { participantController.addParticipant(req, res); })
    .put((req, res) => { participantController.editParticipant(req, res); })
    .delete((req, res) => { participantController.deleteParticipant(req, res); })

router
    .route("/assign")
    .put((req, res) => { resourceController.assignParticipant(req, res); })

router
    .route("/terminate")
    .put((req, res) => { resourceController.terminateParticipant(req, res); })


export default router;