import mongoose from "mongoose";

const ProgramSchema = new mongoose.Schema({
  programId: { type: String, required: true },
  title: { type: String, required: true },
  maxParticipantsPerAcademy: { type: Number },
}, { timestamps: true });

export const ProgramModel = mongoose.model('programs', ProgramSchema);