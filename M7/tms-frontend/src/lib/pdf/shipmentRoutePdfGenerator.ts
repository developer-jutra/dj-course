import { PDFBuilder } from '@/lib/pdf/pdfBuilder'
import type jsPDF from 'jspdf'

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

function drawTimeline (doc: jsPDF, events: TrackingEvent[], startY: number): number {
  let yPos = startY
  const pageHeight = doc.internal.pageSize.height

  events.forEach((event, index) => {
    // new page if necessary
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

  return yPos
}

export async function generateShipmentRoutePDF (shipment: ShipmentInfo, events: TrackingEvent[]): Promise<void> {
  const builder = new PDFBuilder()

  await builder.addHeader({
    title: `Shipment Route - #${shipment.id}`
  })

  builder
    .addSection('Route Overview')
    .addField('From', shipment.origin)
    .addField('To', shipment.destination)
    .addField('Driver', shipment.driver)
  if (shipment.eta) builder.addField('ETA', shipment.eta)
  if (shipment.status) builder.addField('Status', shipment.status)

  // Manually draw timeline after adjusting builder position
  const doc = (builder as any).doc as jsPDF // access internal doc
  let yPos = (builder as any).yPos as number ?? 80

  builder.addSection('Timeline')
  yPos = (builder as any).yPos as number

  yPos = drawTimeline(doc, events, yPos)

  builder.save(`Shipment_${shipment.id}_Route.pdf`)
} 