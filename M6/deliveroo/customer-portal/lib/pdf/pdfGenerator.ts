import jsPDF from 'jspdf'

const DELIVEROO_LOGO_PATH = '/deliveroo-pdf-logo.png'

// Transportation Request Types
interface TransportationRequestData {
  id: string
  requestNumber: string
  status: string
  priority: string
  pickupLocation: {
    address: {
      street: string
      city: string
      postalCode: string
      country: string
    }
    contactPerson: string
    contactPhone: string
    contactEmail: string
  }
  deliveryLocation: {
    address: {
      street: string
      city: string
      postalCode: string
      country: string
    }
    contactPerson: string
    contactPhone: string
    contactEmail: string
  }
  cargo: {
    description: string
    cargoType: string
    weight: number
    dimensions: {
      length: number
      width: number
      height: number
      unit: string
    }
    value: number
    currency: string
    packaging: string
    quantity: number
    unitType: string
  }
  serviceType: string
  vehicleRequirements?: {
    vehicleType: string
    capacity: number
  }
  requestedPickupDate: Date | string
  requestedDeliveryDate: Date | string
  specialInstructions?: string
  requiresInsurance: boolean
  requiresCustomsClearance: boolean
  estimatedCost?: number
  finalCost?: number
  currency: string
  trackingNumber?: string
  createdAt: Date | string
}

// Warehousing Request Types
interface WarehousingRequestData {
  id: string
  requestNumber: string
  status: string
  priority: string
  storageType: string
  estimatedVolume: number
  estimatedWeight: number
  cargo: {
    description: string
    cargoType: string
    weight: number
    dimensions: {
      length: number
      width: number
      height: number
      unit: string
    }
    value: number
    currency: string
    packaging: string
    quantity: number
    unitType: string
  }
  estimatedStorageDuration: {
    value: number
    unit: string
  }
  plannedStartDate: Date | string
  plannedEndDate?: Date | string
  handlingServices: string[]
  valueAddedServices: string[]
  securityLevel: string
  requiresTemperatureControl: boolean
  requiresHumidityControl: boolean
  requiresSpecialHandling: boolean
  specialInstructions?: string
  estimatedCost?: number
  finalCost?: number
  currency: string
  billingType: string
  storageLocation?: string
  createdAt: Date | string
}

async function loadLogo(): Promise<string | null> {
  try {
    const response = await fetch(DELIVEROO_LOGO_PATH)
    const blob = await response.blob()
    return await new Promise((resolve) => {
      const reader = new FileReader()
      reader.onloadend = () => resolve(reader.result as string)
      reader.readAsDataURL(blob)
    })
  } catch (err) {
    console.error('Failed to load local image', err)
    return null
  }
}

function formatDate(date: Date | string): string {
  const d = typeof date === 'string' ? new Date(date) : date
  return new Intl.DateTimeFormat('en-US', {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }).format(d)
}

function formatCurrency(amount: number, currency: string): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency || 'EUR'
  }).format(amount)
}

function addFooter(doc: jsPDF, pageHeight: number, pageWidth: number) {
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
}

