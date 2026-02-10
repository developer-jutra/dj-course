import mongoose, { Schema, InferSchemaType } from 'mongoose';

const dashboardStatSchema = new Schema({
    name: { type: String, required: true },
    value: { type: String, required: true },
    iconName: { type: String, required: true },
    color: { type: String, required: true },
    visible: { type: Boolean, required: true, default: true }
}, { 
    timestamps: true 
});

export type IDashboardStat = InferSchemaType<typeof dashboardStatSchema>;

export const DashboardStat: mongoose.Model<IDashboardStat> = 
    mongoose.models.DashboardStat || // check if model 'DashboardStat' is already registered
    mongoose.model<IDashboardStat>('DashboardStat', dashboardStatSchema, 'dashboard_stats'); // if not, create it and register it
