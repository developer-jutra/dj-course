import jsPDF from 'jspdf'
import { BillingOverview, Invoice } from '../../features/billing-payments/billing.model'

interface FinancialReportData {
  overview: BillingOverview
  invoices: Invoice[]
  reportPeriod?: string
}

export async function generateFinancialReportPDF(data: FinancialReportData): Promise<void> {
  const doc = new jsPDF()
  const DELIVEROO_LOGO_PATH = '/assets/deliveroo-pdf-logo.png'
  const pageHeight = doc.internal.pageSize.height
  
  const reportPeriod = data.reportPeriod || `As of ${new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date())}`

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
  doc.text('Financial Report', 20, 35)

  // Company name & info
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Deliveroo Logistics', 20, 42)
  doc.text(reportPeriod, 20, 48)

  let yPos = 55

  // Revenue Summary Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, 170, 8, 'F')
  doc.text('Revenue Summary', 22, yPos + 5.5)
  yPos += 15

  // Total Revenue field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Total Revenue:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  let lines = doc.splitTextToSize(new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(data.overview.totalRevenue), 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Total Invoices field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Total Invoices:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(data.overview.totalInvoices.toString(), 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Paid Invoices field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Paid Invoices:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(data.overview.paidInvoices.toString(), 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Overdue Invoices field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Overdue Invoices:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(data.overview.overdueInvoices.toString(), 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Average Invoice Value field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Average Invoice Value:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(data.overview.avgInvoiceValue), 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Performance Metrics Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, 170, 8, 'F')
  doc.text('Performance Metrics', 22, yPos + 5.5)
  yPos += 15

  // Average Payment Time field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Average Payment Time:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(`${data.overview.avgPaymentTime} days`, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Collection Rate field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Collection Rate:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(`${data.overview.collectionRate.toFixed(1)}%`, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Calculate additional metrics
  const paidRevenue = data.invoices
    .filter(inv => inv.status === 'paid')
    .reduce((sum, inv) => sum + inv.amount, 0)
  
  const overdueRevenue = data.invoices
    .filter(inv => inv.status === 'overdue')
    .reduce((sum, inv) => sum + inv.amount, 0)

  const pendingRevenue = data.invoices
    .filter(inv => inv.status === 'sent')
    .reduce((sum, inv) => sum + inv.amount, 0)

  // Paid Revenue field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Paid Revenue:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(paidRevenue), 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Overdue Revenue field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Overdue Revenue:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(overdueRevenue), 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Pending Revenue field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Pending Revenue:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(pendingRevenue), 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Invoice Status Breakdown Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, 170, 8, 'F')
  doc.text('Invoice Status Breakdown', 22, yPos + 5.5)
  yPos += 15

  // Status breakdown calculations
  const statusCounts = {
    paid: data.invoices.filter(inv => inv.status === 'paid').length,
    sent: data.invoices.filter(inv => inv.status === 'sent').length,
    overdue: data.invoices.filter(inv => inv.status === 'overdue').length,
    draft: data.invoices.filter(inv => inv.status === 'draft').length
  }

  // Table headers
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Status', 20, yPos)
  doc.text('Count', 100, yPos)
  doc.text('Revenue', 140, yPos, { align: 'right' })
  yPos += 6

  // Table separator line
  doc.setDrawColor(200, 200, 200)
  doc.line(20, yPos, 190, yPos)
  yPos += 8

  // Table rows
  doc.setFont('helvetica', 'normal')
  const draftRevenue = data.invoices.filter(inv => inv.status === 'draft').reduce((sum, inv) => sum + inv.amount, 0)
  
  const statuses = [
    { label: 'Paid', key: 'paid' as const, revenue: paidRevenue },
    { label: 'Sent', key: 'sent' as const, revenue: pendingRevenue },
    { label: 'Overdue', key: 'overdue' as const, revenue: overdueRevenue },
    { label: 'Draft', key: 'draft' as const, revenue: draftRevenue }
  ]

  statuses.forEach((status) => {
    doc.text(status.label, 20, yPos)
    doc.text(statusCounts[status.key].toString(), 100, yPos)
    doc.text(new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(status.revenue), 140, yPos, { align: 'right' })
    yPos += 8
  })

  yPos += 10

  // Top Contractors Section (by revenue)
  const contractorRevenue = new Map<string, { name: string; total: number; count: number }>()
  
  data.invoices.forEach(invoice => {
    const existing = contractorRevenue.get(invoice.contractorId)
    if (existing) {
      existing.total += invoice.amount
      existing.count += 1
    } else {
      contractorRevenue.set(invoice.contractorId, {
        name: invoice.contractorName,
        total: invoice.amount,
        count: 1
      })
    }
  })

  const topContractors = Array.from(contractorRevenue.values())
    .sort((a, b) => b.total - a.total)
    .slice(0, 5)

  if (topContractors.length > 0) {
    if (yPos + 15 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(248, 250, 252)
    doc.rect(20, yPos, 170, 8, 'F')
    doc.text('Top 5 Contractors by Revenue', 22, yPos + 5.5)
    yPos += 15

    // Table headers
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Contractor', 20, yPos)
    doc.text('Invoices', 110, yPos)
    doc.text('Total Revenue', 165, yPos, { align: 'right' })
    yPos += 6

    // Table separator line
    doc.line(20, yPos, 190, yPos)
    yPos += 8

    // Table rows
    doc.setFont('helvetica', 'normal')
    topContractors.forEach((contractor) => {
      // Check if we need a new page
      if (yPos > 250) {
        doc.addPage()
        yPos = 20
      }

      doc.text(contractor.name, 20, yPos, { maxWidth: 85 })
      doc.text(contractor.count.toString(), 110, yPos)
      doc.text(new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(contractor.total), 165, yPos, { align: 'right' })
      yPos += 8
    })

    yPos += 10
  }

  // Recent Invoices Section
  const recentInvoices = data.invoices
    .sort((a, b) => new Date(b.issueDate).getTime() - new Date(a.issueDate).getTime())
    .slice(0, 10)

  if (recentInvoices.length > 0) {
    if (yPos + 15 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(248, 250, 252)
    doc.rect(20, yPos, 170, 8, 'F')
    doc.text('Recent Invoices (Last 10)', 22, yPos + 5.5)
    yPos += 15

    // Check if we need a new page
    if (yPos > 200) {
      doc.addPage()
      yPos = 20
    }

    // Table headers
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('Invoice #', 20, yPos)
    doc.text('Contractor', 55, yPos)
    doc.text('Date', 110, yPos)
    doc.text('Status', 145, yPos)
    doc.text('Amount', 180, yPos, { align: 'right' })
    yPos += 6

    // Table separator line
    doc.line(20, yPos, 190, yPos)
    yPos += 8

    // Table rows
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    recentInvoices.forEach((invoice) => {
      // Check if we need a new page
      if (yPos > 260) {
        doc.addPage()
        yPos = 20
      }

      const invoiceDateFormatted = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date(invoice.issueDate))

      const invoiceAmountFormatted = new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency: 'USD',
        minimumFractionDigits: 2,
        maximumFractionDigits: 2
      }).format(invoice.amount)

      doc.text(invoice.invoiceNumber, 20, yPos)
      doc.text(invoice.contractorName.substring(0, 15), 55, yPos)
      doc.text(invoiceDateFormatted, 110, yPos)
      doc.text(invoice.status.toUpperCase(), 145, yPos)
      doc.text(invoiceAmountFormatted, 180, yPos, { align: 'right' })
      yPos += 7
    })

    yPos += 10
  }

  // Report Summary Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, 170, 8, 'F')
  doc.text('Report Summary', 22, yPos + 5.5)
  yPos += 15

  // Report Generated field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Report Generated:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const reportGeneratedDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date())
  lines = doc.splitTextToSize(reportGeneratedDate, 160)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Total Accounts field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Total Accounts:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(contractorRevenue.size.toString(), 160)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Notes field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Notes:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize('This financial report provides a comprehensive overview of billing and payment activities. For detailed invoice information, please refer to individual invoice documents.', 160)
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
  const saveDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date()).replace(/\s+/g, '_')
  doc.save(`Financial_Report_${saveDate}.pdf`)
}
