import mongoose, { Schema, InferSchemaType } from 'mongoose';

const RoutePointSchema = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  name: { type: String, required: true }
}, { _id: false });

const CurrentPositionSchema = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true }
}, { _id: false });

const TrackingEventSchema = new Schema({
  lat: { type: Number, required: true },
  lng: { type: Number, required: true },
  type: {
    type: String,
    enum: ['pickup', 'delivery', 'refuel', 'rest', 'warehouse', 'customs', 'current'],
    required: true
  },
  name: { type: String, required: true },
  description: { type: String, required: true },
  estimatedTime: String,
  actualTime: String,
  isCompleted: { type: Boolean, required: true }
}, { _id: false });

const TrackingUpdateSchema = new Schema({
  id: { type: String, required: true },
  timestamp: { type: Date, required: true },
  status: { type: String, required: true },
  location: String,
  description: { type: String, required: true },
  estimatedTime: Schema.Types.Mixed,
  actualTime: Schema.Types.Mixed
}, { _id: false });

const schema = new Schema({
  trackingNumber: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  serviceType: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  route: { type: [RoutePointSchema], required: true },
  currentPosition: { type: CurrentPositionSchema, required: true },
  trackingEvents: { type: [TrackingEventSchema], required: true },
  updates: { type: [TrackingUpdateSchema], required: true },
  estimatedDelivery: String,
  actualDelivery: String
});

export type RoutePoint = InferSchemaType<typeof RoutePointSchema>;
export type CurrentPosition = InferSchemaType<typeof CurrentPositionSchema>;
export type TrackingEvent = InferSchemaType<typeof TrackingEventSchema>;
export type TrackingUpdate = InferSchemaType<typeof TrackingUpdateSchema>;
export type ITrackingData = InferSchemaType<typeof schema>;

export const TrackingData: mongoose.Model<ITrackingData> =
  mongoose.models.TrackingData ||
  mongoose.model<ITrackingData>('TrackingData', schema, 'tracking_data');
