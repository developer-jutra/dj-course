// A temporary type that reflects the flattened structure expected by the UI
// This should be replaced by a proper data transformation layer
export type UIShipment = {
    id: string;
    driver: string;
    status: string;
    origin: string;
    destination: string;
    eta: string;
    elapsedTime?: string;
    distanceCovered?: string;
    totalDistance?: string;
    delay?: boolean;
    estimatedDelay?: string | null;
};
