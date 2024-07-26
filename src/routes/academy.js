import express from "express";

import { ProgramRepository } from "../domains/programs/ProgramRepository.js";

import { ParticipantRepository } from "../domains/participants/ParticipantRepository.js";
import { ParticipantService } from "../domains/participants/ParticipantService.js";

import { AcademyRepository } from "../domains/academy/AcademyRepository.js";
import { AcademyService } from "../domains/academy/AcademyService.js";
import { AcademyController } from "../domains/academy/AcademyController.js";

import { ResourceController } from "../domains/assign/ResourceController.js";
import { ResourceService } from "../domains/assign/ResourceService.js";

const router = express.Router();

const programRepository = new ProgramRepository();

const participantRepository = new ParticipantRepository();
const participantService = new ParticipantService(participantRepository, programRepository);

const academyRepository = new AcademyRepository();
const academyService = new AcademyService(academyRepository, participantRepository);
const academyController = new AcademyController(academyService, participantService);

const resourceService = new ResourceService(participantRepository, academyRepository)
const resourceController = new ResourceController(participantService, resourceService)

router
    .route("/")
    .get((req, res) => { academyController.getAcademy(req, res); })
    .post((req, res) => { academyController.addAcademy(req, res); })
    .put((req, res) => { academyController.editAcademy(req, res); })
    .delete((req, res) => { academyController.deleteAcademy(req, res); })


router
    .route("/close")
    .put((req, res) => { resourceController.closeAcademy(req, res); })

export default router;
