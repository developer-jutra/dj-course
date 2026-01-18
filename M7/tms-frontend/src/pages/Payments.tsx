import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { usePaymentsQuery } from '@/http/payments.queries';
import { generateReceiptPDF } from '@/lib/pdf/receiptPdfGenerator'

const Payments = () => {
  const { data: payments = [], isLoading } = usePaymentsQuery();
  
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case 'paid': return 'bg-green-100 text-green-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      case 'overdue': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  if (isLoading) {
    return <div className="flex justify-center items-center h-64">Loading payments...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Payments</h1>
          <p className="text-gray-600">Manage your payment history and invoices</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Download Invoice
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Payment History</CardTitle>
          <CardDescription>Your recent payment transactions</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Payment ID</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Amount</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Status</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Method</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Invoice</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Date</th>
                  <th className="text-left py-3 px-4 font-medium text-gray-500">Actions</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((payment) => (
                  <tr key={payment.id} className="border-b hover:bg-gray-50">
                    <td className="py-3 px-4 font-mono text-sm">{payment.id}</td>
                    <td className="py-3 px-4 font-semibold text-lg">{payment.amount}</td>
                    <td className="py-3 px-4">
                      <Badge className={getStatusColor(payment.status)}>
                        {payment.status}
                      </Badge>
                    </td>
                    <td className="py-3 px-4">{payment.method}</td>
                    <td className="py-3 px-4 font-mono text-sm">{payment.invoice}</td>
                    <td className="py-3 px-4 text-gray-600">{payment.date}</td>
                    <td className="py-3 px-4">
                      <Button variant="outline" size="sm" onClick={() => generateReceiptPDF(payment)}>View Receipt</Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Payments;
