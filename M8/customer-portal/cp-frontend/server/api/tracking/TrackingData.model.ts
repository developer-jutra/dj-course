import mongoose, { Schema, InferSchemaType } from 'mongoose';

const GeoJSONGeometrySchema = new Schema({
  type: {
    type: String,
    enum: ['Point', 'LineString', 'Polygon', 'MultiPoint', 'MultiLineString', 'MultiPolygon'],
    required: true
  },
  coordinates: { type: Schema.Types.Mixed, required: true }
}, { _id: false });

const FeatureSchema = new Schema({
  type: { type: String, default: 'Feature' },
  geometry: { type: GeoJSONGeometrySchema, required: true },
  properties: { type: Schema.Types.Mixed, required: true }
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
  type: { type: String, default: 'FeatureCollection' },
  trackingNumber: { type: String, required: true, unique: true },
  status: { type: String, required: true },
  serviceType: { type: String, required: true },
  origin: { type: String, required: true },
  destination: { type: String, required: true },
  estimatedDelivery: String,
  actualDelivery: String,
  updates: { type: [TrackingUpdateSchema], required: true },
  features: { type: [FeatureSchema], required: true }
});

schema.index({ 'features.geometry': '2dsphere' });

export type GeoJSONGeometry = InferSchemaType<typeof GeoJSONGeometrySchema>;
export type GeoJSONFeature = InferSchemaType<typeof FeatureSchema>;
export type TrackingUpdate = InferSchemaType<typeof TrackingUpdateSchema>;
export type ITrackingData = InferSchemaType<typeof schema>;

export const TrackingData: mongoose.Model<ITrackingData> =
  mongoose.models.TrackingData ||
  mongoose.model<ITrackingData>('TrackingData', schema, 'tracking_data');
