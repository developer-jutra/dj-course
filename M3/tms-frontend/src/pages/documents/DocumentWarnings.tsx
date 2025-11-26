import React from 'react';
import { Document } from '../../model/documents';
import { AlertTriangle, Calendar, AlertCircle } from 'lucide-react';
import { formatDate } from '../../lib/date/dateUtils';

interface DocumentWarningsProps {
  documents: Document[];
}

export const DocumentWarnings: React.FC<DocumentWarningsProps> = ({ documents }) => {
  // Get alerts
  const expiringDocuments = documents.filter(doc => {
    if (!doc.expiryDate) return false;
    const daysUntilExpiry = Math.ceil((doc.expiryDate.getTime() - Date.now()) / (24 * 60 * 60 * 1000));
    return daysUntilExpiry <= 90 && daysUntilExpiry >= 0;
  });

  const expiredDocuments = documents.filter(doc => {
    if (!doc.expiryDate) return false;
    return doc.expiryDate < new Date();
  });

  if (expiredDocuments.length === 0 && expiringDocuments.length === 0) {
    return null;
  }

  return (
    <div className="mb-6 space-y-4">
      {expiredDocuments.length > 0 && (
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-5 h-5 text-red-600" />
            <h3 className="font-semibold text-red-800">Expired Documents</h3>
          </div>
          <div className="space-y-1">
            {expiredDocuments.slice(0, 5).map(doc => (
              <p key={doc.id} className="text-sm text-red-700">
                {doc.name} - Expired {formatDate(doc.expiryDate!)}
              </p>
            ))}
            {expiredDocuments.length > 5 && (
              <p className="text-sm text-red-600 font-medium">
                +{expiredDocuments.length - 5} more expired documents
              </p>
            )}
          </div>
        </div>
      )}
      
      {expiringDocuments.length > 0 && (
        <div className="bg-orange-50 border border-orange-200 rounded-lg p-4">
          <div className="flex items-center gap-2 mb-2">
            <Calendar className="w-5 h-5 text-orange-600" />
            <h3 className="font-semibold text-orange-800">Documents Expiring Soon</h3>
          </div>
          <div className="space-y-1">
            {expiringDocuments.slice(0, 5).map(doc => (
              <p key={doc.id} className="text-sm text-orange-700">
                {doc.name} - Expires {formatDate(doc.expiryDate!)}
              </p>
            ))}
            {expiringDocuments.length > 5 && (
              <p className="text-sm text-orange-600 font-medium">
                +{expiringDocuments.length - 5} more expiring documents
              </p>
            )}
          </div>
        </div>
      )}
    </div>
  );
};