import jsPDF from 'jspdf'

const DELIVEROO_LOGO_PATH = '/deliveroo-pdf-logo.png'

export interface TrackingEvent {
  id: number | string
  status: string
  location: string
  timestamp: string
  description: string
}

export interface ShipmentInfo {
  id: string | number
  origin: string
  destination: string
  driver: string
  eta?: string
  status?: string
}

export async function generateShipmentRoutePDF(shipment: ShipmentInfo, events: TrackingEvent[]): Promise<void> {
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
  doc.text(`Shipment Route - #${shipment.id}`, 20, 35)

  // Company name
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Deliveroo Logistics', 20, 42)

  let yPos = 55

  // Route Overview Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, 170, 8, 'F')
  doc.text('Route Overview', 22, yPos + 5.5)
  yPos += 15

  // From field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('From:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  let lines = doc.splitTextToSize(shipment.origin, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // To field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('To:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(shipment.destination, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Driver field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Driver:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(shipment.driver, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // ETA field (if exists)
  if (shipment.eta) {
    if (yPos + 10 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('ETA:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    lines = doc.splitTextToSize(shipment.eta, 80)
    doc.text(lines, 20, yPos + 4)
    yPos += lines.length * 4 + 6
  }

  // Status field (if exists)
  if (shipment.status) {
    if (yPos + 10 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Status:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    lines = doc.splitTextToSize(shipment.status, 80)
    doc.text(lines, 20, yPos + 4)
    yPos += lines.length * 4 + 6
  }

  // Timeline Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, 170, 8, 'F')
  doc.text('Timeline', 22, yPos + 5.5)
  yPos += 15

  // Draw timeline events
  events.forEach((event, index) => {
    // Check if we need a new page
    if (yPos > pageHeight - 40) {
      doc.addPage()
      yPos = 20
    }

    // Bullet circle color
    const isLast = index === events.length - 1
    const fillColor: [number, number, number] = isLast ? [33, 150, 243] : [34, 197, 94] // blue or green
    doc.setFillColor(fillColor[0], fillColor[1], fillColor[2])
    doc.circle(25, yPos, 2, 'F')

    // Text details
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(event.status, 30, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(event.timestamp, 140, yPos)
    yPos += 4
    doc.setFontSize(9)
    doc.text(event.location, 30, yPos)
    yPos += 4
    doc.setFontSize(9)
    doc.setTextColor(100, 100, 100)
    doc.text(event.description, 30, yPos)
    doc.setTextColor(0, 0, 0)
    yPos += 10
  })

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
  doc.save(`Shipment_${shipment.id}_Route.pdf`)
}
