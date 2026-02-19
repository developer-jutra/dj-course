import React, { useState } from 'react';
import { Calendar, dateFnsLocalizer, Views } from 'react-big-calendar';
import { format, parse, startOfWeek, getDay } from 'date-fns';
import { enUS } from 'date-fns/locale';
import 'react-big-calendar/lib/css/react-big-calendar.css';
import { Driver, CalendarEvent } from '../../model/drivers';
import { ArrowLeft, Calendar as CalendarIcon, Clock, MapPin, X } from 'lucide-react';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '../../components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../../components/ui/select';
import { Button } from '../../components/ui/button';
import { useDriversList } from '../../hooks/queries';

const locales = {
  'en-US': enUS,
};

const localizer = dateFnsLocalizer({
  format,
  parse,
  startOfWeek,
  getDay,
  locales,
});

interface DriverCalendarProps {
  driver: Driver;
  onBack: () => void;
}

type EventType = CalendarEvent['type'];

interface EventTypeFilter {
  type: EventType;
  label: string;
  count: number;
  color: string;
  bgColor: string;
}

export const DriverCalendar: React.FC<DriverCalendarProps> = ({ driver, onBack }) => {
  const [selectedEvent, setSelectedEvent] = useState<CalendarEvent | null>(null);
  const [activeFilters, setActiveFilters] = useState<Set<EventType>>(new Set());

  // Calculate event type counts and create filter options
  const eventTypeFilters: EventTypeFilter[] = [
    {
      type: 'route',
      label: 'Active Routes',
      count: driver.calendarEvents.filter(e => e.type === 'route').length,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      type: 'rest',
      label: 'Rest Periods',
      count: driver.calendarEvents.filter(e => e.type === 'rest').length,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50'
    },
    {
      type: 'sick-leave',
      label: 'Sick Leave',
      count: driver.calendarEvents.filter(e => e.type === 'sick-leave').length,
      color: 'text-red-600',
      bgColor: 'bg-red-50'
    },
    {
      type: 'vacation',
      label: 'Vacation',
      count: driver.calendarEvents.filter(e => e.type === 'vacation').length,
      color: 'text-green-600',
      bgColor: 'bg-green-50'
    },
    {
      type: 'training',
      label: 'Training',
      count: driver.calendarEvents.filter(e => e.type === 'training').length,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50'
    }
  ];

  // Filter events based on active filters
  const filteredEvents = activeFilters.size === 0 
    ? driver.calendarEvents 
    : driver.calendarEvents.filter(event => activeFilters.has(event.type));

  const eventStyleGetter = (event: CalendarEvent) => {
    const colors = {
      'route': { backgroundColor: '#3B82F6', borderColor: '#2563EB' },
      'rest': { backgroundColor: '#8B5CF6', borderColor: '#7C3AED' },
      'sick-leave': { backgroundColor: '#EF4444', borderColor: '#DC2626' },
      'vacation': { backgroundColor: '#10B981', borderColor: '#059669' },
      'training': { backgroundColor: '#F59E0B', borderColor: '#D97706' }
    };

    return {
      style: {
        backgroundColor: colors[event.type].backgroundColor,
        borderColor: colors[event.type].borderColor,
        color: 'white',
        border: 'none',
        borderRadius: '4px',
        fontSize: '12px'
      }
    };
  };

  const handleSelectEvent = (event: CalendarEvent) => {
    setSelectedEvent(event);
  };

  const handleFilterToggle = (eventType: EventType) => {
    setActiveFilters(prev => {
      const newFilters = new Set(prev);
      if (newFilters.has(eventType)) {
        newFilters.delete(eventType);
      } else {
        newFilters.add(eventType);
      }
      return newFilters;
    });
  };

  const handleClearFilters = () => {
    setActiveFilters(new Set());
  };

  const getEventTypeIcon = (type: CalendarEvent['type']) => {
    switch (type) {
      case 'route':
        return <MapPin className="w-4 h-4" />;
      case 'rest':
      case 'sick-leave':
      case 'vacation':
        return <Clock className="w-4 h-4" />;
      case 'training':
        return <CalendarIcon className="w-4 h-4" />;
      default:
        return <CalendarIcon className="w-4 h-4" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <div className="mb-6">
        <button
          onClick={onBack}
          className="flex items-center gap-2 text-blue-600 hover:text-blue-800 mb-4"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Driver Details
        </button>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{driver.name} - Calendar</h2>
          <p className="text-gray-600">View driver schedule, routes, and availability</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Calendar Legend and Summary */}
        <div className="lg:col-span-1 space-y-6">
          {/* Interactive Legend with Filtering */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-lg font-semibold text-gray-900">Event Types</h3>
              {activeFilters.size > 0 && (
                <button
                  onClick={handleClearFilters}
                  className="flex items-center gap-1 px-2 py-1 text-xs bg-gray-100 text-gray-600 rounded hover:bg-gray-200 transition-colors"
                  title="Clear all filters"
                >
                  <X className="w-3 h-3" />
                  Clear
                </button>
              )}
            </div>
            
            <div className="space-y-1">
              {eventTypeFilters.map(({ type, label, count, color, bgColor }) => {
                const isActive = activeFilters.has(type);
                const isFiltered = activeFilters.size > 0 && !isActive;
                
                return (
                  <button
                    key={type}
                    onClick={() => handleFilterToggle(type)}
                    className={`w-full flex items-center justify-between p-2 rounded-lg border-2 transition-all ${
                      isActive 
                        ? 'border-blue-500 bg-blue-50' 
                        : isFiltered
                        ? 'border-gray-200 bg-gray-50 opacity-50'
                        : 'border-gray-200 bg-white hover:border-gray-300 hover:bg-gray-50'
                    }`}
                    disabled={count === 0}
                  >
                    <div className="flex items-center gap-2">
                      <div className={`p-1 rounded ${bgColor} ${color} ${isFiltered ? 'opacity-50' : ''}`}>
                        {getEventTypeIcon(type)}
                      </div>
                      <div className="text-left">
                        <div className={`text-sm font-medium ${isFiltered ? 'text-gray-400' : 'text-gray-900'}`}>
                          {label}
                        </div>
                        {isActive && (
                          <div className="text-xs text-blue-600 font-medium">
                            Filtered
                          </div>
                        )}
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={`text-sm font-bold ${isFiltered ? 'text-gray-400' : 'text-gray-900'}`}>
                        {count}
                      </span>
                      {isActive && (
                        <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                      )}
                    </div>
                  </button>
                );
              })}
            </div>

            {/* Filter Status */}
            {activeFilters.size > 0 && (
              <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="text-sm text-blue-800">
                  <div className="font-medium mb-1">Active Filters:</div>
                  <div className="flex flex-wrap gap-1">
                    {Array.from(activeFilters).map(type => {
                      const filter = eventTypeFilters.find(f => f.type === type);
                      return (
                        <span key={type} className="px-2 py-1 bg-blue-100 text-blue-700 rounded text-xs">
                          {filter?.label}
                        </span>
                      );
                    })}
                  </div>
                  <div className="text-xs text-blue-600 mt-2">
                    Showing {filteredEvents.length} of {driver.calendarEvents.length} events
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Monthly Summary */}
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">This Month</h3>
            <div className="space-y-3">
              <div className="flex justify-between">
                <span className="text-gray-600">Working Days:</span>
                <span className="font-medium">22</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Routes Completed:</span>
                <span className="font-medium text-green-600">8</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Days Off:</span>
                <span className="font-medium text-blue-600">3</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Sick Days:</span>
                <span className="font-medium text-red-600">1</span>
              </div>
            </div>
          </div>

          {/* Selected Event Details */}
          {selectedEvent && (
            <div className="bg-white rounded-lg shadow-lg p-6">
              <h3 className="text-lg font-semibold text-gray-900 mb-4">Event Details</h3>
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className={`p-2 rounded-lg ${
                    eventTypeFilters.find(f => f.type === selectedEvent.type)?.bgColor
                  } ${
                    eventTypeFilters.find(f => f.type === selectedEvent.type)?.color
                  }`}>
                    {getEventTypeIcon(selectedEvent.type)}
                  </div>
                  <span className="font-medium">{selectedEvent.title}</span>
                </div>
                <div>
                  <span className="text-sm text-gray-500">Start:</span>
                  <p className="text-sm">{format(selectedEvent.start, 'PPP p')}</p>
                </div>
                <div>
                  <span className="text-sm text-gray-500">End:</span>
                  <p className="text-sm">{format(selectedEvent.end, 'PPP p')}</p>
                </div>
                {selectedEvent.description && (
                  <div>
                    <span className="text-sm text-gray-500">Description:</span>
                    <p className="text-sm">{selectedEvent.description}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Calendar */}
        <div className="lg:col-span-3">
          <div className="bg-white rounded-lg shadow-lg p-6">
            {/* Calendar Header with Filter Info */}
            {activeFilters.size > 0 && (
              <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                <div className="flex items-center justify-between">
                  <div className="text-sm text-blue-800">
                    <span className="font-medium">Filtered View:</span> Showing {filteredEvents.length} events
                  </div>
                  <button
                    onClick={handleClearFilters}
                    className="flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
                  >
                    <X className="w-3 h-3" />
                    Show All
                  </button>
                </div>
              </div>
            )}
            
            <div style={{ height: '700px' }}>
              <Calendar
                localizer={localizer}
                events={filteredEvents}
                startAccessor="start"
                endAccessor="end"
                titleAccessor="title"
                onSelectEvent={handleSelectEvent}
                eventPropGetter={eventStyleGetter}
                views={[Views.MONTH, Views.WEEK, Views.DAY]}
                defaultView={Views.MONTH}
                popup
                style={{ height: '100%' }}
              />
            </div>
          </div>
        </div>
      </div>

      {/* Custom Calendar Styles */}
      <style>
        {`
          .rbc-calendar {
            font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
          }
          
          .rbc-header {
            background-color: #F8FAFC;
            border-bottom: 1px solid #E2E8F0;
            padding: 12px 8px;
            font-weight: 600;
            color: #374151;
          }
          
          .rbc-today {
            background-color: #FEF3C7;
          }
          
          .rbc-off-range-bg {
            background-color: #F9FAFB;
          }
          
          .rbc-event {
            border-radius: 4px;
            padding: 2px 4px;
            font-size: 11px;
            font-weight: 500;
          }
          
          .rbc-toolbar {
            margin-bottom: 20px;
            padding: 0 10px;
          }
          
          .rbc-toolbar button {
            background: white;
            border: 1px solid #D1D5DB;
            color: #374151;
            padding: 8px 16px;
            border-radius: 6px;
            font-weight: 500;
            transition: all 0.2s;
          }
          
          .rbc-toolbar button:hover {
            background: #F3F4F6;
            border-color: #9CA3AF;
          }
          
          .rbc-toolbar button.rbc-active {
            background: #3B82F6;
            border-color: #3B82F6;
            color: white;
          }
          
          .rbc-toolbar-label {
            font-size: 18px;
            font-weight: 600;
            color: #111827;
          }
        `}
      </style>
    </div>
  );
};