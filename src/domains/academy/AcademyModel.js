import mongoose from "mongoose";

const AcademySchema = new mongoose.Schema({
    programId: { type: String, required: true },
    OpenStart: { type: String, required: true },
    status: { type: String, required: true },
    academyId: { type: String, required: true },
    title: { type: String, required: true },
    instructor: { type: String },
    location: { type: String },
    reservationTime: { type: String },
}, { timestamps: true });

export const AcademyModel = mongoose.model('academy2', AcademySchema);