import mongoose from 'mongoose';

const ParticipantSchema = new mongoose.Schema(
    {
        participantId: { type: String, required: true },
        academyId: { type: String, required: true },
        programId: { type: String, required: true },
        flag: { type: String, required: true },
        fullName: { type: String, required: true },
        email: { type: String, required: true },
        companyName: { type: String },
        phoneNumber: { type: String },
        eduInfo: { type: Object, required: true },
    },
    { timestamps: true }
);

export const ParticipantModel = mongoose.model('participant', ParticipantSchema);
