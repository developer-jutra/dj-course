import React, { useState } from 'react';
import { Document, DocumentEntity } from '../../types/document';
import { Upload, X } from 'lucide-react';

interface AddDocumentFormProps {
  entities: DocumentEntity[];
  onSave: (document: Partial<Document>) => Promise<void>;
  onCancel: () => void;
  isLoading: boolean;
}

export const AddDocumentForm: React.FC<AddDocumentFormProps> = ({
  entities,
  onSave,
  onCancel,
  isLoading
}) => {
  const [formData, setFormData] = useState({
    name: '',
    type: 'other' as Document['type'],
    entityType: 'vehicle' as Document['entityType'],
    entityId: '',
    number: '',
    issueDate: '',
    expiryDate: '',
    issuingAuthority: '',
    notes: ''
  });

  const [dragActive, setDragActive] = useState(false);

  // Filter entities based on selected entity type
  const availableEntities = entities.filter(entity => entity.type === formData.entityType);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      [field]: value,
      // Reset entityId when entityType changes
      ...(field === 'entityType' ? { entityId: '' } : {})
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.entityId || !formData.issueDate) {
      return;
    }

    const selectedEntity = entities.find(e => e.id === formData.entityId);
    
    const documentData: Partial<Document> = {
      name: formData.name,
      type: formData.type,
      entityType: formData.entityType,
      entityId: formData.entityId,
      entityName: selectedEntity?.name || '',
      number: formData.number || undefined,
      issueDate: new Date(formData.issueDate),
      expiryDate: formData.expiryDate ? new Date(formData.expiryDate) : undefined,
      issuingAuthority: formData.issuingAuthority || undefined,
      notes: formData.notes || undefined,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    await onSave(documentData);
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      // Handle file upload
      console.log('File dropped:', e.dataTransfer.files[0]);
    }
  };

  const getDocumentTypeLabel = (type: Document['type']) => {
    const labels = {
      'contract': 'Contract',
      'invoice': 'Invoice',
      'registration': 'Registration',
      'insurance': 'Insurance',
      'inspection': 'Technical Inspection',
      'tir-carnet': 'TIR Carnet',
      'adr': 'ADR Certificate',
      'hazmat-permit': 'Hazmat Permit',
      'license': 'License',
      'certificate': 'Certificate',
      'other': 'Other'
    };
    return labels[type];
  };

  const getEntityTypeLabel = (type: Document['entityType']) => {
    const labels = {
      'vehicle': 'Vehicle',
      'customer': 'Customer',
      'supplier': 'Supplier',
      'driver': 'Driver',
      'company': 'Company',
      'other': 'Other'
    };
    return labels[type];
  };

  return (
    <div className="bg-white rounded-lg shadow-lg p-6 mb-6 border border-blue-200">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">Add New Document</h3>
        <button
          onClick={onCancel}
          className="p-1 text-gray-400 hover:text-gray-600 rounded-full hover:bg-gray-100 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Document Name */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleInputChange('name', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter document name"
              required
            />
          </div>

          {/* Document Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Type
            </label>
            <select
              value={formData.type}
              onChange={(e) => handleInputChange('type', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              {(['contract', 'invoice', 'registration', 'insurance', 'inspection', 'tir-carnet', 'adr', 'hazmat-permit', 'license', 'certificate', 'other'] as Document['type'][]).map(type => (
                <option key={type} value={type}>
                  {getDocumentTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>

          {/* Entity Type */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Related To *
            </label>
            <select
              value={formData.entityType}
              onChange={(e) => handleInputChange('entityType', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              {(['vehicle', 'customer', 'supplier', 'driver', 'company', 'other'] as Document['entityType'][]).map(type => (
                <option key={type} value={type}>
                  {getEntityTypeLabel(type)}
                </option>
              ))}
            </select>
          </div>

          {/* Specific Entity */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Specific {getEntityTypeLabel(formData.entityType)} *
            </label>
            <select
              value={formData.entityId}
              onChange={(e) => handleInputChange('entityId', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            >
              <option value="">Select {getEntityTypeLabel(formData.entityType)}</option>
              {availableEntities.map(entity => (
                <option key={entity.id} value={entity.id}>
                  {entity.name}
                </option>
              ))}
            </select>
          </div>

          {/* Document Number */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Document Number
            </label>
            <input
              type="text"
              value={formData.number}
              onChange={(e) => handleInputChange('number', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter document number"
            />
          </div>

          {/* Issue Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issue Date *
            </label>
            <input
              type="date"
              value={formData.issueDate}
              onChange={(e) => handleInputChange('issueDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              required
            />
          </div>

          {/* Expiry Date */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Expiry Date
            </label>
            <input
              type="date"
              value={formData.expiryDate}
              onChange={(e) => handleInputChange('expiryDate', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
          </div>

          {/* Issuing Authority */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Issuing Authority
            </label>
            <input
              type="text"
              value={formData.issuingAuthority}
              onChange={(e) => handleInputChange('issuingAuthority', e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter issuing authority"
            />
          </div>

          {/* Notes */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Notes
            </label>
            <textarea
              value={formData.notes}
              onChange={(e) => handleInputChange('notes', e.target.value)}
              rows={3}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              placeholder="Enter any additional notes"
            />
          </div>

          {/* File Upload */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Upload Document File
            </label>
            <div
              className={`border-2 border-dashed rounded-lg p-6 text-center transition-colors ${
                dragActive 
                  ? 'border-blue-400 bg-blue-50' 
                  : 'border-gray-300 hover:border-gray-400'
              }`}
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
            >
              <Upload className="w-8 h-8 text-gray-400 mx-auto mb-2" />
              <p className="text-sm text-gray-600">
                Click to upload or drag and drop
              </p>
              <p className="text-xs text-gray-500">PDF, JPG, PNG up to 10MB</p>
            </div>
          </div>
        </div>

        {/* Form Actions */}
        <div className="flex gap-2 pt-4 border-t">
          <button
            type="submit"
            disabled={isLoading || !formData.name || !formData.entityId || !formData.issueDate}
            className={`px-4 py-2 rounded-lg transition-colors ${
              isLoading || !formData.name || !formData.entityId || !formData.issueDate
                ? 'bg-gray-400 text-white cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700'
            }`}
          >
            {isLoading ? 'Saving...' : 'Save Document'}
          </button>
          <button
            type="button"
            onClick={onCancel}
            disabled={isLoading}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 transition-colors disabled:opacity-50"
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
};