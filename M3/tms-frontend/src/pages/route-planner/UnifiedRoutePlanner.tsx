import React, { useState, useCallback, useEffect } from 'react';
import { LogisticsMap } from './LogisticsMap';
import { RouteControls } from './RouteControls';
import { RouteSummary } from './RouteSummary';
import { VehicleStatus } from './VehicleStatus';
import { RouteData, RoutePoint, Vehicle, Coordinates, Shipment } from '../../model/shipments';
import { Driver, DriverRoute } from '../../model/drivers';
import { Vehicle as VehicleType } from '../../model/vehicles';
import { calculateRouteDistance, estimateTravelTime, generateOptimizedRoute, addRestStops } from './routeUtils';
import { ArrowLeft, Filter, Route as RouteIcon, User, Truck, MapPin, Clock, Search, X, Navigation, AlertTriangle, CheckCircle } from 'lucide-react';

export type RouteContext = 'active-shipments' | 'driver-routes' | 'vehicle-routes' | 'route-planning';

interface UnifiedRoutePlannerProps {
  context: RouteContext;
  contextEntity?: Driver | VehicleType; // The specific driver or vehicle
  shipments: Shipment[];
  drivers?: Driver[];
  vehicles?: VehicleType[];
  onBack?: () => void;
  onShipmentUpdate?: (shipment: Shipment) => void;
  onContextChange?: (context: RouteContext, entity?: Driver | VehicleType) => void;
}

interface ContextOption {
  value: RouteContext;
  label: string;
  icon: React.ReactNode;
}

interface EntitySuggestion {
  id: string;
  name: string;
  type: 'driver' | 'vehicle';
  entity: Driver | VehicleType;
}

// Convert driver route to shipment format for unified display
const convertDriverRouteToShipment = (driverRoute: DriverRoute, driver: Driver): Shipment => {
  const routePoints: RoutePoint[] = driverRoute.points.map((point, index) => ({
    id: `${driverRoute.id}-point-${index}`,
    coordinates: { lat: point.lat, lng: point.lng },
    type: point.type === 'start' ? 'pickup' : point.type === 'end' ? 'delivery' : 'rest',
    name: point.name,
    address: point.name,
    estimatedArrival: point.timestamp,
    duration: 60,
    notes: `Driver route point - ${point.type}`
  }));

  const vehicle: Vehicle = {
    id: `driver-vehicle-${driver.id}`,
    coordinates: driver.currentLocation ? 
      { lat: driver.currentLocation.lat, lng: driver.currentLocation.lng } :
      { lat: 52.2297, lng: 21.0122 },
    heading: 180,
    speed: driverRoute.status === 'active' ? 75 : 0,
    driver: driver.name,
    plateNumber: 'DRIVER-VEHICLE',
  };

  const routeData: RouteData = {
    id: driverRoute.id,
    name: driverRoute.name,
    points: routePoints,
    vehicle,
    totalDistance: driverRoute.distance,
    estimatedDuration: Math.floor(driverRoute.distance / 80 * 60),
    status: driverRoute.status === 'active' ? 'active' : 
            driverRoute.status === 'completed' ? 'completed' : 'planned',
    startTime: driverRoute.startDate,
    estimatedCompletion: driverRoute.endDate
  };

  return {
    id: `shipment-${driverRoute.id}`,
    name: driverRoute.name,
    customer: `Driver Route - ${driver.name}`,
    priority: driverRoute.status === 'active' ? 'high' : 'medium',
    route: routeData,
    createdAt: driverRoute.startDate,
    dueDate: driverRoute.endDate
  };
};