export const PDFGenerator = {
  async generateTransportationRequestPDF(request: TransportationRequestData): Promise<void> {
    const doc = new jsPDF()
    const pageHeight = doc.internal.pageSize.height
    const pageWidth = doc.internal.pageSize.width
    
    const logoDataUrl = await loadLogo()
    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', 15, 15, 15, 15)
    }

    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Transportation Request', 20, 35)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Deliveroo Logistics', 20, 42)

    let yPos = 55

    // Request Information Section
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(248, 250, 252)
    doc.rect(20, yPos, pageWidth - 40, 8, 'F')
    doc.text('Request Information', 22, yPos + 5.5)
    yPos += 15

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Request Number:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.requestNumber, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Status:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.status, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Priority:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.priority, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Created:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formatDate(request.createdAt), 80, yPos)
    yPos += 15

    // Pickup Location Section
    if (yPos + 15 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(248, 250, 252)
    doc.rect(20, yPos, pageWidth - 40, 8, 'F')
    doc.text('Pickup Location', 22, yPos + 5.5)
    yPos += 15

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Address:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    const pickupAddress = `${request.pickupLocation.address.street}, ${request.pickupLocation.address.city}, ${request.pickupLocation.address.postalCode}, ${request.pickupLocation.address.country}`
    let lines = doc.splitTextToSize(pickupAddress, pageWidth - 60)
    doc.text(lines, 20, yPos + 4)
    yPos += lines.length * 4 + 6

    doc.setFont('helvetica', 'bold')
    doc.text('Contact Person:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.pickupLocation.contactPerson, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Phone:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.pickupLocation.contactPhone, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Email:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.pickupLocation.contactEmail, 80, yPos)
    yPos += 15

    // Delivery Location Section
    if (yPos + 15 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(248, 250, 252)
    doc.rect(20, yPos, pageWidth - 40, 8, 'F')
    doc.text('Delivery Location', 22, yPos + 5.5)
    yPos += 15

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Address:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    const deliveryAddress = `${request.deliveryLocation.address.street}, ${request.deliveryLocation.address.city}, ${request.deliveryLocation.address.postalCode}, ${request.deliveryLocation.address.country}`
    lines = doc.splitTextToSize(deliveryAddress, pageWidth - 60)
    doc.text(lines, 20, yPos + 4)
    yPos += lines.length * 4 + 6

    doc.setFont('helvetica', 'bold')
    doc.text('Contact Person:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.deliveryLocation.contactPerson, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Phone:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.deliveryLocation.contactPhone, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Email:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.deliveryLocation.contactEmail, 80, yPos)
    yPos += 15

    // Cargo Information Section
    if (yPos + 15 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(248, 250, 252)
    doc.rect(20, yPos, pageWidth - 40, 8, 'F')
    doc.text('Cargo Information', 22, yPos + 5.5)
    yPos += 15

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Description:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    lines = doc.splitTextToSize(request.cargo.description, pageWidth - 60)
    doc.text(lines, 20, yPos + 4)
    yPos += lines.length * 4 + 6

    doc.setFont('helvetica', 'bold')
    doc.text('Cargo Type:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.cargo.cargoType, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Weight:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(`${request.cargo.weight} kg`, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Dimensions:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(`${request.cargo.dimensions.length} × ${request.cargo.dimensions.width} × ${request.cargo.dimensions.height} ${request.cargo.dimensions.unit}`, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Quantity:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(`${request.cargo.quantity} ${request.cargo.unitType}`, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Value:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formatCurrency(request.cargo.value, request.cargo.currency), 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Packaging:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.cargo.packaging, 80, yPos)
    yPos += 15

    // Service Details Section
    if (yPos + 15 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(248, 250, 252)
    doc.rect(20, yPos, pageWidth - 40, 8, 'F')
    doc.text('Service Details', 22, yPos + 5.5)
    yPos += 15

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Service Type:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.serviceType, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Requested Pickup Date:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formatDate(request.requestedPickupDate), 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Requested Delivery Date:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formatDate(request.requestedDeliveryDate), 80, yPos)
    yPos += 8

    if (request.vehicleRequirements) {
      doc.setFont('helvetica', 'bold')
      doc.text('Vehicle Type:', 20, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(request.vehicleRequirements.vehicleType, 80, yPos)
      yPos += 8
    }

    doc.setFont('helvetica', 'bold')
    doc.text('Requires Insurance:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.requiresInsurance ? 'Yes' : 'No', 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Requires Customs Clearance:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.requiresCustomsClearance ? 'Yes' : 'No', 80, yPos)
    yPos += 8

    if (request.specialInstructions) {
      doc.setFont('helvetica', 'bold')
      doc.text('Special Instructions:', 20, yPos)
      doc.setFont('helvetica', 'normal')
      lines = doc.splitTextToSize(request.specialInstructions, pageWidth - 60)
      doc.text(lines, 20, yPos + 4)
      yPos += lines.length * 4 + 6
    }

    if (request.trackingNumber) {
      doc.setFont('helvetica', 'bold')
      doc.text('Tracking Number:', 20, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(request.trackingNumber, 80, yPos)
      yPos += 8
    }

    // Pricing Section
    if (yPos + 15 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(248, 250, 252)
    doc.rect(20, yPos, pageWidth - 40, 8, 'F')
    doc.text('Pricing', 22, yPos + 5.5)
    yPos += 15

    doc.setFontSize(10)
    if (request.estimatedCost) {
      doc.setFont('helvetica', 'bold')
      doc.text('Estimated Cost:', 20, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(formatCurrency(request.estimatedCost, request.currency), 80, yPos)
      yPos += 8
    }

    if (request.finalCost) {
      doc.setFont('helvetica', 'bold')
      doc.text('Final Cost:', 20, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(formatCurrency(request.finalCost, request.currency), 80, yPos)
      yPos += 8
    }

    addFooter(doc, pageHeight, pageWidth)
    doc.save(`Transportation_Request_${request.requestNumber}.pdf`)
  },

  async generateWarehousingRequestPDF(request: WarehousingRequestData): Promise<void> {
    const doc = new jsPDF()
    const pageHeight = doc.internal.pageSize.height
    const pageWidth = doc.internal.pageSize.width
    
    const logoDataUrl = await loadLogo()
    if (logoDataUrl) {
      doc.addImage(logoDataUrl, 'PNG', 15, 15, 15, 15)
    }

    doc.setFontSize(16)
    doc.setFont('helvetica', 'bold')
    doc.text('Warehousing Request', 20, 35)

    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    doc.text('Deliveroo Logistics', 20, 42)

    let yPos = 55

    // Request Information Section
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(248, 250, 252)
    doc.rect(20, yPos, pageWidth - 40, 8, 'F')
    doc.text('Request Information', 22, yPos + 5.5)
    yPos += 15

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Request Number:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.requestNumber, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Status:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.status, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Priority:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.priority, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Created:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formatDate(request.createdAt), 80, yPos)
    yPos += 15

    // Storage Information Section
    if (yPos + 15 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(248, 250, 252)
    doc.rect(20, yPos, pageWidth - 40, 8, 'F')
    doc.text('Storage Information', 22, yPos + 5.5)
    yPos += 15

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Storage Type:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.storageType, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Estimated Volume:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(`${request.estimatedVolume} m³`, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Estimated Weight:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(`${request.estimatedWeight} kg`, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Security Level:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.securityLevel, 80, yPos)
    yPos += 8

    if (request.storageLocation) {
      doc.setFont('helvetica', 'bold')
      doc.text('Storage Location:', 20, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(request.storageLocation, 80, yPos)
      yPos += 8
    }

    doc.setFont('helvetica', 'bold')
    doc.text('Planned Start Date:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formatDate(request.plannedStartDate), 80, yPos)
    yPos += 8

    if (request.plannedEndDate) {
      doc.setFont('helvetica', 'bold')
      doc.text('Planned End Date:', 20, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(formatDate(request.plannedEndDate), 80, yPos)
      yPos += 8
    }

    doc.setFont('helvetica', 'bold')
    doc.text('Storage Duration:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(`${request.estimatedStorageDuration.value} ${request.estimatedStorageDuration.unit}`, 80, yPos)
    yPos += 15

    // Cargo Information Section
    if (yPos + 15 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(248, 250, 252)
    doc.rect(20, yPos, pageWidth - 40, 8, 'F')
    doc.text('Cargo Information', 22, yPos + 5.5)
    yPos += 15

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Description:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    let lines = doc.splitTextToSize(request.cargo.description, pageWidth - 60)
    doc.text(lines, 20, yPos + 4)
    yPos += lines.length * 4 + 6

    doc.setFont('helvetica', 'bold')
    doc.text('Cargo Type:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.cargo.cargoType, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Weight:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(`${request.cargo.weight} kg`, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Dimensions:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(`${request.cargo.dimensions.length} × ${request.cargo.dimensions.width} × ${request.cargo.dimensions.height} ${request.cargo.dimensions.unit}`, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Quantity:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(`${request.cargo.quantity} ${request.cargo.unitType}`, 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Value:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formatCurrency(request.cargo.value, request.cargo.currency), 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Packaging:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.cargo.packaging, 80, yPos)
    yPos += 15

    // Service Requirements Section
    if (yPos + 15 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(248, 250, 252)
    doc.rect(20, yPos, pageWidth - 40, 8, 'F')
    doc.text('Service Requirements', 22, yPos + 5.5)
    yPos += 15

    doc.setFontSize(10)
    if (request.handlingServices.length > 0) {
      doc.setFont('helvetica', 'bold')
      doc.text('Handling Services:', 20, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(request.handlingServices.join(', '), 80, yPos)
      yPos += 8
    }

    if (request.valueAddedServices.length > 0) {
      doc.setFont('helvetica', 'bold')
      doc.text('Value Added Services:', 20, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(request.valueAddedServices.join(', '), 80, yPos)
      yPos += 8
    }

    doc.setFont('helvetica', 'bold')
    doc.text('Requires Temperature Control:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.requiresTemperatureControl ? 'Yes' : 'No', 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Requires Humidity Control:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.requiresHumidityControl ? 'Yes' : 'No', 80, yPos)
    yPos += 8

    doc.setFont('helvetica', 'bold')
    doc.text('Requires Special Handling:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.requiresSpecialHandling ? 'Yes' : 'No', 80, yPos)
    yPos += 8

    if (request.specialInstructions) {
      doc.setFont('helvetica', 'bold')
      doc.text('Special Instructions:', 20, yPos)
      doc.setFont('helvetica', 'normal')
      lines = doc.splitTextToSize(request.specialInstructions, pageWidth - 60)
      doc.text(lines, 20, yPos + 4)
      yPos += lines.length * 4 + 6
    }

    // Pricing Section
    if (yPos + 15 > pageHeight - 30) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(248, 250, 252)
    doc.rect(20, yPos, pageWidth - 40, 8, 'F')
    doc.text('Pricing', 22, yPos + 5.5)
    yPos += 15

    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Billing Type:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(request.billingType, 80, yPos)
    yPos += 8

    if (request.estimatedCost) {
      doc.setFont('helvetica', 'bold')
      doc.text('Estimated Cost:', 20, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(formatCurrency(request.estimatedCost, request.currency), 80, yPos)
      yPos += 8
    }

    if (request.finalCost) {
      doc.setFont('helvetica', 'bold')
      doc.text('Final Cost:', 20, yPos)
      doc.setFont('helvetica', 'normal')
      doc.text(formatCurrency(request.finalCost, request.currency), 80, yPos)
      yPos += 8
    }

    addFooter(doc, pageHeight, pageWidth)
    doc.save(`Warehousing_Request_${request.requestNumber}.pdf`)
  }
}
