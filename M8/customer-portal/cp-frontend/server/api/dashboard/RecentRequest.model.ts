import mongoose, { Schema, InferSchemaType } from 'mongoose';

const recentRequestSchema = new Schema({
    id: { type: String, required: true, unique: true },
    type: { type: String, required: true },
    status: { type: String, required: true },
    route: { type: String, required: true },
    date: { type: Date, required: true }
}, { 
    timestamps: true 
});

export type IRecentRequest = InferSchemaType<typeof recentRequestSchema>;

export const RecentRequest: mongoose.Model<IRecentRequest> = 
    mongoose.models.RecentRequest || // check if model 'RecentRequest' is already registered
    mongoose.model<IRecentRequest>('RecentRequest', recentRequestSchema, 'recent_requests'); // if not, create it and register it
