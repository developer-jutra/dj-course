import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Calendar as CalendarIcon, HelpCircle, Check } from 'lucide-react';
import { format } from 'date-fns';
import { cn } from '@/lib/tailwind/utils';
import { 
  NewOrderFormData, 
  Customer, 
  mockCustomers, 
  cargoTypes, 
  priorityLevels, 
  weightUnits, 
  dimensionUnits, 
  initialFormData, 
  validateFormData 
} from './additional';

const NewOrderForm = () => {
  const navigate = useNavigate();
  const [step, setStep] = useState<1 | 2>(1);
  const [formData, setFormData] = useState<NewOrderFormData>(initialFormData);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [customerSearch, setCustomerSearch] = useState('');
  const [showCustomerDropdown, setShowCustomerDropdown] = useState(false);

  const filteredCustomers = mockCustomers.filter(customer =>
    customer.name.toLowerCase().includes(customerSearch.toLowerCase()) ||
    customer.company.toLowerCase().includes(customerSearch.toLowerCase())
  );

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

  const handleNestedInputChange = (parent: string, field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [parent]: {
        ...prev[parent as keyof NewOrderFormData] as any,
        [field]: value
      }
    }));
    
    // Clear error when user starts typing
    const errorKey = `${parent}${field.charAt(0).toUpperCase() + field.slice(1)}`;
    if (errors[errorKey] || errors[parent]) {
      setErrors(prev => ({
        ...prev,
        [errorKey]: '',
        [parent]: ''
      }));
    }
  };

  const handleCargoTypeChange = (cargoType: string, checked: boolean) => {
    setFormData(prev => ({
      ...prev,
      cargoType: checked 
        ? [...prev.cargoType, cargoType]
        : prev.cargoType.filter(type => type !== cargoType)
    }));
    
    if (errors.cargoType) {
      setErrors(prev => ({
        ...prev,
        cargoType: ''
      }));
    }
  };

  const handleCustomerSelect = (customer: Customer) => {
    setFormData(prev => ({ ...prev, customer }));
    setCustomerSearch(customer.name);
    setShowCustomerDropdown(false);
    
    if (errors.customer) {
      setErrors(prev => ({
        ...prev,
        customer: ''
      }));
    }
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
    console.log('Submitting order:', formData);
    alert('Transportation order has been successfully created!');
    navigate('/orders');
  };

  const handleCancel = () => {
    navigate('/orders');
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
              <h1 className="text-2xl font-bold text-gray-900">Confirm Transportation Order</h1>
              <p className="text-gray-600">Review and confirm all order details</p>
            </div>
          </div>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Check className="h-5 w-5 text-green-600" />
                <span>Order Confirmation</span>
              </CardTitle>
              <CardDescription>Please review all information before submitting</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h3 className="font-semibold text-lg mb-4">Customer Information</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Customer:</span>
                      <p className="font-medium">{formData.customer?.name}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Company:</span>
                      <p className="font-medium">{formData.customer?.company}</p>
                    </div>
                    {formData.contactInfo && (
                      <div>
                        <span className="text-sm text-gray-600">Contact Notes:</span>
                        <p className="font-medium">{formData.contactInfo}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Cargo Details</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Cargo Types:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {formData.cargoType.map(type => (
                          <Badge key={type} variant="outline">{type}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Weight:</span>
                      <p className="font-medium">{formData.weight.value} {formData.weight.unit}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Dimensions:</span>
                      <p className="font-medium">
                        {formData.dimensions.length} × {formData.dimensions.width} × {formData.dimensions.height} {formData.dimensions.unit}
                      </p>
                    </div>
                    {formData.specialHandling && (
                      <div>
                        <span className="text-sm text-gray-600">Special Handling:</span>
                        <p className="font-medium">{formData.specialHandling}</p>
                      </div>
                    )}
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Locations & Dates</h3>
                  <div className="space-y-2">
                    <div>
                      <span className="text-sm text-gray-600">Pickup Location:</span>
                      <p className="font-medium">{formData.pickupLocation}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Delivery Location:</span>
                      <p className="font-medium">{formData.deliveryLocation}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Pickup Date:</span>
                      <p className="font-medium">{formData.pickupDate ? format(formData.pickupDate, 'PPP') : ''}</p>
                    </div>
                    <div>
                      <span className="text-sm text-gray-600">Delivery Date:</span>
                      <p className="font-medium">{formData.deliveryDate ? format(formData.deliveryDate, 'PPP') : ''}</p>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="font-semibold text-lg mb-4">Priority</h3>
                  <div>
                    <Badge className={
                      formData.priority === 'urgent' ? 'bg-red-100 text-red-800' :
                      formData.priority === 'express' ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }>
                      {priorityLevels.find(p => p.value === formData.priority)?.label}
                    </Badge>
                  </div>
                </div>
              </div>

              <div className="flex justify-end space-x-4 pt-6 border-t">
                <Button variant="outline" onClick={handleEdit}>
                  Edit Order
                </Button>
                <Button onClick={handleSubmit} className="bg-green-600 hover:bg-green-700">
                  Submit Order
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
            <h1 className="text-2xl font-bold text-gray-900">Create New Transportation Order</h1>
            <p className="text-gray-600">Fill in the details for the new transportation order</p>
          </div>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Order Details</CardTitle>
            <CardDescription>Please provide all required information for the transportation order</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            {/* Customer Selection */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="customer">Customer *</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select the customer requesting the transportation order. Start typing to search for existing customers in the database.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="relative">
                <Input
                  id="customer"
                  placeholder="Search for customer..."
                  value={customerSearch}
                  onChange={(e) => {
                    setCustomerSearch(e.target.value);
                    setShowCustomerDropdown(true);
                  }}
                  onFocus={() => setShowCustomerDropdown(true)}
                  className={errors.customer ? 'border-red-500' : ''}
                />
                {showCustomerDropdown && filteredCustomers.length > 0 && (
                  <div className="absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
                    {filteredCustomers.map((customer) => (
                      <div
                        key={customer.id}
                        className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                        onClick={() => handleCustomerSelect(customer)}
                      >
                        <div className="font-medium">{customer.name}</div>
                        <div className="text-sm text-gray-600">{customer.company}</div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              {errors.customer && <p className="text-sm text-red-600">{errors.customer}</p>}
            </div>

            {/* Contact Information */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="contactInfo">Contact Information / Requestor Notes</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter any relevant contact information or notes about the person who requested this order. This can include names, phone numbers, or any other details provided by the requestor.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Textarea
                id="contactInfo"
                placeholder="Enter contact information or notes..."
                value={formData.contactInfo}
                onChange={(e) => handleInputChange('contactInfo', e.target.value)}
              />
            </div>

            {/* Cargo Type */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label>Cargo Type *</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Select the type(s) of cargo to be transported. This helps determine special handling and vehicle requirements.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {cargoTypes.map((type) => (
                  <div key={type} className="flex items-center space-x-2">
                    <Checkbox
                      id={type}
                      checked={formData.cargoType.includes(type)}
                      onCheckedChange={(checked) => handleCargoTypeChange(type, checked as boolean)}
                    />
                    <Label htmlFor={type} className="text-sm">{type}</Label>
                  </div>
                ))}
              </div>
              {errors.cargoType && <p className="text-sm text-red-600">{errors.cargoType}</p>}
            </div>

            {/* Special Handling Instructions */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="specialHandling">Special Handling Instructions</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Provide any additional instructions for handling the cargo, such as 'Handle with care', 'Do not stack', or other requirements.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Textarea
                id="specialHandling"
                placeholder="Enter special handling instructions..."
                value={formData.specialHandling}
                onChange={(e) => handleInputChange('specialHandling', e.target.value)}
              />
            </div>

            {/* Weight and Dimensions */}
            <div className="space-y-4">
              <div className="flex items-center space-x-2">
                <Label>Cargo Weight and Dimensions *</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Specify the total weight and dimensions of the cargo. This information is essential for vehicle assignment and route planning.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              
              {/* Weight */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="weight">Weight *</Label>
                  <div className="flex space-x-2">
                    <Input
                      id="weight"
                      type="number"
                      placeholder="0"
                      value={formData.weight.value || ''}
                      onChange={(e) => handleNestedInputChange('weight', 'value', parseFloat(e.target.value) || 0)}
                      className={errors.weight ? 'border-red-500' : ''}
                    />
                    <Select
                      value={formData.weight.unit}
                      onValueChange={(value) => handleNestedInputChange('weight', 'unit', value)}
                    >
                      <SelectTrigger className="w-20">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        {weightUnits.map((unit) => (
                          <SelectItem key={unit.value} value={unit.value}>
                            {unit.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {errors.weight && <p className="text-sm text-red-600">{errors.weight}</p>}
                </div>
              </div>

              {/* Dimensions */}
              <div>
                <Label>Dimensions *</Label>
                <div className="grid grid-cols-4 gap-2">
                  <div>
                    <Input
                      type="number"
                      placeholder="Length"
                      value={formData.dimensions.length || ''}
                      onChange={(e) => handleNestedInputChange('dimensions', 'length', parseFloat(e.target.value) || 0)}
                      className={errors.dimensionsLength ? 'border-red-500' : ''}
                    />
                    {errors.dimensionsLength && <p className="text-xs text-red-600">{errors.dimensionsLength}</p>}
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Width"
                      value={formData.dimensions.width || ''}
                      onChange={(e) => handleNestedInputChange('dimensions', 'width', parseFloat(e.target.value) || 0)}
                      className={errors.dimensionsWidth ? 'border-red-500' : ''}
                    />
                    {errors.dimensionsWidth && <p className="text-xs text-red-600">{errors.dimensionsWidth}</p>}
                  </div>
                  <div>
                    <Input
                      type="number"
                      placeholder="Height"
                      value={formData.dimensions.height || ''}
                      onChange={(e) => handleNestedInputChange('dimensions', 'height', parseFloat(e.target.value) || 0)}
                      className={errors.dimensionsHeight ? 'border-red-500' : ''}
                    />
                    {errors.dimensionsHeight && <p className="text-xs text-red-600">{errors.dimensionsHeight}</p>}
                  </div>
                  <Select
                    value={formData.dimensions.unit}
                    onValueChange={(value) => handleNestedInputChange('dimensions', 'unit', value)}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {dimensionUnits.map((unit) => (
                        <SelectItem key={unit.value} value={unit.value}>
                          {unit.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
            </div>

            {/* Pickup Location */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="pickupLocation">Pickup Location *</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the address or location where the cargo will be picked up. Use the autocomplete to speed up entry and ensure accuracy.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="pickupLocation"
                placeholder="Enter pickup address..."
                value={formData.pickupLocation}
                onChange={(e) => handleInputChange('pickupLocation', e.target.value)}
                className={errors.pickupLocation ? 'border-red-500' : ''}
              />
              {errors.pickupLocation && <p className="text-sm text-red-600">{errors.pickupLocation}</p>}
            </div>

            {/* Delivery Location */}
            <div className="space-y-2">
              <div className="flex items-center space-x-2">
                <Label htmlFor="deliveryLocation">Delivery Location *</Label>
                <Tooltip>
                  <TooltipTrigger>
                    <HelpCircle className="h-4 w-4 text-gray-400" />
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enter the address or location where the cargo will be delivered. Use the autocomplete to ensure address accuracy.</p>
                  </TooltipContent>
                </Tooltip>
              </div>
              <Input
                id="deliveryLocation"
                placeholder="Enter delivery address..."
                value={formData.deliveryLocation}
                onChange={(e) => handleInputChange('deliveryLocation', e.target.value)}
                className={errors.deliveryLocation ? 'border-red-500' : ''}
              />
              {errors.deliveryLocation && <p className="text-sm text-red-600">{errors.deliveryLocation}</p>}
            </div>

            {/* Desired Dates */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <div className="flex items-center space-x-2">
                  <Label>Desired Pickup Date *</Label>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-gray-400" />
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Select the preferred pickup and delivery dates for the transportation order. Delivery date must not be earlier than the pickup date.</p>
                    </TooltipContent>
                  </Tooltip>
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.pickupDate && "text-muted-foreground",
                        errors.pickupDate && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.pickupDate ? format(formData.pickupDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.pickupDate || undefined}
                      onSelect={(date) => handleInputChange('pickupDate', date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.pickupDate && <p className="text-sm text-red-600">{errors.pickupDate}</p>}
              </div>

              <div className="space-y-2">
                <Label>Desired Delivery Date *</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant="outline"
                      className={cn(
                        "w-full justify-start text-left font-normal",
                        !formData.deliveryDate && "text-muted-foreground",
                        errors.deliveryDate && "border-red-500"
                      )}
                    >
                      <CalendarIcon className="mr-2 h-4 w-4" />
                      {formData.deliveryDate ? format(formData.deliveryDate, "PPP") : "Pick a date"}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0">
                    <Calendar
                      mode="single"
                      selected={formData.deliveryDate || undefined}
                      onSelect={(date) => handleInputChange('deliveryDate', date)}
                      disabled={(date) => formData.pickupDate ? date < formData.pickupDate : date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                {errors.deliveryDate && <p className="text-sm text-red-600">{errors.deliveryDate}</p>}
              </div>
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
                    <p>Select the priority level for this order. Higher priority may affect scheduling and pricing.</p>
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

export default NewOrderForm;