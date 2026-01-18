import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar as CalendarIcon, HelpCircle, Check, Upload } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/tailwind/utils';

// Types and interfaces
interface IncidentFormData {
  incidentDateTime: Date | null;
  incidentLocation: string;
  reportedBy: string;
  contactInfo: string;
  vehicleDriverInfo: string;
  incidentType: string;
  incidentDescription: string;
  immediateActions: string;
  attachments: File[];
  priority: 'low' | 'medium' | 'high';
}

// Mock data and constants
const incidentTypes = [
  'Accident / Collision',
  'Cargo Damage',
  'Vehicle Breakdown',
  'Theft / Loss',
  'Traffic Violation',
  'Road Blockage',
  'Personal Injury',
  'Other'
];

const priorityLevels = [
  { value: 'low', label: 'Low' },
  { value: 'medium', label: 'Medium' },
  { value: 'high', label: 'High' }
];

const initialFormData: IncidentFormData = {
  incidentDateTime: null,
  incidentLocation: '',
  reportedBy: '',
  contactInfo: '',
  vehicleDriverInfo: '',
  incidentType: '',
  incidentDescription: '',
  immediateActions: '',
  attachments: [],
  priority: 'medium'
};

// Validation function
const validateFormData = (data: IncidentFormData): Record<string, string> => {
  const errors: Record<string, string> = {};

  if (!data.incidentDateTime) {
    errors.incidentDateTime = 'Incident date and time is required';
  } else if (data.incidentDateTime > new Date()) {
    errors.incidentDateTime = 'Incident date cannot be in the future';
  }

  if (!data.incidentLocation.trim()) {
    errors.incidentLocation = 'Incident location is required';
  }

  if (!data.reportedBy.trim()) {
    errors.reportedBy = 'Reporter name is required';
  }

  if (!data.contactInfo.trim()) {
    errors.contactInfo = 'Contact information is required';
  }

  if (!data.vehicleDriverInfo.trim()) {
    errors.vehicleDriverInfo = 'Vehicle and driver information is required';
  }

  if (!data.incidentType) {
    errors.incidentType = 'Incident type is required';
  }

  if (!data.incidentDescription.trim()) {
    errors.incidentDescription = 'Incident description is required';
  }

  if (!data.priority) {
    errors.priority = 'Priority level is required';
  }

  return errors;
};

const IncidentReportForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<IncidentFormData>(initialFormData);
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

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(event.target.files || []);
    setFormData(prev => ({
      ...prev,
      attachments: [...prev.attachments, ...files]
    }));
  };

  const removeAttachment = (index: number) => {
    setFormData(prev => ({
      ...prev,
      attachments: prev.attachments.filter((_, i) => i !== index)
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
    console.log('Submitting incident report:', formData);
    alert('Incident report has been successfully submitted!');
    navigate('/incidents');
  };

  const handleCancel = () => {
    navigate('/incidents');
  };

  const handleEdit = () => {
    setStep(1);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-orange-100 text-orange-800';
      case 'low': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
              <h1 className="text-2xl font-bold text-gray-900">Confirm Incident Report</h1>
              <p className="text-gray-600">Review and confirm all incident details</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Incident Report Confirmation</span>
              </CardTitle>
              <CardDescription>Please review all information before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Incident Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Date & Time:</span>
                      <p className="font-medium">
                        {formData.incidentDateTime ? format(formData.incidentDateTime, 'PPP p') : ''}
                      </p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Location:</span>
                      <p className="font-medium">{formData.incidentLocation}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Type:</span>
                      <p className="font-medium">{formData.incidentType}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Priority:</span>
                      <Badge className={getPriorityColor(formData.priority)}>
                        {priorityLevels.find(p => p.value === formData.priority)?.label}
                      </Badge>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Reporter Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Reported By:</span>
                      <p className="font-medium">{formData.reportedBy}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Contact Info:</span>
                      <p className="font-medium">{formData.contactInfo}</p>
                    </div>
                  </div>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold text-lg mb-4">Vehicle & Driver Information</h3>
                  <p className="text-sm bg-gray-50 p-3 rounded">{formData.vehicleDriverInfo}</p>
                </div>

                <div className="md:col-span-2">
                  <h3 className="font-semibold text-lg mb-4">Incident Description</h3>
                  <p className="text-sm bg-gray-50 p-3 rounded">{formData.incidentDescription}</p>
                </div>

                {formData.immediateActions && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-lg mb-4">Immediate Actions Taken</h3>
                    <p className="text-sm bg-blue-50 p-3 rounded">{formData.immediateActions}</p>
                  </div>
                )}

                {formData.attachments.length > 0 && (
                  <div className="md:col-span-2">
                    <h3 className="font-semibold text-lg mb-4">Attachments</h3>
                    <div className="flex flex-wrap gap-2">
                      {formData.attachments.map((file, index) => (
                        <Badge key={index} variant="outline">
                          📎 {file.name}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button variant="outline" onClick={handleEdit}>
                  Edit Report
                </Button>
                <Button onClick={handleSubmit} className="bg-red-600 hover:bg-red-700">
                  Submit Incident Report
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
            <h1 className="text-2xl font-bold text-gray-900">Report New Incident</h1>
            <p className="text-gray-600">Fill in the details for the transportation incident</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Incident Report Details</CardTitle>
            <CardDescription>Please provide all required information about the incident</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Incident Date and Time */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label>Incident Date and Time *</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Specify the exact date and time when the incident occurred.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Popover>
                <PopoverTrigger asChild>
                  <Button
                    variant="outline"
                    className={cn(
                      "w-full justify-start text-left font-normal",
                      !formData.incidentDateTime && "text-muted-foreground",
                      errors.incidentDateTime && "border-red-500"
                    )}
                  >
                    <CalendarIcon className="mr-2 h-4 w-4" />
                    {formData.incidentDateTime ? format(formData.incidentDateTime, "PPP p") : "Select date and time"}
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0">
                  <Calendar
                    mode="single"
                    selected={formData.incidentDateTime || undefined}
                    onSelect={(date) => handleInputChange('incidentDateTime', date)}
                    disabled={(date) => date > new Date()}
                    initialFocus
                  />
                </PopoverContent>
              </Popover>
              {errors.incidentDateTime && <p className="text-sm text-red-600">{errors.incidentDateTime}</p>}
            </div>

            {/* Incident Location */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="incidentLocation">Incident Location *</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the precise location where the incident occurred. Use autocomplete to ensure accuracy.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="incidentLocation"
                placeholder="Enter incident location..."
                value={formData.incidentLocation}
                onChange={(e) => handleInputChange('incidentLocation', e.target.value)}
                className={errors.incidentLocation ? 'border-red-500' : ''}
              />
              {errors.incidentLocation && <p className="text-sm text-red-600">{errors.incidentLocation}</p>}
            </div>

            {/* Reported By */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="reportedBy">Reported By *</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the name of the employee reporting the incident.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="reportedBy"
                placeholder="Enter reporter name..."
                value={formData.reportedBy}
                onChange={(e) => handleInputChange('reportedBy', e.target.value)}
                className={errors.reportedBy ? 'border-red-500' : ''}
              />
              {errors.reportedBy && <p className="text-sm text-red-600">{errors.reportedBy}</p>}
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="contactInfo">Reporter Contact Information *</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Provide contact details for the person reporting the incident (e.g., phone, email).</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Textarea
                id="contactInfo"
                placeholder="Enter contact information..."
                value={formData.contactInfo}
                onChange={(e) => handleInputChange('contactInfo', e.target.value)}
                className={errors.contactInfo ? 'border-red-500' : ''}
              />
              {errors.contactInfo && <p className="text-sm text-red-600">{errors.contactInfo}</p>}
            </div>

            {/* Vehicle and Driver Information */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="vehicleDriverInfo">Vehicle and Driver Information *</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter details about the vehicle(s) and driver(s) involved. Include vehicle registration, driver name, and contact if known.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Textarea
                id="vehicleDriverInfo"
                placeholder="Enter vehicle and driver details..."
                value={formData.vehicleDriverInfo}
                onChange={(e) => handleInputChange('vehicleDriverInfo', e.target.value)}
                className={errors.vehicleDriverInfo ? 'border-red-500' : ''}
              />
              {errors.vehicleDriverInfo && <p className="text-sm text-red-600">{errors.vehicleDriverInfo}</p>}
            </div>

            {/* Incident Type */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label>Incident Type *</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select the type of incident. This helps categorize and prioritize the report.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Select
                value={formData.incidentType}
                onValueChange={(value) => handleInputChange('incidentType', value)}
              >
                <SelectTrigger className={errors.incidentType ? 'border-red-500' : ''}>
                  <SelectValue placeholder="Select incident type" />
                </SelectTrigger>
                <SelectContent>
                  {incidentTypes.map((type) => (
                    <SelectItem key={type} value={type}>
                      {type}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.incidentType && <p className="text-sm text-red-600">{errors.incidentType}</p>}
            </div>

            {/* Incident Description */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="incidentDescription">Incident Description *</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Describe what happened. Include as much detail as possible about the incident, circumstances, and consequences.</p>
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

            {/* Immediate Actions Taken */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="immediateActions">Immediate Actions Taken</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Describe any immediate actions taken at the scene (e.g., emergency services called, cargo secured, traffic redirected).</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Textarea
                id="immediateActions"
                placeholder="Describe immediate actions taken..."
                value={formData.immediateActions}
                onChange={(e) => handleInputChange('immediateActions', e.target.value)}
                rows={3}
              />
            </div>

            {/* Attachments */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="attachments">Attachments (Photos/Documents)</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Upload any relevant photos, documents, or evidence related to the incident.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-4">
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <span className="mt-2 block text-sm font-medium text-gray-900">
                        Upload files
                      </span>
                      <span className="mt-1 block text-sm text-gray-500">
                        PNG, JPG, PDF up to 10MB
                      </span>
                    </label>
                    <input
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                      multiple
                      accept=".png,.jpg,.jpeg,.pdf,.doc,.docx"
                      onChange={handleFileUpload}
                    />
                  </div>
                </div>
              </div>
              {formData.attachments.length > 0 && (
                <div className="mt-4">
                  <p className="text-sm font-medium text-gray-700 mb-2">Uploaded files:</p>
                  <div className="space-y-2">
                    {formData.attachments.map((file, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                        <span className="text-sm">{file.name}</span>
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeAttachment(index)}
                        >
                          Remove
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Priority Level */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label>Priority Level *</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Set the urgency of this incident report. High priority incidents require immediate attention.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <RadioGroup
                value={formData.priority}
                onValueChange={(value) => handleInputChange('priority', value)}
                className="flex space-x-6"
              >
                {priorityLevels.map((level) => (
                  <div key={level.value} className="flex items-center space-x-2">
                    <RadioGroupItem value={level.value} id={level.value} />
                    <Label htmlFor={level.value}>{level.label}</Label>
                  </div>
                ))}
              </RadioGroup>
              {errors.priority && <p className="text-sm text-red-600">{errors.priority}</p>}
            </div>

            <div className="flex justify-end space-x-4 pt-6 border-t">
              <Button variant="outline" onClick={handleCancel}>
                Cancel
              </Button>
              <Button onClick={handleProceed} className="bg-red-600 hover:bg-red-700">
                Proceed
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    </TooltipProvider>
  );
};

export default IncidentReportForm;