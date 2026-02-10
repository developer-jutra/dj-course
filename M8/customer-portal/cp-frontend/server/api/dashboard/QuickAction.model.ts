import mongoose, { Schema, InferSchemaType } from 'mongoose';

const quickActionSchema = new Schema({
    name: { type: String, required: true },
    description: { type: String, required: true },
    iconName: { type: String, required: true },
    href: { type: String, required: true }
}, { 
    timestamps: true 
});

export type IQuickAction = InferSchemaType<typeof quickActionSchema>;

export const QuickAction: mongoose.Model<IQuickAction> = 
    mongoose.models.QuickAction || // check if model 'QuickAction' is already registered
    mongoose.model<IQuickAction>('QuickAction', quickActionSchema, 'quick_actions'); // if not, create it and register it
