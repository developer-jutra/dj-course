import jsPDF from 'jspdf'

const DELIVEROO_LOGO_PATH = '/deliveroo-pdf-logo.png'

interface InvoiceData {
  id: string
  number: string
  description: string
  date: Date
  amount: number
  status: 'Paid' | 'Unpaid' | 'Overdue'
  dueDate: Date
}

export async function generateInvoicePDF(invoice: InvoiceData): Promise<void> {
  const doc = new jsPDF()
  const pageHeight = doc.internal.pageSize.height
  
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
  doc.text('Invoice', 20, 35)

  // Company name
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Deliveroo Logistics', 20, 42)

  let yPos = 55

  // Invoice Details Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, 170, 8, 'F')
  doc.text('Invoice Details', 22, yPos + 5.5)
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
  let lines = doc.splitTextToSize(invoice.number, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Invoice ID field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Invoice ID:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(String(invoice.id), 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Description field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Description:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(invoice.description, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Amount field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Amount:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const formattedAmount = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD'
  }).format(invoice.amount)
  lines = doc.splitTextToSize(formattedAmount, 80)
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
  lines = doc.splitTextToSize(invoice.status, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Date field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Invoice Date:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const formattedDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(invoice.date)
  lines = doc.splitTextToSize(formattedDate, 80)
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
  const formattedDueDate = new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(invoice.dueDate)
  lines = doc.splitTextToSize(formattedDueDate, 80)
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
  doc.save(`Invoice_${invoice.number}.pdf`)
}