// Generate vehicle routes as shipments
const generateVehicleRouteShipments = (vehicle: VehicleType): Shipment[] => {
  const routes: Shipment[] = [];
  const now = new Date();
  
  // Generate some sample routes for the vehicle
  for (let i = 0; i < 8; i++) {
    const startDate = new Date(now.getTime() - (i * 5 + Math.random() * 3) * 24 * 60 * 60 * 1000);
    const endDate = new Date(startDate.getTime() + (1 + Math.random() * 2) * 24 * 60 * 60 * 1000);
    
    const origins = ['Warszawa', 'Kraków', 'Gdańsk', 'Wrocław', 'Poznań'];
    const destinations = ['Łódź', 'Szczecin', 'Lublin', 'Katowice', 'Bydgoszcz'];
    
    const origin = origins[Math.floor(Math.random() * origins.length)];
    const destination = destinations[Math.floor(Math.random() * destinations.length)];
    const distance = Math.floor(Math.random() * 800 + 200);
    
    const routePoints: RoutePoint[] = [
      {
        id: `vehicle-route-${vehicle.id}-${i}-start`,
        coordinates: { lat: 52.2297 + (Math.random() - 0.5) * 2, lng: 21.0122 + (Math.random() - 0.5) * 4 },
        type: 'pickup',
        name: origin,
        address: `${origin}, Polska`,
        estimatedArrival: startDate,
        duration: 60
      },
      {
        id: `vehicle-route-${vehicle.id}-${i}-end`,
        coordinates: { lat: 50.0647 + (Math.random() - 0.5) * 2, lng: 19.9450 + (Math.random() - 0.5) * 4 },
        type: 'delivery',
        name: destination,
        address: `${destination}, Polska`,
        estimatedArrival: endDate,
        duration: 45
      }
    ];

    const vehicleForRoute: Vehicle = {
      id: vehicle.id,
      coordinates: vehicle.currentLocation ? 
        { lat: vehicle.currentLocation.lat, lng: vehicle.currentLocation.lng } :
        { lat: 52.2297, lng: 21.0122 },
      heading: 180,
      speed: i === 0 ? 85 : 0,
      driver: vehicle.currentDriver || 'Unassigned',
      plateNumber: vehicle.plateNumber,
    };

    const routeData: RouteData = {
      id: `vehicle-route-${vehicle.id}-${i}`,
      name: `${origin} → ${destination}`,
      points: routePoints,
      vehicle: vehicleForRoute,
      totalDistance: distance,
      estimatedDuration: Math.floor(distance / 80 * 60),
      status: i === 0 ? 'active' : i < 3 ? 'completed' : 'completed',
      startTime: startDate,
      estimatedCompletion: endDate
    };

    routes.push({
      id: `vehicle-shipment-${vehicle.id}-${i}`,
      name: `${origin} → ${destination}`,
      customer: `Vehicle Route - ${vehicle.plateNumber}`,
      priority: i === 0 ? 'high' : 'medium',
      route: routeData,
      createdAt: startDate,
      dueDate: endDate
    });
  }
  
  return routes.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
};

// Create a default route for route planning mode
const createDefaultPlanningRoute = (): Shipment => {
  const defaultVehicle: Vehicle = {
    id: 'planning-vehicle',
    coordinates: { lat: 52.2297, lng: 21.0122 }, // Warsaw
    heading: 0,
    speed: 0,
    driver: 'Select Driver',
    plateNumber: 'Select Vehicle',
  };

  const defaultRoute: RouteData = {
    id: 'planning-route',
    name: 'New Route Plan',
    points: [],
    vehicle: defaultVehicle,
    totalDistance: 0,
    estimatedDuration: 0,
    status: 'planned',
    startTime: new Date(),
    estimatedCompletion: new Date()
  };

  return {
    id: 'planning-shipment',
    name: 'New Route Plan',
    customer: 'Route Planning',
    priority: 'medium',
    route: defaultRoute,
    createdAt: new Date(),
    dueDate: new Date()
  };
};

