import jsPDF from 'jspdf'

const DELIVEROO_LOGO_PATH = '/deliveroo-pdf-logo.png'

interface TransportationRequestFormData {
  serviceType: string
  pickupLocation: {
    address: {
      street: string
      city: string
      country: string
    }
    contactPerson: string
    contactPhone: string
    contactEmail?: string
    loadingType?: string
  }
  deliveryLocation: {
    address: {
      street: string
      city: string
      country: string
    }
    contactPerson: string
    contactPhone: string
    contactEmail?: string
    loadingType?: string
  }
  cargo: {
    description: string
    cargoType: string
    weight: number
    packaging: string
    quantity: number
    unitType: string
    value: number
    currency: string
    fragile?: boolean
    stackable?: boolean
  }
  requestedPickupDate: string | Date
  requestedDeliveryDate?: string | Date
  specialInstructions?: string
  requiresInsurance: boolean
  requiresCustomsClearance: boolean
  priority: string
  currency: string
}

interface TransportationRequestPdfOptions {
  requestNumber?: string
  createdAt?: Date | string
}

export async function generateTransportationRequestPDF(
  formData: TransportationRequestFormData,
  options: TransportationRequestPdfOptions = {}
): Promise<void> {
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
  doc.text('Transportation Request', 20, 35)

  // Company name
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Deliveroo Logistics', 20, 42)

  let yPos = 55

  // Request Information Section
  if (yPos + 15 > pageHeight - 30) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(14)
  doc.setFont('helvetica', 'bold')
  doc.setFillColor(248, 250, 252)
  doc.rect(20, yPos, pageWidth - 40, 8, 'F')
  doc.text('Request Information', 22, yPos + 5.5)
  yPos += 15

  doc.setFontSize(10)
  if (options.requestNumber) {
    doc.setFont('helvetica', 'bold')
    doc.text('Request Number:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(options.requestNumber, 80, yPos)
    yPos += 8
  }

  doc.setFont('helvetica', 'bold')
  doc.text('Service Type:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const serviceTypeName = formData.serviceType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  doc.text(serviceTypeName, 80, yPos)
  yPos += 8

  doc.setFont('helvetica', 'bold')
  doc.text('Priority:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const priorityName = formData.priority.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  doc.text(priorityName, 80, yPos)
  yPos += 8

  if (options.createdAt) {
    doc.setFont('helvetica', 'bold')
    doc.text('Created:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    const createdDate = typeof options.createdAt === 'string' ? new Date(options.createdAt) : options.createdAt
    doc.text(createdDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), 80, yPos)
    yPos += 8
  }

  yPos += 7

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
  const pickupAddress = `${formData.pickupLocation.address.street}, ${formData.pickupLocation.address.city}, ${formData.pickupLocation.address.country}`
  let lines = doc.splitTextToSize(pickupAddress, pageWidth - 60)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  doc.setFont('helvetica', 'bold')
  doc.text('Contact Person:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formData.pickupLocation.contactPerson, 80, yPos)
  yPos += 8

  doc.setFont('helvetica', 'bold')
  doc.text('Phone:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formData.pickupLocation.contactPhone, 80, yPos)
  yPos += 8

  if (formData.pickupLocation.contactEmail) {
    doc.setFont('helvetica', 'bold')
    doc.text('Email:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formData.pickupLocation.contactEmail, 80, yPos)
    yPos += 8
  }

  doc.setFont('helvetica', 'bold')
  doc.text('Requested Pickup Date:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const pickupDate = typeof formData.requestedPickupDate === 'string' ? new Date(formData.requestedPickupDate) : formData.requestedPickupDate
  doc.text(pickupDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), 80, yPos)
  yPos += 8

  if (formData.pickupLocation.loadingType) {
    doc.setFont('helvetica', 'bold')
    doc.text('Loading Type:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    const loadingType = formData.pickupLocation.loadingType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    doc.text(loadingType, 80, yPos)
    yPos += 8
  }

  yPos += 7

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
  const deliveryAddress = `${formData.deliveryLocation.address.street}, ${formData.deliveryLocation.address.city}, ${formData.deliveryLocation.address.country}`
  lines = doc.splitTextToSize(deliveryAddress, pageWidth - 60)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  doc.setFont('helvetica', 'bold')
  doc.text('Contact Person:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formData.deliveryLocation.contactPerson, 80, yPos)
  yPos += 8

  doc.setFont('helvetica', 'bold')
  doc.text('Phone:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formData.deliveryLocation.contactPhone, 80, yPos)
  yPos += 8

  if (formData.deliveryLocation.contactEmail) {
    doc.setFont('helvetica', 'bold')
    doc.text('Email:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formData.deliveryLocation.contactEmail, 80, yPos)
    yPos += 8
  }

  if (formData.requestedDeliveryDate) {
    doc.setFont('helvetica', 'bold')
    doc.text('Requested Delivery Date:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    const deliveryDate = typeof formData.requestedDeliveryDate === 'string' ? new Date(formData.requestedDeliveryDate) : formData.requestedDeliveryDate
    doc.text(deliveryDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), 80, yPos)
    yPos += 8
  }

  if (formData.deliveryLocation.loadingType) {
    doc.setFont('helvetica', 'bold')
    doc.text('Unloading Type:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    const unloadingType = formData.deliveryLocation.loadingType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    doc.text(unloadingType, 80, yPos)
    yPos += 8
  }

  yPos += 7

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
  lines = doc.splitTextToSize(formData.cargo.description, pageWidth - 60)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  doc.setFont('helvetica', 'bold')
  doc.text('Cargo Type:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const cargoTypeName = formData.cargo.cargoType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  doc.text(cargoTypeName, 80, yPos)
  yPos += 8

  doc.setFont('helvetica', 'bold')
  doc.text('Weight:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(`${formData.cargo.weight} kg`, 80, yPos)
  yPos += 8

  doc.setFont('helvetica', 'bold')
  doc.text('Packaging:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const packagingName = formData.cargo.packaging.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  doc.text(packagingName, 80, yPos)
  yPos += 8

  doc.setFont('helvetica', 'bold')
  doc.text('Quantity:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(`${formData.cargo.quantity} ${formData.cargo.unitType}`, 80, yPos)
  yPos += 8

  if (formData.cargo.value > 0) {
    doc.setFont('helvetica', 'bold')
    doc.text('Estimated Value:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    const formattedValue = new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: formData.cargo.currency || 'EUR'
    }).format(formData.cargo.value)
    doc.text(formattedValue, 80, yPos)
    yPos += 8
  }

  if (formData.cargo.fragile !== undefined) {
    doc.setFont('helvetica', 'bold')
    doc.text('Fragile:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formData.cargo.fragile ? 'Yes' : 'No', 80, yPos)
    yPos += 8
  }

  if (formData.cargo.stackable !== undefined) {
    doc.setFont('helvetica', 'bold')
    doc.text('Stackable:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(formData.cargo.stackable ? 'Yes' : 'No', 80, yPos)
    yPos += 8
  }

  yPos += 7

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
  doc.setFont('helvetica', 'bold')
  doc.text('Requires Insurance:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formData.requiresInsurance ? 'Yes' : 'No', 80, yPos)
  yPos += 8

  doc.setFont('helvetica', 'bold')
  doc.text('Requires Customs Clearance:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formData.requiresCustomsClearance ? 'Yes' : 'No', 80, yPos)
  yPos += 8

  if (formData.specialInstructions) {
    doc.setFont('helvetica', 'bold')
    doc.text('Special Instructions:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    lines = doc.splitTextToSize(formData.specialInstructions, pageWidth - 60)
    doc.text(lines, 20, yPos + 4)
    yPos += lines.length * 4 + 6
  }

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

  // Generate filename
  const filename = options.requestNumber 
    ? `Transportation_Request_${options.requestNumber}.pdf`
    : `Transportation_Request_${new Date().toISOString().split('T')[0]}.pdf`
  
  doc.save(filename)
}
