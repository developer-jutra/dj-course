import { PDFBuilder } from '@/lib/pdf/pdfBuilder'

interface PaymentReceiptData {
  id: string | number
  amount: string | number
  status: string
  method: string
  invoice?: string
  date: string
}

export async function generateReceiptPDF (payment: PaymentReceiptData): Promise<void> {
  const builder = new PDFBuilder()

  await builder.addHeader({
    title: 'Payment Receipt'
  })

  builder
    .addSection('Payment Details')
    .addField('Payment ID', String(payment.id))
    .addField('Amount', String(payment.amount))
    .addField('Status', payment.status)
    .addField('Method', payment.method)
    .addField('Invoice', payment.invoice ?? '-')
    .addField('Date', payment.date)

  builder.save(`Receipt_${payment.id}.pdf`)
} 