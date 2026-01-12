import jsPDF from 'jspdf'
import { InventoryItem } from '../../features/inventory/inventory.model'
import { CargoEvent, CargoLocationHistory, CargoDocument } from '../../features/cargo-management/cargo.model'

interface CargoReportData extends InventoryItem {
  events?: CargoEvent[]
  locationHistory?: CargoLocationHistory[]
  documents?: CargoDocument[]
}

export async function generateCargoReportPDF(cargoData: CargoReportData): Promise<void> {
  const doc = new jsPDF()
  const DELIVEROO_LOGO_PATH = '/assets/deliveroo-pdf-logo.png'
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
  doc.text(`Cargo Report - ${cargoData.sku}`, 20, 35)

  // Company name
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Deliveroo Logistics', 20, 42)
  const reportDate = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date())
  doc.text(`Report Date: ${reportDate}`, 20, 48)

  let yPos = 55

  // Basic Information Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, 170, 8, 'F')
  doc.text('Basic Information', 22, yPos + 5.5)
  yPos += 15

  // SKU field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('SKU:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  let lines = doc.splitTextToSize(cargoData.sku, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Name field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Name:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(cargoData.name, 80)
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
  lines = doc.splitTextToSize(cargoData.description, 160)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Category field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Category:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(cargoData.category, 80)
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
  lines = doc.splitTextToSize(cargoData.status.toUpperCase(), 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Quantity & Storage Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, 170, 8, 'F')
  doc.text('Quantity & Storage', 22, yPos + 5.5)
  yPos += 15

  // Quantity field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Quantity:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(`${cargoData.quantity} ${cargoData.unit}`, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Location field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Location:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(cargoData.location, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Zone field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Zone:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(`${cargoData.zoneName} (Zone ID: ${cargoData.zoneId})`, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Shelf Location field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Shelf Location:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(`${cargoData.shelfLocation} (Shelf ID: ${cargoData.shelfId})`, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Physical Attributes Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, 170, 8, 'F')
  doc.text('Physical Attributes', 22, yPos + 5.5)
  yPos += 15

  // Weight field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Weight:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(`${cargoData.weight} kg`, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Volume field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Volume:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(`${cargoData.volume} m³`, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Value field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Value:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const valueFormatted = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: cargoData.currency,
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(cargoData.value)
  lines = doc.splitTextToSize(valueFormatted, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Additional Details Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, 170, 8, 'F')
  doc.text('Additional Details', 22, yPos + 5.5)
  yPos += 15

  // Batch Number field (if exists)
  if (cargoData.batchNumber) {
    if (yPos + 10 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Batch Number:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    lines = doc.splitTextToSize(cargoData.batchNumber, 80)
    doc.text(lines, 20, yPos + 4)
    yPos += lines.length * 4 + 6
  }

  // Serial Number field (if exists)
  if (cargoData.serialNumber) {
    if (yPos + 10 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Serial Number:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    lines = doc.splitTextToSize(cargoData.serialNumber, 80)
    doc.text(lines, 20, yPos + 4)
    yPos += lines.length * 4 + 6
  }

  // Expiry Date field (if exists)
  if (cargoData.expiryDate) {
    if (yPos + 10 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Expiry Date:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    const expiryDateFormatted = new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    }).format(new Date(cargoData.expiryDate))
    lines = doc.splitTextToSize(expiryDateFormatted, 80)
    doc.text(lines, 20, yPos + 4)
    yPos += lines.length * 4 + 6
  }

  // Last Updated field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Last Updated:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const lastUpdatedFormatted = new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(cargoData.lastUpdated))
  lines = doc.splitTextToSize(lastUpdatedFormatted, 80)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Contractor Information (if exists)
  if (cargoData.contractorId && cargoData.contractorName) {
    if (yPos + 15 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(248, 250, 252)
    doc.rect(20, yPos, 170, 8, 'F')
    doc.text('Contractor Information', 22, yPos + 5.5)
    yPos += 15

    // Contractor Name field
    if (yPos + 10 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Contractor Name:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    lines = doc.splitTextToSize(cargoData.contractorName, 80)
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
    lines = doc.splitTextToSize(cargoData.contractorId, 80)
    doc.text(lines, 20, yPos + 4)
    yPos += lines.length * 4 + 6
  }

  // Event Timeline Section (if events exist)
  if (cargoData.events && cargoData.events.length > 0) {
    if (yPos + 15 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(248, 250, 252)
    doc.rect(20, yPos, 170, 8, 'F')
    doc.text('Event Timeline', 22, yPos + 5.5)
    yPos += 15

    // Check if we need a new page
    if (yPos > 200) {
      doc.addPage()
      yPos = 20
    }

    // Table headers
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('Type', 20, yPos)
    doc.text('Title', 50, yPos)
    doc.text('Employee', 110, yPos)
    doc.text('Date', 155, yPos)
    yPos += 6

    // Table separator line
    doc.setDrawColor(200, 200, 200)
    doc.line(20, yPos, 190, yPos)
    yPos += 8

    // Table rows
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    cargoData.events.forEach((event) => {
      // Check if we need a new page
      if (yPos > 260) {
        doc.addPage()
        yPos = 20
      }

      const eventDateFormatted = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit'
      }).format(new Date(event.timestamp))

      doc.text(event.type.substring(0, 12), 20, yPos)
      doc.text(event.title.substring(0, 25), 50, yPos)
      doc.text(event.employee.substring(0, 18), 110, yPos)
      doc.text(eventDateFormatted, 155, yPos)
      yPos += 7
    })

    yPos += 10
  }

  // Location History Section (if location history exists)
  if (cargoData.locationHistory && cargoData.locationHistory.length > 0) {
    if (yPos + 15 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(248, 250, 252)
    doc.rect(20, yPos, 170, 8, 'F')
    doc.text('Location History', 22, yPos + 5.5)
    yPos += 15

    // Check if we need a new page
    if (yPos > 200) {
      doc.addPage()
      yPos = 20
    }

    // Table headers
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('Location', 20, yPos)
    doc.text('Details', 80, yPos)
    doc.text('Date', 135, yPos)
    doc.text('Duration', 165, yPos)
    yPos += 6

    // Table separator line
    doc.setDrawColor(200, 200, 200)
    doc.line(20, yPos, 190, yPos)
    yPos += 8

    // Table rows
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    cargoData.locationHistory.forEach((history) => {
      // Check if we need a new page
      if (yPos > 260) {
        doc.addPage()
        yPos = 20
      }

      const movedDateFormatted = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date(history.movedDate))

      doc.text(history.location.substring(0, 20), 20, yPos)
      doc.text(history.details.substring(0, 18), 80, yPos)
      doc.text(movedDateFormatted, 135, yPos)
      doc.text(history.duration, 165, yPos)
      yPos += 7
    })

    yPos += 10
  }

  // Documentation Section (if documents exist)
  if (cargoData.documents && cargoData.documents.length > 0) {
    if (yPos + 15 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(248, 250, 252)
    doc.rect(20, yPos, 170, 8, 'F')
    doc.text('Documentation', 22, yPos + 5.5)
    yPos += 15

    // Check if we need a new page
    if (yPos > 200) {
      doc.addPage()
      yPos = 20
    }

    // Table headers
    doc.setFontSize(9)
    doc.setFont('helvetica', 'bold')
    doc.text('Document Name', 20, yPos)
    doc.text('Type', 110, yPos)
    doc.text('Size', 140, yPos)
    doc.text('Upload Date', 165, yPos)
    yPos += 6

    // Table separator line
    doc.setDrawColor(200, 200, 200)
    doc.line(20, yPos, 190, yPos)
    yPos += 8

    // Table rows
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    cargoData.documents.forEach((document) => {
      // Check if we need a new page
      if (yPos > 260) {
        doc.addPage()
        yPos = 20
      }

      const uploadDateFormatted = new Intl.DateTimeFormat('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric'
      }).format(new Date(document.uploadDate))

      doc.text(document.name.substring(0, 30), 20, yPos)
      doc.text(document.type, 110, yPos)
      doc.text(document.size, 140, yPos)
      doc.text(uploadDateFormatted, 165, yPos)
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
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date())
  lines = doc.splitTextToSize(reportGeneratedDate, 160)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  // Report Type field
  if (yPos + 10 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Report Type:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize('Comprehensive Cargo Report', 160)
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
  lines = doc.splitTextToSize('This cargo report provides a comprehensive overview of the cargo item including its current status, location, physical attributes, and historical data. For more detailed information or updates, please access the warehouse management system.', 160)
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
  doc.save(`Cargo_Report_${cargoData.sku}_${reportDate.replace(/\s+/g, '_')}.pdf`)
}
