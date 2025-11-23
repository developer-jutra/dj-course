
import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { ArrowLeft, User, Mail, Phone, MapPin, CreditCard, FileText, AlertCircle } from 'lucide-react';
import { useDriverDetailsQuery, useDriverShipmentsQuery } from '@/http/drivers.queries';
import { useAtom } from 'jotai';
import { selectedDriverAtom } from './drivers.store';
import { Driver } from '@/model/drivers';
import { formatDateTime, formatDate } from '@/lib/date/dateUtils';

const DriverDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { data: driver, isLoading: driverLoading } = useDriverDetailsQuery(id || '');
  const { data: shipments = [], isLoading: shipmentsLoading } = useDriverShipmentsQuery(id || '');
  const [, setSelectedDriver] = useAtom(selectedDriverAtom);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'in transit': return 'bg-blue-100 text-blue-800';
      case 'delivered': return 'bg-green-100 text-green-800';
      case 'loading': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const isLicenseExpiringSoon = (driver: Driver) => {
    if (!driver.licenseExpiry) return false;
    const threeMonthsFromNow = new Date();
    threeMonthsFromNow.setMonth(threeMonthsFromNow.getMonth() + 3);
    return driver.licenseExpiry < threeMonthsFromNow;
  };

  const handleViewDriverShipments = () => {
    if (driver) {
      setSelectedDriver(driver.name);
      navigate('/shipments');
    }
  };

  if (driverLoading) {
    return <div className="flex items-center justify-center h-64">Loading driver details...</div>;
  }

  if (!driver) {
    return <div className="flex items-center justify-center h-64">Driver not found</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/drivers')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Drivers
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Driver Details</h1>
          <p className="text-gray-600">Complete driver information and history</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Driver Information */}
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><User className="w-5 h-5 text-blue-600" />Personal Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Full Name</p>
                  <p className="font-medium">{driver.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Employee ID</p>
                  <p className="font-medium">{driver.id}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Email</p>
                  <p className="font-medium flex items-center gap-2">
                    <Mail className="w-4 h-4 text-gray-400" />
                    {driver.email}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium flex items-center gap-2">
                    <Phone className="w-4 h-4 text-gray-400" />
                    {driver.phone}
                  </p>
                </div>
              </div>

              <div className="mt-4">
                <p className="text-sm text-gray-600">Address</p>
                <p className="font-medium flex items-start gap-2">
                  <MapPin className="w-4 h-4 text-gray-400 mt-0.5" />
                  <span>
                    {driver.address.street}<br />
                    {driver.address.postalCode} {driver.address.city}<br />
                    {driver.address.country}
                  </span>
                </p>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle  className="flex items-center gap-2"><CreditCard className="w-5 h-5 text-blue-600" />Employment Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Contract Type</p>
                  <p className="font-medium capitalize">{driver.contractType.replace('-', ' ')}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Annual Salary</p>
                  <p className="font-medium">
                    {driver.salary.toLocaleString()} {driver.currency}
                  </p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Hire Date</p>
                  <p className="font-medium">{formatDate(driver.hireDate)}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Years of Service</p>
                  <p className="font-medium">
                    {Math.floor((Date.now() - new Date(driver.hireDate).getTime()) / (365.25 * 24 * 60 * 60 * 1000))} years
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><FileText className="w-5 h-5 text-blue-600" />License Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm text-gray-600">License Number</p>
                  <p className="font-medium font-mono">{driver.licenseNumber}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Expiry Date</p>
                  <p className={`flex items-center gap-2 ${isLicenseExpiringSoon(driver) ? 'text-red-600' : 'text-gray-900'}`}>
                    {isLicenseExpiringSoon(driver) && <AlertCircle className="w-4 h-4" />}
                    {formatDate(driver.licenseExpiry)}
                    {isLicenseExpiringSoon(driver) && <span className="text-xs">(Expires Soon!)</span>}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2"><AlertCircle className="w-5 h-5 text-blue-600" />Emergency Contact</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <p className="text-sm text-gray-600">Name</p>
                  <p className="font-medium">{driver.emergencyContact.name}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Phone</p>
                  <p className="font-medium">{driver.emergencyContact.phone}</p>
                </div>
                <div>
                  <p className="text-sm text-gray-600">Relationship</p>
                  <p className="font-medium">{driver.emergencyContact.relationship}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Recent Shipments */}
          <Card className="lg:col-span-2">
            <CardHeader>
              <div className="flex justify-between items-center">
                <div>
                  <CardTitle>Recent Shipments</CardTitle>
                  <CardDescription>Latest shipments assigned to this driver</CardDescription>
                </div>
                <Button onClick={handleViewDriverShipments}>
                  View All Shipments
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {shipmentsLoading ? (
                <div>Loading shipments...</div>
              ) : shipments.length > 0 ? (
                <div className="space-y-4">
                  {shipments.slice(0, 5).map((shipment) => (
                    <div key={shipment.id} className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                      <div className="flex-1">
                        <div className="flex items-center space-x-4">
                          <div>
                            <p className="font-medium">Shipment {shipment.id}</p>
                            <p className="text-sm text-gray-600">{shipment.origin} → {shipment.destination}</p>
                          </div>
                          <Badge className={getStatusColor(shipment.status)}>
                            {shipment.status}
                          </Badge>
                        </div>
                        <p className="text-sm text-gray-500 mt-1">ETA: {shipment.eta}</p>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => navigate(`/shipments/${shipment.id}/track`)}
                      >
                        Track
                      </Button>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8">
                  <p className="text-gray-500">No shipments assigned to this driver</p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Performance Statistics */}
      <Card>
        <CardHeader>
          <CardTitle>Performance Statistics</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <div className="text-center">
              <p className="text-2xl font-bold text-blue-600">{driver.routes.filter(r => r.status === 'completed').length}</p>
              <p className="text-sm text-gray-600">Total Deliveries</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-green-600">98%</p>
              <p className="text-sm text-gray-600">On-Time Rate</p>
            </div>
            <div className="text-center">
              <p className="text-2xl font-bold text-orange-600">2</p>
              <p className="text-sm text-gray-600">Incidents</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DriverDetails;
