import jsPDF from 'jspdf'

const DELIVEROO_LOGO_PATH = '/deliveroo-pdf-logo.png'

interface MetricsData {
  totalShipments: number
  onTimeDelivery: number
  totalCost: number
  storageVolume: number
}

interface RoutePerformanceData {
  route: string
  shipments: number
  onTimePercentage: number
  avgCost: number
  totalRevenue: number
}

interface ReportsData {
  dateRange: {
    from: string
    to: string
  }
  metrics: MetricsData
  routePerformance: RoutePerformanceData[]
}

export async function generateReportsPDF(reportsData: ReportsData): Promise<void> {
  const doc = new jsPDF()
  const pageHeight = doc.internal.pageSize.height
  const pageWidth = doc.internal.pageSize.width
  
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
  doc.text('Logistics Report', 20, 35)

  // Company name
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Deliveroo Logistics', 20, 42)

  let yPos = 55

  // Report Period Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, pageWidth - 40, 8, 'F')
  doc.text('Report Period', 22, yPos + 5.5)
  yPos += 15

  // Date Range
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Period:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const fromDate = new Date(reportsData.dateRange.from).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
  const toDate = new Date(reportsData.dateRange.to).toLocaleDateString('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  })
  doc.text(`${fromDate} - ${toDate}`, 20, yPos + 4)
  yPos += 12

  // Key Metrics Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, pageWidth - 40, 8, 'F')
  doc.text('Key Metrics', 22, yPos + 5.5)
  yPos += 15

  // Total Shipments
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Total Shipments:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(String(reportsData.metrics.totalShipments), 80, yPos)
  yPos += 8

  // On-Time Delivery
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('On-Time Delivery:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(`${reportsData.metrics.onTimeDelivery.toFixed(1)}%`, 80, yPos)
  yPos += 8

  // Total Cost
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Total Cost:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const formattedCost = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'EUR'
  }).format(reportsData.metrics.totalCost)
  doc.text(formattedCost, 80, yPos)
  yPos += 8

  // Storage Volume
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Storage Volume:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(`${reportsData.metrics.storageVolume.toLocaleString()} m³`, 80, yPos)
  yPos += 15

  // Route Performance Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, pageWidth - 40, 8, 'F')
  doc.text('Route Performance', 22, yPos + 5.5)
  yPos += 15

  // Table Header
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(9)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(240, 240, 240)
  doc.rect(20, yPos, pageWidth - 40, 6, 'F')
  
  const colWidths = [60, 30, 30, 30, 30]
  const headers = ['Route', 'Shipments', 'On-Time %', 'Avg Cost', 'Revenue']
  let xPos = 22
  headers.forEach((header, idx) => {
    doc.text(header, xPos, yPos + 4)
    xPos += colWidths[idx]
  })
  yPos += 10

  // Table Rows
  reportsData.routePerformance.forEach((route) => {
    if (yPos + 8 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    
    xPos = 22
    // Route
    let routeText = doc.splitTextToSize(route.route, colWidths[0] - 4)
    doc.text(routeText, xPos, yPos + 4)
    xPos += colWidths[0]
    
    // Shipments
    doc.text(String(route.shipments), xPos, yPos + 4)
    xPos += colWidths[1]
    
    // On-Time %
    doc.text(`${route.onTimePercentage}%`, xPos, yPos + 4)
    xPos += colWidths[2]
    
    // Avg Cost
    const avgCost = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(route.avgCost)
    doc.text(avgCost, xPos, yPos + 4)
    xPos += colWidths[3]
    
    // Revenue
    const revenue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'EUR',
      maximumFractionDigits: 0
    }).format(route.totalRevenue)
    doc.text(revenue, xPos, yPos + 4)
    
    yPos += routeText.length * 4 + 2
    
    // Draw line between rows
    doc.setDrawColor(200, 200, 200)
    doc.line(20, yPos - 1, pageWidth - 20, yPos - 1)
  })

  // Add footer
  const footerLines = [
    'Deliveroo Logistics | ul. Logistyczna 123, 00-001 Warsaw, Poland',
    'Phone: +48 123 456 789 | Email: contact@deliveroo.pl'
  ]
  
  doc.setDrawColor(200, 200, 200)
  doc.line(20, pageHeight - 25, pageWidth - 20, pageHeight - 25)
  doc.setFontSize(8)
  doc.setTextColor(100, 100, 100)

  footerLines.forEach((line, idx) => doc.text(line, 20, pageHeight - 18 + idx * 6))

  const pageCount = doc.getNumberOfPages()
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i)
    doc.text(`Page ${i} of ${pageCount}`, pageWidth - 30, pageHeight - 12)
  }

  // Generate filename with date range
  const fromDateStr = reportsData.dateRange.from.replace(/-/g, '')
  const toDateStr = reportsData.dateRange.to.replace(/-/g, '')
  doc.save(`Logistics_Report_${fromDateStr}_${toDateStr}.pdf`)
}
