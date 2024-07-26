import express from "express";

import { ProgramRepository } from "../domains/programs/ProgramRepository.js";
import { ProgramService } from "../domains/programs/ProgramService.js";
import { ProgramController } from "../domains/programs/ProgramController.js";

const router = express.Router();

const programRepository = new ProgramRepository();
const programService = new ProgramService(programRepository);
const programController = new ProgramController(programService);

router
    .route("/")
    .get((req, res) => { programController.getPrograms(req, res) });

export default router;