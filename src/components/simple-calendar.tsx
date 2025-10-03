"use client";

import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { 
  Calendar as CalendarIcon, 
  ChevronLeft, 
  ChevronRight,
  Clock,
  AlertTriangle,
  CheckCircle
} from "lucide-react";
import { CalendarEvent } from "@/lib/types";

interface SimpleCalendarProps {
  events: CalendarEvent[];
}

const eventTypeColors = {
  deadline: "bg-red-100 text-red-800 border-red-200",
  position_change: "bg-blue-100 text-blue-800 border-blue-200",
  client_reminder: "bg-green-100 text-green-800 border-green-200",
  custom: "bg-purple-100 text-purple-800 border-purple-200"
};

const priorityColors = {
  high: "bg-red-100 text-red-800 border-red-200",
  medium: "bg-yellow-100 text-yellow-800 border-yellow-200",
  low: "bg-green-100 text-green-800 border-green-200"
};

export function SimpleCalendar({ events }: SimpleCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [selectedDate, setSelectedDate] = useState<Date | null>(null);

  const monthNames = [
    "January", "February", "March", "April", "May", "June",
    "July", "August", "September", "October", "November", "December"
  ];

  const dayNames = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

  const getDaysInMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
  };

  const getFirstDayOfMonth = (date: Date) => {
    return new Date(date.getFullYear(), date.getMonth(), 1).getDay();
  };

  const getEventsForDate = (date: Date) => {
    const dateString = date.toISOString().split('T')[0];
    return events.filter(event => event.date === dateString);
  };

  const formatDate = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  const navigateMonth = (direction: 'prev' | 'next') => {
    setCurrentDate(prev => {
      const newDate = new Date(prev);
      if (direction === 'prev') {
        newDate.setMonth(newDate.getMonth() - 1);
      } else {
        newDate.setMonth(newDate.getMonth() + 1);
      }
      return newDate;
    });
  };

  const renderCalendarDays = () => {
    const daysInMonth = getDaysInMonth(currentDate);
    const firstDay = getFirstDayOfMonth(currentDate);
    const days = [];

    // Empty cells for days before the first day of the month
    for (let i = 0; i < firstDay; i++) {
      days.push(<div key={`empty-${i}`} className="h-10"></div>);
    }

    // Days of the month
    for (let day = 1; day <= daysInMonth; day++) {
      const date = new Date(currentDate.getFullYear(), currentDate.getMonth(), day);
      const dayEvents = getEventsForDate(date);
      const isToday = formatDate(date) === formatDate(new Date());
      const isSelected = selectedDate && formatDate(date) === formatDate(selectedDate);

      days.push(
        <div
          key={day}
          className={`h-10 flex flex-col items-center justify-center cursor-pointer border rounded-lg transition-colors ${
            isToday 
              ? 'bg-indigo-100 text-indigo-900 border-indigo-300' 
              : isSelected
              ? 'bg-gray-100 text-gray-900 border-gray-300'
              : 'hover:bg-gray-50 border-transparent'
          }`}
          onClick={() => setSelectedDate(date)}
        >
          <span className="text-sm font-medium">{day}</span>
          {dayEvents.length > 0 && (
            <div className="flex gap-1 mt-1">
              {dayEvents.slice(0, 2).map((event, index) => (
                <div
                  key={index}
                  className={`w-1.5 h-1.5 rounded-full ${
                    event.priority === 'high' ? 'bg-red-500' :
                    event.priority === 'medium' ? 'bg-yellow-500' :
                    'bg-green-500'
                  }`}
                />
              ))}
              {dayEvents.length > 2 && (
                <div className="w-1.5 h-1.5 rounded-full bg-gray-400" />
              )}
            </div>
          )}
        </div>
      );
    }

    return days;
  };

  const selectedDateEvents = selectedDate ? getEventsForDate(selectedDate) : [];
  const todayEvents = getEventsForDate(new Date());

  return (
    <Card className="bg-white border border-gray-200 rounded-xl shadow-sm">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle className="flex items-center gap-2">
              <CalendarIcon className="h-5 w-5" />
              Calendar & Due Dates
            </CardTitle>
            <CardDescription>
              Track deadlines and important dates
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('prev')}
            >
              <ChevronLeft className="h-4 w-4" />
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigateMonth('next')}
            >
              <ChevronRight className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {/* Month Header */}
          <div className="text-center">
            <h3 className="text-xl font-semibold text-gray-900">
              {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
            </h3>
          </div>

          {/* Calendar Grid */}
          <div className="grid grid-cols-7 gap-1">
            {/* Day headers */}
            {dayNames.map(day => (
              <div key={day} className="h-8 flex items-center justify-center text-sm font-medium text-gray-500">
                {day}
              </div>
            ))}
            {/* Calendar days */}
            {renderCalendarDays()}
          </div>

          {/* Today's Events */}
          {todayEvents.length > 0 && (
            <div className="mt-4 p-3 bg-indigo-50 rounded-lg border border-indigo-200">
              <h4 className="font-medium text-indigo-900 mb-2 flex items-center gap-2">
                <Clock className="h-4 w-4" />
                Today&apos;s Events
              </h4>
              <div className="space-y-2">
                {todayEvents.map(event => (
                  <div key={event.id} className="flex items-center gap-2 text-sm">
                    <Badge className={eventTypeColors[event.type]}>
                      {event.type.replace('_', ' ').toUpperCase()}
                    </Badge>
                    <span className="text-indigo-800">{event.title}</span>
                    {event.priority === 'high' && (
                      <AlertTriangle className="h-3 w-3 text-red-600" />
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Selected Date Events */}
          {selectedDate && selectedDateEvents.length > 0 && (
            <div className="mt-4 p-3 bg-gray-50 rounded-lg border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">
                {selectedDate.toLocaleDateString('en-US', { 
                  weekday: 'long', 
                  year: 'numeric', 
                  month: 'long', 
                  day: 'numeric' 
                })}
              </h4>
              <div className="space-y-2">
                {selectedDateEvents.map(event => (
                  <div key={event.id} className="p-2 bg-white rounded border">
                    <div className="flex items-center justify-between mb-1">
                      <div className="flex items-center gap-2">
                        <Badge className={eventTypeColors[event.type]}>
                          {event.type.replace('_', ' ').toUpperCase()}
                        </Badge>
                        <Badge className={priorityColors[event.priority]}>
                          {event.priority.toUpperCase()}
                        </Badge>
                      </div>
                      {event.isCompleted && (
                        <CheckCircle className="h-4 w-4 text-green-600" />
                      )}
                    </div>
                    <h5 className="font-medium text-gray-900">{event.title}</h5>
                    {event.description && (
                      <p className="text-sm text-gray-600">{event.description}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Legend */}
          <div className="flex flex-wrap gap-2 text-xs text-gray-600">
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-red-500 rounded-full" />
              <span>High Priority</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-yellow-500 rounded-full" />
              <span>Medium Priority</span>
            </div>
            <div className="flex items-center gap-1">
              <div className="w-3 h-3 bg-green-500 rounded-full" />
              <span>Low Priority</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
