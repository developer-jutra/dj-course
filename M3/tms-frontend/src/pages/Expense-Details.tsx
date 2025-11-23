import React from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Calendar, FileText, User, Truck, MapPin, CreditCard, Receipt } from 'lucide-react';

// Mock expense data - in real app this would come from API
const mockExpenseDetails = {
  'EXP001': {
    id: 'EXP001',
    date: '2025-01-15',
    expenseType: 'Fuel',
    category: 'Variable',
    amount: 1200,
    currency: 'PLN',
    status: 'Approved',
    transporter: 'John Smith',
    vehicle: 'TRK-123',
    trip: 'Warsaw-Berlin',
    odometer: 120000,
    notes: 'Night refill at highway station',
    vendor: 'Orlen',
    invoiceNumber: 'INV-2025-001',
    paymentDueDate: '2025-01-30',
    paymentStatus: 'Paid',
    recurrence: false,
    attachments: ['receipt.pdf'],
    approvedBy: 'Sarah Johnson',
    approvedDate: '2025-01-16',
    submittedDate: '2025-01-15',
    description: 'Fuel purchase during long-haul trip from Warsaw to Berlin. Vehicle required refueling at highway station during night hours.',
    location: 'A2 Highway, Service Station Konin',
    fuelQuantity: '180 liters',
    pricePerLiter: '6.67 PLN',
    paymentMethod: 'Company Card',
    receiptDetails: {
      stationName: 'Orlen Station Konin',
      stationAddress: 'A2 Highway km 254, Konin',
      receiptNumber: 'RCP-789456123',
      vatNumber: 'PL1234567890'
    }
  },
  'EXP002': {
    id: 'EXP002',
    date: '2025-01-14',
    expenseType: 'Maintenance',
    category: 'Fixed',
    amount: 2400,
    currency: 'PLN',
    status: 'Pending',
    transporter: 'Mike Brown',
    vehicle: 'TRK-456',
    trip: '',
    odometer: 90000,
    notes: 'Brake pads replacement',
    vendor: 'Bosch Service',
    invoiceNumber: 'BSC-2025-045',
    paymentDueDate: '2025-02-15',
    paymentStatus: 'Unpaid',
    recurrence: false,
    attachments: ['invoice.pdf', 'photo.jpg'],
    submittedDate: '2025-01-14',
    description: 'Scheduled brake pad replacement for vehicle TRK-456. Brake pads were worn beyond safe limits during routine inspection.',
    location: 'Bosch Service Center, Warsaw',
    serviceDetails: {
      workOrderNumber: 'WO-2025-156',
      mechanicName: 'Tomasz Kowalski',
      partsReplaced: ['Front brake pads', 'Rear brake pads', 'Brake fluid'],
      laborHours: 3.5,
      warrantyPeriod: '12 months'
    }
  }
};

const ExpenseDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  
  const expense = mockExpenseDetails[id as keyof typeof mockExpenseDetails];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Approved': return 'bg-green-100 text-green-800';
      case 'Pending': return 'bg-yellow-100 text-yellow-800';
      case 'Rejected': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getPaymentStatusColor = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-green-100 text-green-800';
      case 'Unpaid': return 'bg-red-100 text-red-800';
      case 'Partially Paid': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (!expense) {
    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={() => navigate('/expenses')}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Expenses
          </Button>
        </div>
        <Card>
          <CardContent className="text-center py-12">
            <p className="text-gray-500">Expense not found</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4">
        <Button variant="outline" onClick={() => navigate('/expenses')}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Expenses
        </Button>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Expense Details - {expense.id}</h1>
          <p className="text-gray-600">Complete expense information and documentation</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Expense Summary */}
        <Card>
          <CardHeader>
            <CardTitle>Expense Summary</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <p className="text-sm text-gray-600">Expense ID</p>
              <p className="font-medium">{expense.id}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Type</p>
              <p className="font-medium">{expense.expenseType}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Category</p>
              <p className="font-medium">{expense.category}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Amount</p>
              <p className="font-medium text-lg text-blue-600">
                {expense.amount.toLocaleString()} {expense.currency}
              </p>
            </div>
            <div>
              <p className="text-sm text-gray-600">Status</p>
              <Badge className={getStatusColor(expense.status)}>
                {expense.status}
              </Badge>
            </div>
            <div>
              <p className="text-sm text-gray-600">Payment Status</p>
              <Badge className={getPaymentStatusColor(expense.paymentStatus)}>
                {expense.paymentStatus}
              </Badge>
            </div>
          </CardContent>
        </Card>

        {/* Expense Details */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Expense Information</CardTitle>
            <CardDescription>Detailed expense breakdown and context</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-4">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Date</p>
                    <p className="font-medium">{expense.date}</p>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <User className="h-4 w-4 text-gray-500" />
                  <div>
                    <p className="text-sm text-gray-600">Transporter</p>
                    <p className="font-medium">{expense.transporter}</p>
                  </div>
                </div>

                {expense.vehicle && (
                  <div className="flex items-center space-x-2">
                    <Truck className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Vehicle</p>
                      <p className="font-medium">{expense.vehicle}</p>
                    </div>
                  </div>
                )}

                {expense.trip && (
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-gray-500" />
                    <div>
                      <p className="text-sm text-gray-600">Trip/Route</p>
                      <p className="font-medium">{expense.trip}</p>
                    </div>
                  </div>
                )}
              </div>

              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-600">Vendor</p>
                  <p className="font-medium">{expense.vendor}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Invoice Number</p>
                  <p className="font-medium">{expense.invoiceNumber}</p>
                </div>

                <div>
                  <p className="text-sm text-gray-600">Payment Due Date</p>
                  <p className="font-medium">{expense.paymentDueDate}</p>
                </div>

                {expense.odometer > 0 && (
                  <div>
                    <p className="text-sm text-gray-600">Odometer Reading</p>
                    <p className="font-medium">{expense.odometer.toLocaleString()} km</p>
                  </div>
                )}
              </div>
            </div>

            <div>
              <p className="text-sm text-gray-600 mb-2">Description</p>
              <p className="text-sm bg-gray-50 p-3 rounded">{expense.description}</p>
            </div>

            {expense.notes && (
              <div>
                <p className="text-sm text-gray-600 mb-2">Notes</p>
                <p className="text-sm bg-blue-50 p-3 rounded">{expense.notes}</p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Additional Details Based on Expense Type */}
      {expense.expenseType === 'Fuel' && expense.fuelQuantity && (
        <Card>
          <CardHeader>
            <CardTitle>Fuel Purchase Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-gray-600">Quantity</p>
                <p className="font-medium">{expense.fuelQuantity}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Price per Liter</p>
                <p className="font-medium">{expense.pricePerLiter}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Location</p>
                <p className="font-medium">{expense.location}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Payment Method</p>
                <p className="font-medium">{expense.paymentMethod}</p>
              </div>
            </div>
            
            {expense.receiptDetails && (
              <div className="mt-4 p-4 bg-gray-50 rounded">
                <h4 className="font-medium mb-2">Receipt Information</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 text-sm">
                  <div>
                    <span className="text-gray-600">Station:</span> {expense.receiptDetails.stationName}
                  </div>
                  <div>
                    <span className="text-gray-600">Receipt #:</span> {expense.receiptDetails.receiptNumber}
                  </div>
                  <div className="md:col-span-2">
                    <span className="text-gray-600">Address:</span> {expense.receiptDetails.stationAddress}
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      {expense.expenseType === 'Maintenance' && expense.serviceDetails && (
        <Card>
          <CardHeader>
            <CardTitle>Service Details</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
              <div>
                <p className="text-sm text-gray-600">Work Order</p>
                <p className="font-medium">{expense.serviceDetails.workOrderNumber}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Mechanic</p>
                <p className="font-medium">{expense.serviceDetails.mechanicName}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Labor Hours</p>
                <p className="font-medium">{expense.serviceDetails.laborHours}h</p>
              </div>
            </div>
            
            <div className="mb-4">
              <p className="text-sm text-gray-600 mb-2">Parts Replaced</p>
              <div className="flex flex-wrap gap-2">
                {expense.serviceDetails.partsReplaced.map((part, index) => (
                  <Badge key={index} variant="outline">{part}</Badge>
                ))}
              </div>
            </div>
            
            <div>
              <p className="text-sm text-gray-600">Warranty Period</p>
              <p className="font-medium">{expense.serviceDetails.warrantyPeriod}</p>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Approval Information */}
      {expense.status === 'Approved' && expense.approvedBy && (
        <Card>
          <CardHeader>
            <CardTitle>Approval Information</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <p className="text-sm text-gray-600">Approved By</p>
                <p className="font-medium">{expense.approvedBy}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Approval Date</p>
                <p className="font-medium">{expense.approvedDate}</p>
              </div>
              <div>
                <p className="text-sm text-gray-600">Submitted Date</p>
                <p className="font-medium">{expense.submittedDate}</p>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Attachments */}
      {expense.attachments.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle>Attachments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-3">
              {expense.attachments.map((attachment, index) => (
                <div key={index} className="flex items-center space-x-2 p-3 border rounded-lg hover:bg-gray-50 cursor-pointer">
                  <FileText className="h-5 w-5 text-blue-600" />
                  <span className="text-sm font-medium">{attachment}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Actions */}
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-end space-x-4">
            <Button variant="outline">
              <Receipt className="h-4 w-4 mr-2" />
              Download Receipt
            </Button>
            {expense.status === 'Pending' && (
              <>
                <Button variant="outline" className="text-red-600 border-red-600">
                  Reject
                </Button>
                <Button className="bg-green-600 hover:bg-green-700">
                  Approve
                </Button>
              </>
            )}
            <Button variant="outline">
              Edit Expense
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ExpenseDetails;