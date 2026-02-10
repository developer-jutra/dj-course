import mongoose, { Schema, InferSchemaType } from 'mongoose';

const routePerformanceSchema = new Schema({
    route: { type: String, required: true },
    shipments: { type: Number, required: true },
    onTimePercentage: { type: Number, required: true },
    avgCost: { type: Number, required: true },
    totalRevenue: { type: Number, required: true }
}, { 
    timestamps: true 
});

export type IRoutePerformance = InferSchemaType<typeof routePerformanceSchema>;

export const RoutePerformance: mongoose.Model<IRoutePerformance> = 
    mongoose.models.RoutePerformance || // check if model 'RoutePerformance' is already registered
    mongoose.model<IRoutePerformance>('RoutePerformance', routePerformanceSchema, 'route_performance'); // if not, create it and register it