export const UnifiedRoutePlanner: React.FC<UnifiedRoutePlannerProps> = ({
  context: initialContext,
  contextEntity: initialContextEntity,
  shipments: initialShipments,
  drivers = [],
  vehicles = [],
  onBack,
  onShipmentUpdate,
  onContextChange
}) => {
  const [context, setContext] = useState<RouteContext>(initialContext);
  const [contextEntity, setContextEntity] = useState<Driver | VehicleType | undefined>(initialContextEntity);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'completed' | 'planned' | 'delayed'>('all');
  const [entitySearchTerm, setEntitySearchTerm] = useState('');
  const [showEntityDropdown, setShowEntityDropdown] = useState(false);
  const [selectedShipment, setSelectedShipment] = useState<Shipment | null>(null);
  const [pendingPointType, setPendingPointType] = useState<RoutePoint['type'] | null>(null);
  const [planningRoute, setPlanningRoute] = useState<Shipment>(createDefaultPlanningRoute());

  const contextOptions: ContextOption[] = [
    {
      value: 'route-planning',
      label: 'Route Planning',
      icon: <Navigation className="w-4 h-4" />
    },
    {
      value: 'active-shipments',
      label: 'Active Shipments',
      icon: <RouteIcon className="w-4 h-4" />
    },
    {
      value: 'driver-routes',
      label: 'Driver Routes',
      icon: <User className="w-4 h-4" />
    },
    {
      value: 'vehicle-routes',
      label: 'Vehicle Routes',
      icon: <Truck className="w-4 h-4" />
    }
  ];

  // Initialize entity search term when contextEntity is provided
  useEffect(() => {
    if (initialContextEntity) {
      if ('name' in initialContextEntity) {
        // It's a driver
        setEntitySearchTerm(initialContextEntity.name);
      } else if ('plateNumber' in initialContextEntity) {
        // It's a vehicle
        setEntitySearchTerm(`${initialContextEntity.plateNumber} - ${initialContextEntity.make} ${initialContextEntity.model}`);
      }
    }
  }, [initialContextEntity]);

  // Determine the shipments to display based on context
  const getContextualShipments = (): Shipment[] => {
    switch (context) {
      case 'route-planning':
        return []; // No shipments in planning mode
      
      case 'driver-routes':
        if (contextEntity && 'routes' in contextEntity) {
          return (contextEntity as Driver).routes.map(route => 
            convertDriverRouteToShipment(route, contextEntity as Driver)
          );
        }
        return [];
      
      case 'vehicle-routes':
        if (contextEntity && 'plateNumber' in contextEntity) {
          return generateVehicleRouteShipments(contextEntity as VehicleType);
        }
        return [];
      
      case 'active-shipments':
      default:
        return initialShipments;
    }
  };

  const [contextualShipments, setContextualShipments] = useState<Shipment[]>(getContextualShipments());

  // Update contextual shipments when context or entity changes
  useEffect(() => {
    const newShipments = getContextualShipments();
    setContextualShipments(newShipments);
    
    if (context === 'route-planning') {
      setSelectedShipment(planningRoute);
    } else if (newShipments.length > 0) {
      setSelectedShipment(newShipments[0]);
    } else {
      setSelectedShipment(null);
    }
  }, [context, contextEntity, initialShipments, planningRoute]);

  // Generate entity suggestions based on search term
  const getEntitySuggestions = (): EntitySuggestion[] => {
    if (context === 'active-shipments' || context === 'route-planning' || !entitySearchTerm) return [];

    const suggestions: EntitySuggestion[] = [];

    if (context === 'driver-routes') {
      drivers
        .filter(driver => driver.name.toLowerCase().includes(entitySearchTerm.toLowerCase()))
        .slice(0, 5)
        .forEach(driver => {
          suggestions.push({
            id: driver.id,
            name: driver.name,
            type: 'driver',
            entity: driver
          });
        });
    } else if (context === 'vehicle-routes') {
      vehicles
        .filter(vehicle => 
          vehicle.plateNumber.toLowerCase().includes(entitySearchTerm.toLowerCase()) ||
          `${vehicle.make} ${vehicle.model}`.toLowerCase().includes(entitySearchTerm.toLowerCase())
        )
        .slice(0, 5)
        .forEach(vehicle => {
          suggestions.push({
            id: vehicle.id,
            name: `${vehicle.plateNumber} - ${vehicle.make} ${vehicle.model}`,
            type: 'vehicle',
            entity: vehicle
          });
        });
    }

    return suggestions;
  };

  const entitySuggestions = getEntitySuggestions();

  // Simulate vehicle movement for active shipments
  useEffect(() => {
    if (!selectedShipment || context === 'route-planning') return;

    const interval = setInterval(() => {
      setSelectedShipment(prev => {
        if (!prev || prev.route.status !== 'active') return prev;

        // Simple simulation: move vehicle slightly towards the first point
        const targetPoint = prev.route.points[0];
        if (!targetPoint) return prev;

        const currentLat = prev.route.vehicle.coordinates.lat;
        const currentLng = prev.route.vehicle.coordinates.lng;
        const targetLat = targetPoint.coordinates.lat;
        const targetLng = targetPoint.coordinates.lng;

        const newLat = currentLat + (targetLat - currentLat) * 0.01;
        const newLng = currentLng + (targetLng - currentLng) * 0.01;

        return {
          ...prev,
          route: {
            ...prev.route,
            vehicle: {
              ...prev.route.vehicle,
              coordinates: { lat: newLat, lng: newLng },
            }
          }
        };
      });
    }, 5000); // Update every 5 seconds

    return () => clearInterval(interval);
  }, [selectedShipment, context]);

  const handleContextChange = (newContext: RouteContext) => {
    setContext(newContext);
    setContextEntity(undefined);
    setEntitySearchTerm('');
    setShowEntityDropdown(false);
    setPendingPointType(null); // Clear pending point type when context changes
    onContextChange?.(newContext);
  };

  const handleEntitySelect = (suggestion: EntitySuggestion) => {
    setContextEntity(suggestion.entity);
    setEntitySearchTerm(suggestion.name);
    setShowEntityDropdown(false);
    onContextChange?.(context, suggestion.entity);
  };

  const handleEntityClear = () => {
    setContextEntity(undefined);
    setEntitySearchTerm('');
    onContextChange?.(context);
  };

  const handleAddPoint = useCallback((coordinates: Coordinates, type: RoutePoint['type']) => {
    console.log('handleAddPoint called:', { coordinates, type, context });
    
    const targetShipment = context === 'route-planning' ? planningRoute : selectedShipment;
    if (!targetShipment) {
      console.log('No target shipment found');
      return;
    }

    const newPoint: RoutePoint = {
      id: `point-${Date.now()}`,
      coordinates,
      type,
      name: `New ${type.charAt(0).toUpperCase() + type.slice(1)}`,
      address: `${coordinates.lat.toFixed(4)}, ${coordinates.lng.toFixed(4)}`,
      estimatedArrival: new Date(Date.now() + targetShipment.route.points.length * 2 * 60 * 60 * 1000),
      duration: type === 'rest' ? 45 : type === 'fuel' ? 30 : 60,
      notes: type === 'rest' ? 'Driver rest period' : undefined
    };

    console.log('Creating new point:', newPoint);

    const updateFunction = (prev: Shipment | null) => {
      if (!prev) return prev;
      
      const newPoints = [...prev.route.points, newPoint];
      const totalDistance = calculateRouteDistance(newPoints);
      const estimatedDuration = estimateTravelTime(totalDistance);

      const updatedShipment = {
        ...prev,
        route: {
          ...prev.route,
          points: newPoints,
          totalDistance,
          estimatedDuration
        }
      };

      console.log('Updated shipment:', updatedShipment);

      if (context !== 'route-planning') {
        onShipmentUpdate?.(updatedShipment);
      }
      return updatedShipment;
    };

    if (context === 'route-planning') {
      setPlanningRoute(prev => updateFunction(prev) || prev);
    } else {
      setSelectedShipment(updateFunction);
    }

    setPendingPointType(null);
  }, [selectedShipment, planningRoute, context, onShipmentUpdate]);

  const handleRemovePoint = useCallback((pointId: string) => {
    const targetShipment = context === 'route-planning' ? planningRoute : selectedShipment;
    if (!targetShipment) return;

    const updateFunction = (prev: Shipment | null) => {
      if (!prev) return prev;
      
      const newPoints = prev.route.points.filter(p => p.id !== pointId);
      const totalDistance = calculateRouteDistance(newPoints);
      const estimatedDuration = estimateTravelTime(totalDistance);

      const updatedShipment = {
        ...prev,
        route: {
          ...prev.route,
          points: newPoints,
          totalDistance,
          estimatedDuration
        }
      };

      if (context !== 'route-planning') {
        onShipmentUpdate?.(updatedShipment);
      }
      return updatedShipment;
    };

    if (context === 'route-planning') {
      setPlanningRoute(prev => updateFunction(prev) || prev);
    } else {
      setSelectedShipment(updateFunction);
    }
  }, [selectedShipment, planningRoute, context, onShipmentUpdate]);

  const handleEditPoint = useCallback((updatedPoint: RoutePoint) => {
    const targetShipment = context === 'route-planning' ? planningRoute : selectedShipment;
    if (!targetShipment) return;

    const updateFunction = (prev: Shipment | null) => {
      if (!prev) return prev;
      
      const newPoints = prev.route.points.map(p => 
        p.id === updatedPoint.id ? updatedPoint : p
      );
      const totalDistance = calculateRouteDistance(newPoints);
      const estimatedDuration = estimateTravelTime(totalDistance);

      const updatedShipment = {
        ...prev,
        route: {
          ...prev.route,
          points: newPoints,
          totalDistance,
          estimatedDuration
        }
      };

      if (context !== 'route-planning') {
        onShipmentUpdate?.(updatedShipment);
      }
      return updatedShipment;
    };

    if (context === 'route-planning') {
      setPlanningRoute(prev => updateFunction(prev) || prev);
    } else {
      setSelectedShipment(updateFunction);
    }
  }, [selectedShipment, planningRoute, context, onShipmentUpdate]);

  const handleReorderPoints = useCallback((newPoints: RoutePoint[]) => {
    const targetShipment = context === 'route-planning' ? planningRoute : selectedShipment;
    if (!targetShipment) return;

    const updateFunction = (prev: Shipment | null) => {
      if (!prev) return prev;
      
      const totalDistance = calculateRouteDistance(newPoints);
      const estimatedDuration = estimateTravelTime(totalDistance);

      const updatedShipment = {
        ...prev,
        route: {
          ...prev.route,
          points: newPoints,
          totalDistance,
          estimatedDuration
        }
      };

      if (context !== 'route-planning') {
        onShipmentUpdate?.(updatedShipment);
      }
      return updatedShipment;
    };

    if (context === 'route-planning') {
      setPlanningRoute(prev => updateFunction(prev) || prev);
    } else {
      setSelectedShipment(updateFunction);
    }
  }, [selectedShipment, planningRoute, context, onShipmentUpdate]);

  const handleOptimizeRoute = useCallback(() => {
    const targetShipment = context === 'route-planning' ? planningRoute : selectedShipment;
    if (!targetShipment) return;

    const updateFunction = (prev: Shipment | null) => {
      if (!prev) return prev;
      
      const optimizedPoints = generateOptimizedRoute(prev.route.points);
      const totalDistance = calculateRouteDistance(optimizedPoints);
      const estimatedDuration = estimateTravelTime(totalDistance);

      const updatedShipment = {
        ...prev,
        route: {
          ...prev.route,
          points: optimizedPoints,
          totalDistance,
          estimatedDuration
        }
      };

      if (context !== 'route-planning') {
        onShipmentUpdate?.(updatedShipment);
      }
      return updatedShipment;
    };

    if (context === 'route-planning') {
      setPlanningRoute(prev => updateFunction(prev) || prev);
    } else {
      setSelectedShipment(updateFunction);
    }
  }, [selectedShipment, planningRoute, context, onShipmentUpdate]);

  const handleAddRestStops = useCallback(() => {
    const targetShipment = context === 'route-planning' ? planningRoute : selectedShipment;
    if (!targetShipment) return;

    const updateFunction = (prev: Shipment | null) => {
      if (!prev) return prev;
      
      const pointsWithRest = addRestStops(prev.route.points);
      const totalDistance = calculateRouteDistance(pointsWithRest);
      const estimatedDuration = estimateTravelTime(totalDistance);

      const updatedShipment = {
        ...prev,
        route: {
          ...prev.route,
          points: pointsWithRest,
          totalDistance,
          estimatedDuration
        }
      };

      if (context !== 'route-planning') {
        onShipmentUpdate?.(updatedShipment);
      }
      return updatedShipment;
    };

    if (context === 'route-planning') {
      setPlanningRoute(prev => updateFunction(prev) || prev);
    } else {
      setSelectedShipment(updateFunction);
    }
  }, [selectedShipment, planningRoute, context, onShipmentUpdate]);

  const handleAddPointOfType = useCallback((type: RoutePoint['type']) => {
    console.log('handleAddPointOfType called:', type);
    setPendingPointType(type);
  }, []);

  const handleShipmentSelect = useCallback((shipment: Shipment) => {
    setSelectedShipment(shipment);
    setPendingPointType(null);
  }, []);

  // Filter shipments based on search and status
  const filteredShipments = contextualShipments.filter(shipment => {
    const matchesSearch = 
      shipment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.customer.toLowerCase().includes(searchTerm.toLowerCase()) ||
      shipment.route.vehicle.driver.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || shipment.route.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  const getContextTitle = (): string => {
    switch (context) {
      case 'route-planning':
        return 'Route Planning';
      case 'driver-routes':
        return contextEntity ? 
          `Driver Routes - ${(contextEntity as Driver).name}` : 
          'Driver Routes';
      case 'vehicle-routes':
        return contextEntity ? 
          `Vehicle Routes - ${(contextEntity as VehicleType).plateNumber}` : 
          'Vehicle Routes';
      case 'active-shipments':
      default:
        return 'Active Shipments - Route Planner';
    }
  };

  const getContextDescription = (): string => {
    switch (context) {
      case 'route-planning':
        return 'Create and optimize new routes with advanced planning tools';
      case 'driver-routes':
        return contextEntity ? 
          `View and track routes assigned to ${(contextEntity as Driver).name}` :
          'Select a driver to view their routes';
      case 'vehicle-routes':
        return contextEntity ? 
          `View and track routes completed by ${(contextEntity as VehicleType).plateNumber}` :
          'Select a vehicle to view its routes';
      case 'active-shipments':
      default:
        return 'Plan and manage active shipment routes with real-time tracking';
    }
  };

  const getContextIcon = () => {
    switch (context) {
      case 'route-planning':
        return <Navigation className="w-5 h-5 text-blue-600" />;
      case 'driver-routes':
        return <User className="w-5 h-5 text-blue-600" />;
      case 'vehicle-routes':
        return <Truck className="w-5 h-5 text-blue-600" />;
      case 'active-shipments':
      default:
        return <RouteIcon className="w-5 h-5 text-blue-600" />;
    }
  };

  const isEditingAllowed = context === 'active-shipments' || context === 'route-planning';
  const hasValidData = (context === 'route-planning' && planningRoute) || (contextualShipments.length > 0 && selectedShipment);
  const currentRoute = context === 'route-planning' ? planningRoute : selectedShipment;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      {/* Header */}
      <div className="mb-6">
        {onBack && (
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        )}
        <div className="flex items-center gap-3">
          {getContextIcon()}
          <div>
            <h2 className="text-2xl font-bold text-gray-900">{getContextTitle()}</h2>
            <p className="text-gray-600">{getContextDescription()}</p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Left Sidebar */}
        <div className="lg:col-span-1 space-y-6">
          {/* Context and Filters */}
          <div className="bg-white rounded-lg shadow-lg p-4">
            <div className="space-y-4">
              {/* Context Selector */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Context</label>
                <select
                  value={context}
                  onChange={(e) => handleContextChange(e.target.value as RouteContext)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                >
                  {contextOptions.map(option => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Entity Selector (for driver/vehicle routes) */}
              {(context === 'driver-routes' || context === 'vehicle-routes') && (
                <div className="relative">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    {context === 'driver-routes' ? 'Select Driver' : 'Select Vehicle'}
                  </label>
                  <div className="relative">
                    <input
                      type="text"
                      placeholder={`Search ${context === 'driver-routes' ? 'drivers' : 'vehicles'}...`}
                      value={entitySearchTerm}
                      onChange={(e) => {
                        setEntitySearchTerm(e.target.value);
                        setShowEntityDropdown(true);
                      }}
                      onFocus={() => setShowEntityDropdown(true)}
                      className="w-full px-3 py-2 pr-8 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                    {contextEntity && (
                      <button
                        onClick={handleEntityClear}
                        className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                  
                  {/* Dropdown with suggestions */}
                  {showEntityDropdown && entitySuggestions.length > 0 && (
                    <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto">
                      {entitySuggestions.map(suggestion => (
                        <button
                          key={suggestion.id}
                          onClick={() => handleEntitySelect(suggestion)}
                          className="w-full px-3 py-2 text-left hover:bg-gray-50 focus:bg-gray-50 focus:outline-none text-sm border-b border-gray-100 last:border-b-0"
                        >
                          <div className="flex items-center gap-2">
                            {suggestion.type === 'driver' ? 
                              <User className="w-4 h-4 text-blue-500" /> : 
                              <Truck className="w-4 h-4 text-purple-500" />
                            }
                            <span className="font-medium">{suggestion.name}</span>
                          </div>
                          {suggestion.type === 'driver' && (
                            <div className="text-xs text-gray-500 mt-1">
                              Status: {(suggestion.entity as Driver).status.replace('-', ' ')}
                            </div>
                          )}
                          {suggestion.type === 'vehicle' && (
                            <div className="text-xs text-gray-500 mt-1">
                              {(suggestion.entity as VehicleType).year} • {(suggestion.entity as VehicleType).status.replace('-', ' ')}
                            </div>
                          )}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
              )}

              {/* Search Routes - Only show for non-planning contexts */}
              {context !== 'route-planning' && (
                <>
                  <div className="relative">
                    <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <input
                      type="text"
                      placeholder="Search routes..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm"
                    />
                  </div>
                  
                  {/* Status Filter */}
                  <div className="relative">
                    <Filter className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value as any)}
                      className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-sm appearance-none"
                    >
                      <option value="all">All Status</option>
                      <option value="active">Active</option>
                      <option value="completed">Completed</option>
                      <option value="planned">Planned</option>
                      <option value="delayed">Delayed</option>
                    </select>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Route Controls - Show prominently for route planning */}
          {isEditingAllowed && currentRoute && (
            <RouteControls
              route={currentRoute.route}
              onAddPoint={handleAddPointOfType}
              onOptimizeRoute={handleOptimizeRoute}
              onAddRestStops={handleAddRestStops}
            />
          )}

          {/* Vehicle Status - Show prominently for route planning */}
          {currentRoute && (
            <VehicleStatus vehicle={currentRoute.route.vehicle} />
          )}

          {/* Show shipment selector only for non-planning contexts with limited height */}
          {context !== 'route-planning' && hasValidData && (
            <div className="bg-white rounded-lg shadow-lg p-4 mb-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center gap-2">
                <RouteIcon className="w-5 h-5 text-blue-600" />
                {context === 'active-shipments' ? 'Active Shipments' :
                 context === 'driver-routes' ? 'Driver Routes' :
                 'Vehicle Routes'}
              </h2>
              
              {/* Scrollable container with limited height */}
              <div className="max-h-80 overflow-y-auto pr-2 -mr-2">
                <div className="grid grid-cols-1 gap-3">
                  {filteredShipments.map((shipment) => (
                    <button
                      key={shipment.id}
                      onClick={() => handleShipmentSelect(shipment)}
                      className={`p-3 rounded-lg border-2 transition-all text-left ${
                        selectedShipment?.id === shipment.id
                          ? 'border-blue-500 bg-blue-50'
                          : 'border-gray-200 hover:border-gray-300 bg-white'
                      }`}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-medium text-gray-900 text-sm">{shipment.name}</h3>
                        <div className="flex items-center">
                          {shipment.route.status === 'active' && <Truck className="w-4 h-4 text-green-600" />}
                          {shipment.route.status === 'completed' && <CheckCircle className="w-4 h-4 text-blue-600" />}
                          {shipment.route.status === 'delayed' && <AlertTriangle className="w-4 h-4 text-red-600" />}
                          {shipment.route.status === 'planned' && <Clock className="w-4 h-4 text-gray-600" />}
                        </div>
                      </div>
                      
                      <div className="flex items-center justify-between text-sm">
                        <span className="text-gray-600 truncate">{shipment.customer}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                          shipment.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                          shipment.priority === 'high' ? 'bg-orange-100 text-orange-800' :
                          shipment.priority === 'medium' ? 'bg-blue-100 text-blue-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {shipment.priority.toUpperCase()}
                        </span>
                      </div>
                      
                      <div className="mt-2 text-xs text-gray-500">
                        {shipment.route.points.length} stops • {shipment.route.totalDistance.toFixed(0)} km
                      </div>
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Show scroll indicator if there are more than 3 items */}
              {filteredShipments.length > 3 && (
                <div className="mt-2 text-xs text-gray-500 text-center">
                  Scroll to see more ({filteredShipments.length} total)
                </div>
              )}
            </div>
          )}

          {/* Context-specific information */}
          {context === 'driver-routes' && contextEntity && (
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <User className="w-4 h-4 text-blue-600" />
                Driver Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Name:</span>
                  <span className="font-medium">{(contextEntity as Driver).name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">{(contextEntity as Driver).status.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Total Routes:</span>
                  <span className="font-medium">{(contextEntity as Driver).routes.length}</span>
                </div>
              </div>
            </div>
          )}

          {context === 'vehicle-routes' && contextEntity && (
            <div className="bg-white rounded-lg shadow-lg p-4">
              <h3 className="font-semibold text-gray-900 mb-3 flex items-center gap-2">
                <Truck className="w-4 h-4 text-blue-600" />
                Vehicle Information
              </h3>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Plate:</span>
                  <span className="font-medium">{(contextEntity as VehicleType).plateNumber}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Model:</span>
                  <span className="font-medium">{(contextEntity as VehicleType).make} {(contextEntity as VehicleType).model}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Status:</span>
                  <span className="font-medium capitalize">{(contextEntity as VehicleType).status.replace('-', ' ')}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Mileage:</span>
                  <span className="font-medium">{(contextEntity as VehicleType).mileage.toLocaleString()} km</span>
                </div>
              </div>
            </div>
          )}

          {/* No data message for contexts that need entity selection */}
          {!hasValidData && context !== 'route-planning' && (
            <div className="bg-white rounded-lg shadow-lg p-6 text-center">
              <div className="text-gray-400 mb-2">
                {context === 'driver-routes' ? <User className="w-8 h-8 mx-auto" /> :
                 context === 'vehicle-routes' ? <Truck className="w-8 h-8 mx-auto" /> :
                 <RouteIcon className="w-8 h-8 mx-auto" />}
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                {context === 'driver-routes' && !contextEntity ? 'Select a Driver' :
                 context === 'vehicle-routes' && !contextEntity ? 'Select a Vehicle' :
                 'No Routes Available'}
              </h3>
              <p className="text-gray-500 text-sm">
                {context === 'driver-routes' && !contextEntity ? 'Choose a driver to view their routes' :
                 context === 'vehicle-routes' && !contextEntity ? 'Choose a vehicle to view its routes' :
                 'No routes found for the selected criteria'}
              </p>
            </div>
          )}
        </div>

        {/* Main Content Area */}
        <div className="lg:col-span-3 space-y-6">
          {/* Map */}
          <div className="bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="h-[600px]">
              {currentRoute ? (
                <LogisticsMap
                  points={currentRoute.route.points}
                  vehicle={currentRoute.route.vehicle}
                  onPointAdd={isEditingAllowed ? handleAddPoint : undefined}
                  onPointRemove={isEditingAllowed ? handleRemovePoint : undefined}
                  onPointEdit={isEditingAllowed ? handleEditPoint : undefined}
                  pendingPointType={isEditingAllowed ? pendingPointType : null}
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-gray-50">
                  <div className="text-center">
                    <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-gray-900 mb-2">No Route Selected</h3>
                    <p className="text-gray-500">
                      {context === 'active-shipments' ? 'Select a shipment to view its route' :
                       context === 'driver-routes' ? 'Select a driver and route to view on the map' :
                       context === 'vehicle-routes' ? 'Select a vehicle and route to view on the map' :
                       'Start planning your route by adding points to the map'}
                    </p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Route Summary - Now below the map with more space and drag & drop */}
          {currentRoute && (
            <RouteSummary 
              route={currentRoute.route} 
              onReorderPoints={isEditingAllowed ? handleReorderPoints : undefined}
              allowReordering={isEditingAllowed}
            />
          )}
        </div>
      </div>

      {/* Click outside to close dropdown */}
      {showEntityDropdown && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setShowEntityDropdown(false)}
        />
      )}
    </div>
  );
};