import React, { useState } from 'react';
import { Document } from '../../model/documents';
import { FileText, Eye, Edit, Building, User, Truck, Download } from 'lucide-react';
import { formatDate } from '../../lib/date/dateUtils';
import { generateDocumentPDF, generateDocumentPDFBlob } from '../../lib/pdf/documentPdfGenerator';

interface DocumentTileProps {
  document: Document;
  onView: (document: Document) => void;
  onEdit: (documentId: string, currentName: string) => void;
  onSaveEdit: (documentId: string, newName: string) => void;
  onCancelEdit: () => void;
  editingDocumentId: string | null;
  editingName: string;
  onEditingNameChange: (name: string) => void;
}

export const DocumentTile: React.FC<DocumentTileProps> = ({
  document,
  onView,
  onEdit,
  onSaveEdit,
  onCancelEdit,
  editingDocumentId,
  editingName,
  onEditingNameChange
}) => {
  const [isGeneratingPDF, setIsGeneratingPDF] = useState(false);

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

  const getEntityTypeIcon = (type: Document['entityType']) => {
    const icons = {
      'vehicle': <Truck className="w-4 h-4" />,
      'customer': <Building className="w-4 h-4" />,
      'supplier': <Building className="w-4 h-4" />,
      'driver': <User className="w-4 h-4" />,
      'company': <Building className="w-4 h-4" />,
      'other': <FileText className="w-4 h-4" />
    };
    return icons[type];
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

  const getExpiryStatus = (expiryDate?: Date) => {
    if (!expiryDate) return { status: 'none', color: 'text-gray-500', label: 'No expiry' };
    
    const now = new Date();
    const daysUntilExpiry = Math.ceil((expiryDate.getTime() - now.getTime()) / (24 * 60 * 60 * 1000));
    
    if (daysUntilExpiry < 0) {
      return { status: 'expired', color: 'text-red-600', label: 'Expired' };
    } else if (daysUntilExpiry <= 30) {
      return { status: 'expiring', color: 'text-orange-600', label: `Expires in ${daysUntilExpiry} days` };
    } else if (daysUntilExpiry <= 90) {
      return { status: 'warning', color: 'text-yellow-600', label: `Expires in ${daysUntilExpiry} days` };
    } else {
      return { status: 'valid', color: 'text-green-600', label: 'Valid' };
    }
  };

  const getStatusBadgeColor = (status: string) => {
    const colors = {
      'expired': 'bg-red-100 text-red-800',
      'expiring': 'bg-orange-100 text-orange-800',
      'warning': 'bg-yellow-100 text-yellow-800',
      'valid': 'bg-green-100 text-green-800',
      'none': 'bg-gray-100 text-gray-800'
    };
    return colors[status as keyof typeof colors] || colors.none;
  };

  const expiryStatus = getExpiryStatus(document.expiryDate);
  const isEditing = editingDocumentId === document.id;

  const handleSaveEdit = () => {
    if (editingName.trim()) {
      onSaveEdit(document.id, editingName.trim());
    }
  };

  const handleViewPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      const pdfBlob = await generateDocumentPDFBlob(document);
      const pdfUrl = URL.createObjectURL(pdfBlob);
      window.open(pdfUrl, '_blank');
      
      // Clean up the URL after a delay
      setTimeout(() => URL.revokeObjectURL(pdfUrl), 1000);
    } catch (error) {
      console.error('Error generating PDF:', error);
      // Fallback to original view method
      onView(document);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  const handleDownloadPDF = async () => {
    try {
      setIsGeneratingPDF(true);
      await generateDocumentPDF(document);
    } catch (error) {
      console.error('Error downloading PDF:', error);
    } finally {
      setIsGeneratingPDF(false);
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-lg border p-6">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="bg-blue-100 p-2 rounded-lg">
            <FileText className="w-4 h-4 text-blue-600" />
          </div>
          <div className="flex-1">
            {isEditing ? (
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={editingName}
                  onChange={(e) => onEditingNameChange(e.target.value)}
                  className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                  autoFocus
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') handleSaveEdit();
                    if (e.key === 'Escape') onCancelEdit();
                  }}
                />
                <button
                  onClick={handleSaveEdit}
                  className="px-2 py-1 bg-green-600 text-white rounded text-xs hover:bg-green-700"
                >
                  Save
                </button>
                <button
                  onClick={onCancelEdit}
                  className="px-2 py-1 bg-gray-300 text-gray-700 rounded text-xs hover:bg-gray-400"
                >
                  Cancel
                </button>
              </div>
            ) : (
              <h3 className="font-semibold text-gray-900">{document.name}</h3>
            )}
            <div className="flex items-center gap-2 text-sm text-gray-500">
              {getEntityTypeIcon(document.entityType)}
              <span>{getEntityTypeLabel(document.entityType)}: {document.entityName}</span>
            </div>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <span className="px-2 py-1 bg-blue-100 text-blue-800 rounded text-xs font-medium">
            {getDocumentTypeLabel(document.type)}
          </span>
          <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusBadgeColor(expiryStatus.status)}`}>
            {expiryStatus.label}
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
        {document.number && (
          <div>
            <span className="text-sm text-gray-500">Document Number:</span>
            <p className="font-medium">{document.number}</p>
          </div>
        )}
        <div>
          <span className="text-sm text-gray-500">Issue Date:</span>
          <p className="font-medium">{formatDate(document.issueDate)}</p>
        </div>
        {document.expiryDate && (
          <div>
            <span className="text-sm text-gray-500">Expiry Date:</span>
            <p className={`font-medium ${expiryStatus.color}`}>
              {formatDate(document.expiryDate)}
            </p>
          </div>
        )}
        {document.issuingAuthority && (
          <div>
            <span className="text-sm text-gray-500">Issuing Authority:</span>
            <p className="font-medium">{document.issuingAuthority}</p>
          </div>
        )}
      </div>

      {document.notes && (
        <div className="mb-4 p-3 bg-gray-50 rounded-lg">
          <span className="text-sm text-gray-500">Notes:</span>
          <p className="text-sm text-gray-700 mt-1">{document.notes}</p>
        </div>
      )}

      <div className="flex items-center gap-2">
        <button 
          onClick={handleViewPDF}
          disabled={isGeneratingPDF}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-blue-50 text-blue-700 rounded hover:bg-blue-100 transition-colors disabled:opacity-50"
        >
          {isGeneratingPDF ? (
            <>
              <div className="w-4 h-4 border-2 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <Eye className="w-4 h-4" />
              View PDF
            </>
          )}
        </button>
        
        <button 
          onClick={handleDownloadPDF}
          disabled={isGeneratingPDF}
          className="flex items-center gap-1 px-3 py-1 text-sm bg-green-50 text-green-700 rounded hover:bg-green-100 transition-colors disabled:opacity-50"
        >
          {isGeneratingPDF ? (
            <>
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              Generating...
            </>
          ) : (
            <>
              <Download className="w-4 h-4" />
              Download
            </>
          )}
        </button>
        
        {!isEditing && (
          <button 
            onClick={() => onEdit(document.id, document.name)}
            className="flex items-center gap-1 px-3 py-1 text-sm bg-orange-50 text-orange-700 rounded hover:bg-orange-100 transition-colors"
          >
            <Edit className="w-4 h-4" />
            Edit
          </button>
        )}
      </div>
    </div>
  );
};