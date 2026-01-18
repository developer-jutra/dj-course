import jsPDF from 'jspdf'
import { Invoice } from '../../features/billing-payments/billing.model'

interface InvoiceData extends Invoice {
  // Additional fields for PDF generation
  companyInfo?: {
    name: string
    address: string
    city: string
    phone: string
    email: string
  }
  contractorInfo?: {
    address: string
    city: string
    email: string
  }
  taxRate?: number
  paymentTerms?: string
  notes?: string
}

export async function generateInvoicePDF(invoiceData: InvoiceData): Promise<void> {
  const doc = new jsPDF()
  const DELIVEROO_LOGO_PATH = '/assets/deliveroo-pdf-logo.png'
  
  // Load logo image
  let logoDataUrl: string | null = null
  try {
    const response = await fetch(DELIVEROO_LOGO_PATH)
    const blob = await response.blob()
    logoDataUrl = await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  } catch (err) {
    console.error('Failed to load local image', err)
  }

  // Add header with logo
  if (logoDataUrl) {
    doc.addImage(logoDataUrl, 'PNG', 15, 15, 15, 15)
  }

  // Title
  doc.setFontSize(16)
  doc.setFont('helvetica', 'bold')
  doc.text(`Invoice - ${invoiceData.invoiceNumber}`, 20, 35)

  // Company name
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Deliveroo Logistics', 20, 42)

  let yPos = 55

  // Invoice Information Section
  const pageHeight = doc.internal.pageSize.height
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, 170, 8, 'F')
  doc.text('Invoice Information', 22, yPos + 5.5)
  yPos += 15

  // Invoice Number field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Invoice Number:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  let lines = doc.splitTextToSize(invoiceData.invoiceNumber, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Status field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Status:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(invoiceData.status.toUpperCase(), 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Issue Date field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Issue Date:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const issueDateFormatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(invoiceData.issueDate))
  lines = doc.splitTextToSize(issueDateFormatted, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Due Date field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Due Date:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const dueDateFormatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date(invoiceData.dueDate))
  lines = doc.splitTextToSize(dueDateFormatted, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // From Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, 170, 8, 'F')
  doc.text('From', 22, yPos + 5.5)
  yPos += 15

  const companyInfo = invoiceData.companyInfo || {
    name: 'Warehouse Management System',
    address: '123 Industrial Blvd',
    city: 'Chicago, IL 60601',
    phone: '+1-555-0100',
    email: 'billing@wms.com'
  }

  // Company field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Company:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(companyInfo.name, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Address field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Address:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(companyInfo.address, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // City field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('City:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(companyInfo.city, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Phone field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Phone:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(companyInfo.phone, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Email field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Email:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(companyInfo.email, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Bill To Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, 170, 8, 'F')
  doc.text('Bill To', 22, yPos + 5.5)
  yPos += 15

  const contractorInfo = invoiceData.contractorInfo || {
    address: '123 Business Ave',
    city: 'Business City, BC 12345',
    email: `contact@${invoiceData.contractorName.toLowerCase().replace(/\s+/g, '')}.com`
  }

  // Contractor field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Contractor:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(invoiceData.contractorName, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Contractor ID field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Contractor ID:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(invoiceData.contractorId, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Contractor Address field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Address:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(contractorInfo.address, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Contractor City field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('City:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(contractorInfo.city, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Contractor Email field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Email:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(contractorInfo.email, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Invoice Items Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, 170, 8, 'F')
  doc.text('Invoice Items', 22, yPos + 5.5)
  yPos += 15

  // Table headers
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Description', 20, yPos)
  doc.text('Qty', 130, yPos, { align: 'right' })
  doc.text('Unit Price', 155, yPos, { align: 'right' })
  doc.text('Total', 185, yPos, { align: 'right' })
  yPos += 6

  // Table separator line
  doc.setDrawColor(200, 200, 200)
  doc.line(20, yPos, 190, yPos)
  yPos += 8

  // Table rows
  doc.setFont('helvetica', 'normal')
  invoiceData.items.forEach((item) => {
    // Check if we need a new page
    if (yPos > 250) {
      doc.addPage()
      yPos = 20
    }

    const itemUnitPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(item.unitPrice)

    const itemTotalPrice = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(item.totalPrice)

    doc.text(item.description, 20, yPos, { maxWidth: 100 })
    doc.text(item.quantity.toString(), 130, yPos, { align: 'right' })
    doc.text(itemUnitPrice, 155, yPos, { align: 'right' })
    doc.text(itemTotalPrice, 185, yPos, { align: 'right' })
    yPos += 8
  })

  yPos += 5

  // Calculate subtotal and tax
  const subtotal = invoiceData.items.reduce((sum, item) => sum + item.totalPrice, 0)
  const taxRate = invoiceData.taxRate || 0.085 // 8.5% default
  const tax = subtotal * taxRate
  const total = subtotal + tax

  // Summary Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, 170, 8, 'F')
  doc.text('Summary', 22, yPos + 5.5)
  yPos += 15

  // Subtotal field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Subtotal:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const subtotalFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(subtotal)
  lines = doc.splitTextToSize(subtotalFormatted, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Tax field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Tax:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const taxFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(tax)
  lines = doc.splitTextToSize(`${taxFormatted} (${(taxRate * 100).toFixed(1)}%)`, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Total Amount field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Total Amount:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const totalFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(total)
  lines = doc.splitTextToSize(totalFormatted, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Payment Information Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, 170, 8, 'F')
  doc.text('Payment Information', 22, yPos + 5.5)
  yPos += 15

  const paymentTerms = invoiceData.paymentTerms || 'Net 30 days'

  // Payment Terms field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Payment Terms:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(paymentTerms, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Payment Methods field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Payment Methods:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize('Bank Transfer: Account #123-456-789 or Check: Payable to "WMS Inc."', 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Notes Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, 170, 8, 'F')
  doc.text('Notes', 22, yPos + 5.5)
  yPos += 15

  const notes = invoiceData.notes || 
    'Thank you for your business! Please remit payment within 30 days of the invoice date. ' +
    'For any questions regarding this invoice, please contact our billing department at billing@wms.com.'

  // Additional Information field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Additional Information:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(notes, 160)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Add footer
  const footerLines = [
    'Deliveroo Logistics | ul. Logistyczna 123, 00-001 Warsaw, Poland',
    'Phone: +48 123 456 789 | Email: contact@deliveroo.pl'
  ]
  
  doc.setDrawColor(200, 200, 200)
  doc.line(20, pageHeight - 25, 190, pageHeight - 25)
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)

  footerLines.forEach((line, idx) => doc.text(line, 20, pageHeight - 18 + idx * 6))

  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.text(`Page ${i} of ${pageCount}`, 170, pageHeight - 12)
  }

  // Save the PDF
  doc.save(`Invoice_${invoiceData.invoiceNumber}.pdf`)
}
