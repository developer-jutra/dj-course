
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { StatCard } from '@/components/ui/stat-card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { FileText, DollarSign, Clock, CheckCircle, XCircle, AlertCircle } from 'lucide-react';

const Claims = () => {
  const navigate = useNavigate();
  const [claims] = useState([
    {
      id: 'CLM001',
      type: 'Damage Claim',
      customer: 'Tech Solutions Inc',
      shipmentId: 'SH001',
      description: 'Package arrived with water damage to electronics',
      claimedAmount: '$2,500',
      submittedDate: '2024-01-20',
      status: 'Reviewed',
      shipmentDate: '2024-01-15',
      origin: 'New York, NY',
      destination: 'Boston, MA',
      supportingDocs: ['Photos of damaged goods', 'Original invoice', 'Packaging photos'],
      estimatedValue: '$2,500',
      insuranceCoverage: '$5,000',
    },
    {
      id: 'CLM002',
      type: 'Loss Claim',
      customer: 'Global Trading Co',
      shipmentId: 'SH003',
      description: 'Shipment never arrived at destination',
      claimedAmount: '$1,800',
      submittedDate: '2024-01-22',
      status: 'Submitted',
      shipmentDate: '2024-01-18',
      origin: 'Chicago, IL',
      destination: 'Detroit, MI',
      supportingDocs: ['Shipping receipt', 'Delivery confirmation attempt'],
      estimatedValue: '$1,800',
      insuranceCoverage: '$3,000',
    },
    {
      id: 'CLM003',
      type: 'Delay Claim',
      customer: 'Retail Store Chain',
      shipmentId: 'SH002',
      description: 'Delivery delayed by 3 days causing stock shortage',
      claimedAmount: '$450',
      submittedDate: '2024-01-19',
      status: 'Approved',
      shipmentDate: '2024-01-10',
      origin: 'Los Angeles, CA',
      destination: 'San Francisco, CA',
      supportingDocs: ['Original delivery schedule', 'Lost sales report', 'Customer complaints'],
      estimatedValue: '$450',
      insuranceCoverage: '$1,000',
    },
    {
      id: 'CLM004',
      type: 'Shortage Claim',
      customer: 'Manufacturing Corp',
      shipmentId: 'SH004',
      description: 'Only 8 out of 10 boxes delivered',
      claimedAmount: '$320',
      submittedDate: '2024-01-21',
      status: 'Rejected',
      shipmentDate: '2024-01-16',
      origin: 'Miami, FL',
      destination: 'Atlanta, GA',
      supportingDocs: ['Delivery receipt', 'Inventory count', 'Photos of received items'],
      estimatedValue: '$320',
      insuranceCoverage: '$500',
      rejectionReason: 'Customer signed for complete delivery, no evidence of shortage',
    },
    {
      id: 'CLM005',
      type: 'Carrier Accident Claim',
      customer: 'Electronics Distributor',
      shipmentId: 'SH005',
      description: 'Goods damaged in vehicle collision incident INC001',
      claimedAmount: '$3,200',
      submittedDate: '2024-01-23',
      status: 'Under Review',
      shipmentDate: '2024-01-22',
      origin: 'Houston, TX',
      destination: 'Dallas, TX',
      supportingDocs: ['Police report', 'Insurance claim', 'Photos of damaged goods', 'Incident report INC001'],
      estimatedValue: '$3,200',
      insuranceCoverage: '$10,000',
      relatedIncident: 'INC001',
    },
  ]);

  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'submitted': return 'bg-yellow-100 text-yellow-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'under review': return 'bg-blue-100 text-blue-800';
      case 'approved': return 'bg-green-100 text-green-800';
      case 'rejected': return 'bg-red-100 text-red-800';
      case 'closed': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type.toLowerCase()) {
      case 'damage claim': return '📦';
      case 'loss claim': return '❌';
      case 'delay claim': return '⏰';
      case 'shortage claim': return '📊';
      case 'carrier accident claim': return '🚗';
      case 'refused claim': return '🚫';
      default: return '📋';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status.toLowerCase()) {
      case 'approved': return <CheckCircle className="h-4 w-4 text-green-600" />;
      case 'rejected': return <XCircle className="h-4 w-4 text-red-600" />;
      case 'under review': return <AlertCircle className="h-4 w-4 text-blue-600" />;
      default: return <Clock className="h-4 w-4 text-yellow-600" />;
    }
  };

  const totalClaimAmount = claims.reduce((sum, claim) => 
    sum + parseFloat(claim.claimedAmount.replace('$', '').replace(',', '')), 0
  );

  const approvedClaims = claims.filter(claim => claim.status === 'Approved').length;
  const pendingClaims = claims.filter(claim => 
    ['Submitted', 'Reviewed', 'Under Review'].includes(claim.status)
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Claims</h1>
          <p className="text-gray-600">Manage customer complaints and compensation claims</p>
        </div>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={() => navigate('/claims/new')}
        >
          Process New Claim
        </Button>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <StatCard
          icon={FileText}
          label="Total Claims"
          value={claims.length}
          bgColor="bg-blue-50"
          borderColor="border-blue-200"
          labelColor="text-blue-800"
          valueColor="text-blue-600"
          iconColor="text-blue-600"
        />
        
        <StatCard
          icon={Clock}
          label="Pending Review"
          value={pendingClaims}
          bgColor="bg-orange-50"
          borderColor="border-orange-200"
          labelColor="text-orange-800"
          valueColor="text-orange-600"
          iconColor="text-orange-600"
        />

        <StatCard
          icon={CheckCircle}
          label="Approved"
          value={approvedClaims}
          bgColor="bg-green-50"
          borderColor="border-green-200"
          labelColor="text-green-800"
          valueColor="text-green-600"
          iconColor="text-green-600"
        />

        <StatCard
          icon={DollarSign}
          label="Total Claimed"
          value={`$${totalClaimAmount.toLocaleString()}`}
          bgColor="bg-red-50"
          borderColor="border-red-200"
          labelColor="text-red-800"
          valueColor="text-red-600"
          iconColor="text-red-600"
        />
      </div>

      {/* Claims List */}
      <Card>
        <CardHeader>
          <CardTitle>All Claims</CardTitle>
          <CardDescription>Complete list of customer claims and their processing status</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            {claims.map((claim) => (
              <div key={claim.id} className="border rounded-lg p-6">
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center space-x-3">
                    <div className="text-2xl">{getTypeIcon(claim.type)}</div>
                    <div>
                      <h3 className="font-semibold text-lg">{claim.id} - {claim.type}</h3>
                      <p className="text-gray-600">{claim.customer}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {getStatusIcon(claim.status)}
                    <Badge className={getStatusColor(claim.status)}>
                      {claim.status}
                    </Badge>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Shipment ID</p>
                    <p className="font-medium">{claim.shipmentId}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Claimed Amount</p>
                    <p className="font-medium text-red-600">{claim.claimedAmount}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Submitted Date</p>
                    <p className="font-medium">{claim.submittedDate}</p>
                  </div>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">Route</p>
                    <p className="font-medium text-sm">{claim.origin} → {claim.destination}</p>
                  </div>
                </div>

                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-700 mb-1">Description:</p>
                    <p className="text-sm text-gray-600 bg-gray-50 p-2 rounded">
                      {claim.description}
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Supporting Documents:</p>
                      <div className="flex flex-wrap gap-2">
                        {claim.supportingDocs.map((doc, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            📄 {doc}
                          </Badge>
                        ))}
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <p className="text-sm text-gray-600">Estimated Value</p>
                        <p className="font-medium">{claim.estimatedValue}</p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-600">Insurance Coverage</p>
                        <p className="font-medium text-green-600">{claim.insuranceCoverage}</p>
                      </div>
                    </div>
                  </div>

                  {claim.relatedIncident && (
                    <div className="bg-yellow-50 p-3 rounded border-l-4 border-yellow-400">
                      <p className="text-sm text-yellow-800">
                        🔗 Related to incident: <span className="font-medium">{claim.relatedIncident}</span>
                      </p>
                    </div>
                  )}

                  {claim.status === 'Rejected' && claim.rejectionReason && (
                    <div className="bg-red-50 p-3 rounded border-l-4 border-red-400">
                      <p className="text-sm text-red-800">
                        <strong>Rejection Reason:</strong> {claim.rejectionReason}
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex justify-end space-x-2 mt-4 pt-4 border-t">
                  <Button variant="outline" size="sm">
                    View Details
                  </Button>
                  {claim.status === 'Submitted' && (
                    <>
                      <Button variant="outline" size="sm" className="text-green-600 border-green-600">
                        Approve
                      </Button>
                      <Button variant="outline" size="sm" className="text-red-600 border-red-600">
                        Reject
                      </Button>
                    </>
                  )}
                  <Button variant="outline" size="sm">
                    Update Status
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Claims;
