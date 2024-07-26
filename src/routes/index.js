import express from "express";

import academyRouter from './academy.js'
import participantRouter from './participant.js';
import programRouter from './program.js';

const router = express.Router();

router.use('/academy', academyRouter);
router.use('/participant', participantRouter);
router.use('/program', programRouter);

export default router;
