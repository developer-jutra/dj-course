import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar as CalendarIcon, HelpCircle, Check, Upload, Plus, Trash2 } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/tailwind/utils';

// Types and interfaces
interface ClaimItem {
  item: string;
  quantity: number;
  description: string;
  valuePerItem: number;
  totalValue: number;
}

interface ClaimFormData {
  claimantName: string;
  claimantPhone: string;
  claimantEmail: string;
  shipmentReference: string;
  shipmentDate: Date | null;
  deliveryDate: Date | null;
  originLocation: string;
  destinationLocation: string;
  claimType: string;
  claimTypeOther: string;
  incidentDescription: string;
  claimedItems: ClaimItem[];
  totalClaimedAmount: number;
  supportingDocuments: File[];
  insurancePolicyNumber: string;
  insuranceCertificate: File | null;
  submissionDate: Date;
  declarationAccepted: boolean;
  claimantSignature: string;
}

// Mock data and constants
const claimTypes = [
  'Lost',
  'Damaged',
  'Short Shipped',
  'Delayed',
  'Non-delivery',
  'Other'
];

const initialClaimItem: ClaimItem = {
  item: '',
  quantity: 1,
  description: '',
  valuePerItem: 0,
  totalValue: 0
};

const initialFormData: ClaimFormData = {
  claimantName: '',
  claimantPhone: '',
  claimantEmail: '',
  shipmentReference: '',
  shipmentDate: null,
  deliveryDate: null,
  originLocation: '',
  destinationLocation: '',
  claimType: '',
  claimTypeOther: '',
  incidentDescription: '',
  claimedItems: [{ ...initialClaimItem }],
  totalClaimedAmount: 0,
  supportingDocuments: [],
  insurancePolicyNumber: '',
  insuranceCertificate: null,
  submissionDate: new Date(),
  declarationAccepted: false,
  claimantSignature: ''
};

// Validation function
const validateFormData = (data: ClaimFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.claimantName.trim()) {
    errors.claimantName = 'Claimant name is required';
  }

  if (!data.claimantPhone.trim() && !data.claimantEmail.trim()) {
    errors.contact = 'At least one contact method (phone or email) is required';
  }

  if (!data.shipmentReference.trim()) {
    errors.shipmentReference = 'Shipment reference number is required';
  }

  if (!data.shipmentDate) {
    errors.shipmentDate = 'Shipment date is required';
  }

  if (!data.originLocation.trim()) {
    errors.originLocation = 'Origin location is required';
  }

  if (!data.destinationLocation.trim()) {
    errors.destinationLocation = 'Destination location is required';
  }

  if (!data.claimType) {
    errors.claimType = 'Claim type is required';
  }

  if (data.claimType === 'Other' && !data.claimTypeOther.trim()) {
    errors.claimTypeOther = 'Please specify the claim type';
  }

  if (!data.incidentDescription.trim()) {
    errors.incidentDescription = 'Incident description is required';
  }

  if (data.claimedItems.length === 0 || data.claimedItems.every(item => !item.item.trim())) {
    errors.claimedItems = 'At least one claimed item is required';
  }

  if (data.totalClaimedAmount <= 0) {
    errors.totalClaimedAmount = 'Total claimed amount must be greater than 0';
  }

  if (data.supportingDocuments.length === 0) {
    errors.supportingDocuments = 'At least one supporting document is required';
  }

  if (!data.declarationAccepted) {
    errors.declarationAccepted = 'You must accept the declaration';
  }

  if (!data.claimantSignature.trim()) {
    errors.claimantSignature = 'Claimant signature is required';
  }

  return errors;
};

const CustomerClaimForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<ClaimFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }));
    }
  };

  const handleClaimItemChange = (index: number, field: keyof ClaimItem, value: any) => {
    const updatedItems = [...formData.claimedItems];
    updatedItems[index] = {
      ...updatedItems[index],
      [field]: value
    };

    // Calculate total value for the item
    if (field === 'quantity' || field === 'valuePerItem') {
      updatedItems[index].totalValue = updatedItems[index].quantity * updatedItems[index].valuePerItem;
    }

    setFormData(prev => ({
      ...prev,
      claimedItems: updatedItems,
      totalClaimedAmount: updatedItems.reduce((sum, item) => sum + item.totalValue, 0)
    }));

    if (errors.claimedItems) {
      setErrors(prev => ({
        ...prev,
        claimedItems: ''
      }));
    }
  };

  const addClaimItem = () => {
    setFormData(prev => ({
      ...prev,
      claimedItems: [...prev.claimedItems, { ...initialClaimItem }]
    }));
  };

  const removeClaimItem = (index: number) => {
    if (formData.claimedItems.length > 1) {
      const updatedItems = formData.claimedItems.filter((_, i) => i !== index);
      setFormData(prev => ({
        ...prev,
        claimedItems: updatedItems,
        totalClaimedAmount: updatedItems.reduce((sum, item) => sum + item.totalValue, 0)
      }));
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>, field: 'supportingDocuments' | 'insuranceCertificate') => {
    const files = Array.from(event.target.files || []);
    
    if (field === 'supportingDocuments') {
      setFormData(prev => ({
        ...prev,
        supportingDocuments: [...prev.supportingDocuments, ...files]
      }));
      
      if (errors.supportingDocuments) {
        setErrors(prev => ({
          ...prev,
          supportingDocuments: ''
        }));
      }
    } else if (field === 'insuranceCertificate' && files[0]) {
      setFormData(prev => ({
        ...prev,
        insuranceCertificate: files[0]
      }));
    }
  };

  const removeDocument = (index: number) => {
    setFormData(prev => ({
      ...prev,
      supportingDocuments: prev.supportingDocuments.filter((_, i) => i !== index)
    }));
  };

  const handleProceed = () => {
    const validationErrors = validateFormData(formData);
    
    if (Object.keys(validationErrors).length > 0) {
      setErrors(validationErrors);
      return;
    }
    
    setStep(2);
  };

  const handleSubmit = () => {
    // Simulate API call
    console.log('Submitting customer claim:', formData);
    alert('Customer claim has been successfully submitted!');
    navigate('/claims');
  };

  const handleCancel = () => {
    navigate('/claims');
  };

  const handleEdit = () => {
    setStep(1);
  };

  if (step === 2) {
    return (
      <TooltipProvider>
        <div className="space-y-6">
          <div className="flex items-center space-x-4">
            <Button variant="outline" onClick={handleEdit}>
              <ArrowLeft className="h-4 w-4 mr-2" />
              Edit
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Confirm Customer Claim</h1>
              <p className="text-gray-600">Review and confirm all claim details</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Claim Confirmation</span>
              </CardTitle>
              <CardDescription>Please review all information before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Claimant Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Name:</span>
                      <p className="font-medium">{formData.claimantName}</p>
                    </div>
                    {formData.claimantPhone && (
                      <div>
                        <span className="text-sm text-gray-600">Phone:</span>
                        <p className="font-medium">{formData.claimantPhone}</p>
                      </div>
                    )}
                    {formData.claimantEmail && (
                      <div>
                        <span className="text-sm text-gray-600">Email:</span>
                        <p className="font-medium">{formData.claimantEmail}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Shipment Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Reference Number:</span>
                      <p className="font-medium">{formData.shipmentReference}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Shipment Date:</span>
                      <p className="font-medium">{formData.shipmentDate ? format(formData.shipmentDate, 'PPP') : ''}</p>
                    </div>
                    {formData.deliveryDate && (
                      <div>
                        <span className="text-sm text-gray-600">Delivery Date:</span>
                        <p className="font-medium">{format(formData.deliveryDate, 'PPP')}</p>
                      </div>
                    )}
                    <div>
                      <span className="text-sm text-gray-600">Route:</span>
                      <p className="font-medium">{formData.originLocation} → {formData.destinationLocation}</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold text-lg mb-4">Claim Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Claim Type:</span>
                      <p className="font-medium">
                        {formData.claimType === 'Other' ? formData.claimTypeOther : formData.claimType}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Description:</span>
                      <p className="text-sm bg-gray-50 p-3 rounded">{formData.incidentDescription}</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold text-lg mb-4">Claimed Items</h3>
                  <div className="overflow-x-auto">
                    <table className="w-full border-collapse border border-gray-300">
                      <thead>
                        <tr className="bg-gray-50">
                          <th className="border border-gray-300 p-2 text-left">Item</th>
                          <th className="border border-gray-300 p-2 text-left">Quantity</th>
                          <th className="border border-gray-300 p-2 text-left">Description</th>
                          <th className="border border-gray-300 p-2 text-left">Value per Item</th>
                          <th className="border border-gray-300 p-2 text-left">Total Value</th>
                        </tr>
                      </thead>
                      <tbody>
                        {formData.claimedItems.map((item, index) => (
                          <tr key={index}>
                            <td className="border border-gray-300 p-2">{item.item}</td>
                            <td className="border border-gray-300 p-2">{item.quantity}</td>
                            <td className="border border-gray-300 p-2">{item.description}</td>
                            <td className="border border-gray-300 p-2">${item.valuePerItem.toFixed(2)}</td>
                            <td className="border border-gray-300 p-2">${item.totalValue.toFixed(2)}</td>
                          </tr>
                        ))}
                        <tr className="bg-gray-50 font-semibold">
                          <td colSpan={4} className="border border-gray-300 p-2 text-right">Total Claimed Amount:</td>
                          <td className="border border-gray-300 p-2">${formData.totalClaimedAmount.toFixed(2)}</td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>

                {formData.supportingDocuments.length > 0 && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-lg mb-4">Supporting Documents</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.supportingDocuments.map((file, index) => (
                        <Badge key={index} variant="outline">
                          📎 {file.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}

                {formData.insurancePolicyNumber && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-lg mb-4">Insurance Information</h3>
                    <div className="space-y-2">
                      <div>
                        <span className="text-sm text-gray-600">Policy Number:</span>
                        <p className="font-medium">{formData.insurancePolicyNumber}</p>
                      </div>
                      {formData.insuranceCertificate && (
                        <div>
                          <span className="text-sm text-gray-600">Certificate:</span>
                          <p className="font-medium">{formData.insuranceCertificate.name}</p>
                        </div>
                      )}
                    </div>
                  </div>
                )}

                <div className="md:col-span-2">
                  <h3 className="font-semibold text-lg mb-4">Declaration</h3>
                  <div className="bg-blue-50 p-4 rounded">
                    <p className="text-sm text-blue-800 mb-2">
                      ✓ I declare that the information provided is true and complete to the best of my knowledge.
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Signature:</strong> {formData.claimantSignature}
                    </p>
                    <p className="text-sm text-gray-600">
                      <strong>Date:</strong> {format(formData.submissionDate, 'PPP')}
                    </p>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button variant="outline" onClick={handleEdit}>
                  Edit Claim
                </Button>
                <Button onClick={handleSubmit} className="bg-blue-600 hover:bg-blue-700">
                  Submit Claim
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TooltipProvider>
    );
  }

  return (
    <TooltipProvider>
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <Button variant="outline" onClick={handleCancel}>
            <ArrowLeft className="h-4 w-4 mr-2" />
            Cancel
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Submit New Customer Claim</h1>
            <p className="text-gray-600">Fill in the details for the customer claim</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Customer Claim Details</CardTitle>
            <CardDescription>Please provide all required information for the claim</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Claimant Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Claimant Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="claimantName">Claimant Name *</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter your name and contact details so we can reach you regarding your claim.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="claimantName"
                    placeholder="Enter your name..."
                    value={formData.claimantName}
                    onChange={(e) => handleInputChange('claimantName', e.target.value)}
                    className={errors.claimantName ? 'border-red-500' : ''}
                  />
                  {errors.claimantName && <p className="text-sm text-red-600">{errors.claimantName}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="claimantPhone">Phone Number</Label>
                  <Input
                    id="claimantPhone"
                    placeholder="Enter phone number..."
                    value={formData.claimantPhone}
                    onChange={(e) => handleInputChange('claimantPhone', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="claimantEmail">Email Address</Label>
                  <Input
                    id="claimantEmail"
                    type="email"
                    placeholder="Enter email address..."
                    value={formData.claimantEmail}
                    onChange={(e) => handleInputChange('claimantEmail', e.target.value)}
                  />
                </div>
              </div>
              {errors.contact && <p className="text-sm text-red-600">{errors.contact}</p>}
            </div>

            {/* Shipment Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Shipment Information</h3>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="shipmentReference">Shipment Reference Number *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Enter the shipment or tracking number as shown on your shipping documents (e.g., Bill of Lading, Invoice, or Tracking ID).</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Input
                  id="shipmentReference"
                  placeholder="Enter shipment reference number..."
                  value={formData.shipmentReference}
                  onChange={(e) => handleInputChange('shipmentReference', e.target.value)}
                  className={errors.shipmentReference ? 'border-red-500' : ''}
                />
                {errors.shipmentReference && <p className="text-sm text-red-600">{errors.shipmentReference}</p>}
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label>Date of Shipment *</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Select the shipment date and, if delivered, the date of delivery.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.shipmentDate && "text-muted-foreground",
                          errors.shipmentDate && "border-red-500"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.shipmentDate ? format(formData.shipmentDate, "PPP") : "Select shipment date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.shipmentDate || undefined}
                        onSelect={(date) => handleInputChange('shipmentDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                  {errors.shipmentDate && <p className="text-sm text-red-600">{errors.shipmentDate}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Date of Delivery (if applicable)</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className={cn(
                          "w-full justify-start text-left font-normal",
                          !formData.deliveryDate && "text-muted-foreground"
                        )}
                      >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {formData.deliveryDate ? format(formData.deliveryDate, "PPP") : "Select delivery date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0">
                      <Calendar
                        mode="single"
                        selected={formData.deliveryDate || undefined}
                        onSelect={(date) => handleInputChange('deliveryDate', date)}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="originLocation">Origin (Pickup Location) *</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Enter the addresses for where the shipment was picked up and where it was supposed to be delivered.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="originLocation"
                    placeholder="Enter pickup location..."
                    value={formData.originLocation}
                    onChange={(e) => handleInputChange('originLocation', e.target.value)}
                    className={errors.originLocation ? 'border-red-500' : ''}
                  />
                  {errors.originLocation && <p className="text-sm text-red-600">{errors.originLocation}</p>}
                </div>

                <div className="space-y-2">
                  <Label htmlFor="destinationLocation">Destination (Delivery Location) *</Label>
                  <Input
                    id="destinationLocation"
                    placeholder="Enter delivery location..."
                    value={formData.destinationLocation}
                    onChange={(e) => handleInputChange('destinationLocation', e.target.value)}
                    className={errors.destinationLocation ? 'border-red-500' : ''}
                  />
                  {errors.destinationLocation && <p className="text-sm text-red-600">{errors.destinationLocation}</p>}
                </div>
              </div>
            </div>

            {/* Claim Details */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Claim Details</h3>
              
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label>Type of Claim *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select the reason for your claim: lost, damaged, short shipped, delayed, or other.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Select
                  value={formData.claimType}
                  onValueChange={(value) => handleInputChange('claimType', value)}
                >
                  <SelectTrigger className={errors.claimType ? 'border-red-500' : ''}>
                    <SelectValue placeholder="Select claim type" />
                  </SelectTrigger>
                  <SelectContent>
                    {claimTypes.map((type) => (
                      <SelectItem key={type} value={type}>
                        {type}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                {errors.claimType && <p className="text-sm text-red-600">{errors.claimType}</p>}
              </div>

              {formData.claimType === 'Other' && (
                <div className="space-y-2">
                  <Label htmlFor="claimTypeOther">Please specify *</Label>
                  <Input
                    id="claimTypeOther"
                    placeholder="Specify the claim type..."
                    value={formData.claimTypeOther}
                    onChange={(e) => handleInputChange('claimTypeOther', e.target.value)}
                    className={errors.claimTypeOther ? 'border-red-500' : ''}
                  />
                  {errors.claimTypeOther && <p className="text-sm text-red-600">{errors.claimTypeOther}</p>}
                </div>
              )}

              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label htmlFor="incidentDescription">Description of Incident *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Describe what happened, including the nature and extent of the issue (e.g., water damage to electronics, missing items, delivery delay).</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Textarea
                  id="incidentDescription"
                  placeholder="Describe the incident in detail..."
                  value={formData.incidentDescription}
                  onChange={(e) => handleInputChange('incidentDescription', e.target.value)}
                  className={errors.incidentDescription ? 'border-red-500' : ''}
                  rows={4}
                />
                {errors.incidentDescription && <p className="text-sm text-red-600">{errors.incidentDescription}</p>}
              </div>
            </div>

            {/* Claimed Items */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <h3 className="text-lg font-semibold">Claimed Items and Amount *</h3>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>List the items being claimed, including quantities, descriptions, and the value of each. Enter the total amount you are claiming.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Button type="button" onClick={addClaimItem} size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Item
                </Button>
              </div>

              <div className="space-y-4">
                {formData.claimedItems.map((item, index) => (
                  <div key={index} className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-4">
                      <h4 className="font-medium">Item {index + 1}</h4>
                      {formData.claimedItems.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeClaimItem(index)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    
                    <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                      <div>
                        <Label>Item Name</Label>
                        <Input
                          placeholder="Item name..."
                          value={item.item}
                          onChange={(e) => handleClaimItemChange(index, 'item', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Quantity</Label>
                        <Input
                          type="number"
                          min="1"
                          value={item.quantity || ''}
                          onChange={(e) => handleClaimItemChange(index, 'quantity', parseInt(e.target.value) || 1)}
                        />
                      </div>
                      <div>
                        <Label>Description</Label>
                        <Input
                          placeholder="Description..."
                          value={item.description}
                          onChange={(e) => handleClaimItemChange(index, 'description', e.target.value)}
                        />
                      </div>
                      <div>
                        <Label>Value per Item ($)</Label>
                        <Input
                          type="number"
                          min="0"
                          step="0.01"
                          value={item.valuePerItem || ''}
                          onChange={(e) => handleClaimItemChange(index, 'valuePerItem', parseFloat(e.target.value) || 0)}
                        />
                      </div>
                      <div>
                        <Label>Total Value ($)</Label>
                        <Input
                          value={item.totalValue.toFixed(2)}
                          readOnly
                          className="bg-gray-50"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>

              <div className="bg-gray-50 p-4 rounded-lg">
                <div className="flex justify-between items-center">
                  <span className="font-semibold">Total Claimed Amount:</span>
                  <span className="text-xl font-bold">${formData.totalClaimedAmount.toFixed(2)}</span>
                </div>
              </div>
              {errors.claimedItems && <p className="text-sm text-red-600">{errors.claimedItems}</p>}
              {errors.totalClaimedAmount && <p className="text-sm text-red-600">{errors.totalClaimedAmount}</p>}
            </div>

            {/* Supporting Documents */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="supportingDocuments">Supporting Documents *</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Attach supporting documents such as the bill of lading, delivery receipt, photos of damage, commercial invoice, inspection reports, or correspondence with the carrier.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="supporting-docs-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload supporting documents
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        PNG, JPG, PDF up to 10MB each
                      </span>
                    </label>
                    <input
                      id="supporting-docs-upload"
                      name="supporting-docs-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                      onChange={(e) => handleFileUpload(e, 'supportingDocuments')}
                    />
                  </div>
                </div>
              </div>
              {formData.supportingDocuments.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Uploaded documents:</p>
                  <div className="space-y-2">
                    {formData.supportingDocuments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeDocument(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {errors.supportingDocuments && <p className="text-sm text-red-600">{errors.supportingDocuments}</p>}
            </div>

            {/* Insurance Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Insurance Information (Optional)</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="insurancePolicyNumber">Insurance Policy Number</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>If this shipment was insured, provide the policy number and attach the certificate if available.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="insurancePolicyNumber"
                    placeholder="Enter policy number..."
                    value={formData.insurancePolicyNumber}
                    onChange={(e) => handleInputChange('insurancePolicyNumber', e.target.value)}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="insuranceCertificate">Insurance Certificate</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                    <div className="text-center">
                      <label htmlFor="insurance-cert-upload" className="cursor-pointer">
                        <span className="text-sm text-gray-600">
                          {formData.insuranceCertificate ? formData.insuranceCertificate.name : 'Upload certificate'}
                        </span>
                      </label>
                      <input
                        id="insurance-cert-upload"
                        name="insurance-cert-upload"
                        type="file"
                        className="sr-only"
                        accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                        onChange={(e) => handleFileUpload(e, 'insuranceCertificate')}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Declaration and Signature */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold">Declaration and Signature</h3>
              
              <div className="space-y-4">
                <div className="flex items-start space-x-2">
                  <Checkbox
                    id="declaration"
                    checked={formData.declarationAccepted}
                    onCheckedChange={(checked) => handleInputChange('declarationAccepted', checked)}
                  />
                  <div className="space-y-1">
                    <Label htmlFor="declaration" className="text-sm">
                      Declaration *
                    </Label>
                    <p className="text-sm text-gray-600">
                      I confirm that the information provided is true and complete to the best of my knowledge.
                    </p>
                  </div>
                </div>
                {errors.declarationAccepted && <p className="text-sm text-red-600">{errors.declarationAccepted}</p>}

                <div className="space-y-2">
                  <div className="flex items-center space-x-2">
                    <Label htmlFor="claimantSignature">Digital Signature *</Label>
                    <Tooltip>
                      <TooltipTrigger>
                        <HelpCircle className="h-4 w-4 text-gray-400" />
                      </TooltipTrigger>
                      <TooltipContent>
                        <p>Confirm that the information provided is true and complete to the best of your knowledge.</p>
                      </TooltipContent>
                    </Tooltip>
                  </div>
                  <Input
                    id="claimantSignature"
                    placeholder="Type your full name as signature..."
                    value={formData.claimantSignature}
                    onChange={(e) => handleInputChange('claimantSignature', e.target.value)}
                    className={errors.claimantSignature ? 'border-red-500' : ''}
                  />
                  {errors.claimantSignature && <p className="text-sm text-red-600">{errors.claimantSignature}</p>}
                </div>

                <div className="space-y-2">
                  <Label>Date of Claim Submission</Label>
                  <Input
                    value={format(formData.submissionDate, 'PPP')}
                    readOnly
                    className="bg-gray-50"
                  />
                </div>
              </div>
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleProceed} className="bg-blue-600 hover:bg-blue-700">
                Proceed
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default CustomerClaimForm;