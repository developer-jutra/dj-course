import mongoose, { Schema, InferSchemaType } from 'mongoose';

const metricsSchema = new Schema({
    totalShipments: { type: Number, required: true },
    onTimeDelivery: { type: Number, required: true },
    totalCost: { type: Number, required: true },
    storageVolume: { type: Number, required: true }
}, { 
    timestamps: true 
});

export type IMetrics = InferSchemaType<typeof metricsSchema>;

export const Metrics: mongoose.Model<IMetrics> = 
    mongoose.models.Metrics || // check if model 'Metrics' is already registered
    mongoose.model<IMetrics>('Metrics', metricsSchema, 'metrics'); // if not, create it and register it
