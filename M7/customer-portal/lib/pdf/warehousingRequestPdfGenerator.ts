import jsPDF from 'jspdf'

const DELIVEROO_LOGO_PATH = '/deliveroo-pdf-logo.png'

interface WarehousingRequestFormData {
  storageType: string
  securityLevel: string
  estimatedVolume: number
  estimatedWeight: number
  estimatedStorageDuration: {
    value: number
    unit: 'days' | 'weeks' | 'months' | 'years'
  }
  plannedStartDate: string | Date
  plannedEndDate?: string | Date
  handlingServices: string[]
  valueAddedServices: string[]
  requiresTemperatureControl: boolean
  requiresHumidityControl: boolean
  requiresSpecialHandling: boolean
  specialInstructions?: string
  billingType: string
  cargo: {
    description: string
    cargoType: string
    packaging: string
    quantity: number
    unitType: string
    value: number
    currency: string
  }
  priority: string
}

interface WarehousingRequestPdfOptions {
  requestNumber?: string
  createdAt?: Date | string
  storageLocation?: string
}

export async function generateWarehousingRequestPDF(
  formData: WarehousingRequestFormData,
  options: WarehousingRequestPdfOptions = {}
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
  doc.text('Warehousing Request', 20, 35)

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
  doc.text('Storage Type:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const storageTypeName = formData.storageType 
    ? formData.storageType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    : 'Not specified'
  doc.text(storageTypeName, 80, yPos)
  yPos += 8

  doc.setFont('helvetica', 'bold')
  doc.text('Priority:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const priorityName = formData.priority 
    ? formData.priority.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    : 'Not specified'
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
  doc.text('Estimated Volume:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(`${formData.estimatedVolume} m³`, 80, yPos)
  yPos += 8

  doc.setFont('helvetica', 'bold')
  doc.text('Estimated Weight:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(`${formData.estimatedWeight} kg`, 80, yPos)
  yPos += 8

  doc.setFont('helvetica', 'bold')
  doc.text('Security Level:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const securityLevelName = formData.securityLevel 
    ? formData.securityLevel.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    : 'Not specified'
  doc.text(securityLevelName, 80, yPos)
  yPos += 8

  if (options.storageLocation) {
    doc.setFont('helvetica', 'bold')
    doc.text('Storage Location:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    doc.text(options.storageLocation, 80, yPos)
    yPos += 8
  }

  doc.setFont('helvetica', 'bold')
  doc.text('Planned Start Date:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  try {
    const startDate = formData.plannedStartDate instanceof Date 
      ? formData.plannedStartDate 
      : typeof formData.plannedStartDate === 'string' 
        ? new Date(formData.plannedStartDate) 
        : new Date()
    doc.text(startDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), 80, yPos)
  } catch (e) {
    doc.text('Not specified', 80, yPos)
  }
  yPos += 8

  if (formData.plannedEndDate) {
    doc.setFont('helvetica', 'bold')
    doc.text('Planned End Date:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    try {
      const endDate = formData.plannedEndDate instanceof Date 
        ? formData.plannedEndDate 
        : typeof formData.plannedEndDate === 'string' 
          ? new Date(formData.plannedEndDate) 
          : new Date()
      doc.text(endDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }), 80, yPos)
    } catch (e) {
      doc.text('Not specified', 80, yPos)
    }
    yPos += 8
  }

  doc.setFont('helvetica', 'bold')
  doc.text('Storage Duration:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const duration = formData.estimatedStorageDuration || { value: 0, unit: 'months' }
  doc.text(`${duration.value} ${duration.unit}`, 80, yPos)
  yPos += 8

  doc.setFont('helvetica', 'bold')
  doc.text('Billing Type:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const billingTypeName = formData.billingType 
    ? formData.billingType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    : 'Not specified'
  doc.text(billingTypeName, 80, yPos)
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
  const cargoDescription = formData.cargo?.description || 'No description provided'
  let lines = doc.splitTextToSize(cargoDescription, pageWidth - 60)
  doc.text(lines, 20, yPos + 4)
  yPos += lines.length * 4 + 6

  doc.setFont('helvetica', 'bold')
  doc.text('Cargo Type:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const cargoTypeName = formData.cargo?.cargoType 
    ? formData.cargo.cargoType.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    : 'Not specified'
  doc.text(cargoTypeName, 80, yPos)
  yPos += 8

  doc.setFont('helvetica', 'bold')
  doc.text('Packaging:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  const packagingName = formData.cargo?.packaging 
    ? formData.cargo.packaging.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    : 'Not specified'
  doc.text(packagingName, 80, yPos)
  yPos += 8

  doc.setFont('helvetica', 'bold')
  doc.text('Quantity:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(`${formData.cargo?.quantity || 0} ${formData.cargo?.unitType || ''}`, 80, yPos)
  yPos += 8

  if (formData.cargo?.value && formData.cargo.value > 0) {
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
  if (formData.handlingServices && formData.handlingServices.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.text('Handling Services:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    const handlingServicesNames = formData.handlingServices.map(s => 
      String(s).replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    ).join(', ')
    doc.text(handlingServicesNames, 80, yPos)
    yPos += 8
  }

  if (formData.valueAddedServices && formData.valueAddedServices.length > 0) {
    doc.setFont('helvetica', 'bold')
    doc.text('Value Added Services:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    const valueAddedServicesNames = formData.valueAddedServices.map(s => 
      String(s).replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
    ).join(', ')
    doc.text(valueAddedServicesNames, 80, yPos)
    yPos += 8
  }

  doc.setFont('helvetica', 'bold')
  doc.text('Requires Temperature Control:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formData.requiresTemperatureControl ? 'Yes' : 'No', 80, yPos)
  yPos += 8

  doc.setFont('helvetica', 'bold')
  doc.text('Requires Humidity Control:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formData.requiresHumidityControl ? 'Yes' : 'No', 80, yPos)
  yPos += 8

  doc.setFont('helvetica', 'bold')
  doc.text('Requires Special Handling:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  doc.text(formData.requiresSpecialHandling ? 'Yes' : 'No', 80, yPos)
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
    ? `Warehousing_Request_${options.requestNumber}.pdf`
    : `Warehousing_Request_${new Date().toISOString().split('T')[0]}.pdf`
  
  doc.save(filename)
}
