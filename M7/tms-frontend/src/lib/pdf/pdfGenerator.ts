import jsPDF from 'jspdf'
import { format } from 'date-fns';

interface Address {
  street: string;
  city: string;
  country: string;
}

interface Location {
  address: Address;
  contactPerson: string;
  contactPhone: string;
}

interface Cargo {
  description: string;
  weight: number;
  packaging: string;
  quantity: number;
  unitType: string;
  value?: number;
  fragile?: boolean;
  cargoType?: string;
}

interface ProgressUpdate {
  status: string;
  location?: string;
  description: string;
  timestamp: Date;
}

interface TransportationRequest {
  requestNumber: string;
  status: string;
  serviceType: string;
  priority: string;
  trackingNumber?: string;
  pickupLocation: Location;
  deliveryLocation: Location;
  cargo: Cargo;
  requiresInsurance?: boolean;
  estimatedCost?: number;
  finalCost?: number;
  currency: string;
  progressUpdates: ProgressUpdate[];
}

interface WarehousingRequest {
  requestNumber: string;
  status: string;
  storageType: string;
  priority: string;
  storageLocation?: string;
  estimatedVolume: number;
  estimatedWeight: number;
  estimatedStorageDuration: {
    value: number;
    unit: string;
  };
  securityLevel: string;
  requiresTemperatureControl?: boolean;
  requiresHumidityControl?: boolean;
  requiresSpecialHandling?: boolean;
  cargo: Cargo;
  handlingServices: string[];
  valueAddedServices: string[];
  estimatedCost?: number;
  finalCost?: number;
  billingType: string;
  currency: string;
  progressUpdates: ProgressUpdate[];
}

const currencyFormatter = new Intl.NumberFormat('pl-PL', {
  style: 'currency',
  currency: 'PLN',
});

export class PDFGenerator {
  private static LOGO_URL = '/deliveroo-pdf-logo.png'
  private static logoLoaded = false
  private static logoImage: string | null = null

  private static async loadLogo(): Promise<string | null> {
    if (this.logoLoaded) {
      return this.logoImage
    }

    try {
      const response = await fetch(this.LOGO_URL)
      const blob = await response.blob()
      return new Promise((resolve) => {
        const reader = new FileReader()
        reader.onloadend = () => {
          this.logoImage = reader.result as string
          this.logoLoaded = true
          resolve(this.logoImage)
        }
        reader.readAsDataURL(blob)
      })
    } catch (error) {
      console.error('Error loading logo:', error)
      this.logoLoaded = true // Prevent further attempts
      return null
    }
  }

  private static async addHeader(doc: jsPDF, title: string): Promise<number> {
    // Try to load and add logo
    const logoData = await this.loadLogo()
    
    if (logoData) {
      // Add logo with appropriate sizing - maintain aspect ratio
      // Using width of 20 and height of 10 to avoid stretching
      doc.addImage(logoData, 'PNG', 15, 15, 15, 15)
    } else {
      // Fallback if logo can't be loaded
      doc.setFillColor(22, 197, 94) // Success green color
      doc.rect(20, 15, 8, 8, 'F')
      
      // Company name as fallback
      doc.setFontSize(20)
      doc.setFont('helvetica', 'bold')
      doc.text('Deliveroo Logistics', 35, 21)
    }
    
    // Document title
    doc.setFontSize(16)
    doc.setFont('helvetica', 'normal')
    doc.text(title, 20, 35)
    
    // Date generated
    doc.setFontSize(10)
    doc.setTextColor(100, 100, 100)
    doc.text(`Generated: ${new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })}`, 20, 42)
    
    // Reset text color
    doc.setTextColor(0, 0, 0)
    
    return 55 // Return Y position for content start
  }

  private static addFooter(doc: jsPDF) {
    const pageHeight = doc.internal.pageSize.height
    
    // Footer line
    doc.setDrawColor(200, 200, 200)
    doc.line(20, pageHeight - 25, 190, pageHeight - 25)
    
    // Footer text
    doc.setFontSize(8)
    doc.setTextColor(100, 100, 100)
    doc.text('Deliveroo Logistics | ul. Logistyczna 123, 00-001 Warsaw, Poland', 20, pageHeight - 18)
    doc.text('Phone: +48 123 456 789 | Email: contact@deliveroo.pl', 20, pageHeight - 12)
    
    // Page number
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.text(`Page ${i} of ${pageCount}`, 170, pageHeight - 12)
    }
  }

  private static addSection(doc: jsPDF, title: string, yPos: number): number {
    doc.setFontSize(14)
    doc.setFont('helvetica', 'bold')
    doc.setFillColor(248, 250, 252) // Light gray background
    doc.rect(20, yPos, 170, 8, 'F')
    doc.text(title, 22, yPos + 5.5)
    
    return yPos + 15
  }

  private static addField(doc: jsPDF, label: string, value: string, x: number, y: number, width: number = 80): number {
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text(label + ':', x, y)
    
    doc.setFont('helvetica', 'normal')
    const lines = doc.splitTextToSize(value, width)
    doc.text(lines, x, y + 4)
    
    return y + (lines.length * 4) + 6
  }

  private static formatStatus(status: string): string {
    return status.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  private static formatServiceType(type: string): string {
    return type.replace(/_/g, ' ').toLowerCase().replace(/\b\w/g, l => l.toUpperCase())
  }

  private static formatDateTime(date: Date): string {
    return new Intl.DateTimeFormat('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date)
  }

  static async generateTransportationRequestPDF(data: TransportationRequest): Promise<void> {
    const doc = new jsPDF()
    
    // Add header
    let yPos = await this.addHeader(doc, `Transportation Request - ${data.requestNumber}`)
    
    // Request Overview Section
    yPos = this.addSection(doc, 'Request Overview', yPos)
    yPos = this.addField(doc, 'Request Number', data.requestNumber, 20, yPos)
    yPos = this.addField(doc, 'Status', this.formatStatus(data.status), 110, yPos - 10)
    yPos = this.addField(doc, 'Service Type', this.formatServiceType(data.serviceType), 20, yPos)
    yPos = this.addField(doc, 'Priority', this.formatStatus(data.priority), 110, yPos - 10)
    if (data.trackingNumber) {
      yPos = this.addField(doc, 'Tracking Number', data.trackingNumber, 20, yPos)
    }
    yPos += 5
    
    // Pickup Information Section
    yPos = this.addSection(doc, 'Pickup Information', yPos)
    yPos = this.addField(doc, 'Address', `${data.pickupLocation.address.street}, ${data.pickupLocation.address.city}, ${data.pickupLocation.address.country}`, 20, yPos, 170)
    yPos = this.addField(doc, 'Contact Person', data.pickupLocation.contactPerson, 20, yPos)
    yPos = this.addField(doc, 'Contact Phone', data.pickupLocation.contactPhone, 110, yPos - 10)
    yPos += 5
    
    // Delivery Information Section
    yPos = this.addSection(doc, 'Delivery Information', yPos)
    yPos = this.addField(doc, 'Address', `${data.deliveryLocation.address.street}, ${data.deliveryLocation.address.city}, ${data.deliveryLocation.address.country}`, 20, yPos, 170)
    yPos = this.addField(doc, 'Contact Person', data.deliveryLocation.contactPerson, 20, yPos)
    yPos = this.addField(doc, 'Contact Phone', data.deliveryLocation.contactPhone, 110, yPos - 10)
    yPos += 5
    
    // Cargo Information Section
    yPos = this.addSection(doc, 'Cargo Information', yPos)
    yPos = this.addField(doc, 'Description', data.cargo.description, 20, yPos, 170)
    yPos = this.addField(doc, 'Weight', `${data.cargo.weight} kg`, 20, yPos)
    yPos = this.addField(doc, 'Packaging', this.formatServiceType(data.cargo.packaging), 110, yPos - 10)
    yPos = this.addField(doc, 'Quantity', `${data.cargo.quantity} ${data.cargo.unitType}`, 20, yPos)
    if (data.cargo.value) {
      yPos = this.addField(doc, 'Value', currencyFormatter.format(data.cargo.value), 110, yPos - 10)
    }
    
    const specialHandling = []
    if (data.cargo.fragile) specialHandling.push('Fragile')
    if (data.requiresInsurance) specialHandling.push('Insured')
    if (specialHandling.length > 0) {
      yPos = this.addField(doc, 'Special Handling', specialHandling.join(', '), 20, yPos)
    }
    yPos += 5
    
    // Check if we need a new page
    if (yPos > 220) {
      doc.addPage()
      yPos = 20
    }
    
    // Pricing Information Section
    yPos = this.addSection(doc, 'Pricing Information', yPos)
    if (data.estimatedCost) {
      yPos = this.addField(doc, 'Estimated Cost', currencyFormatter.format(data.estimatedCost), 20, yPos)
    } else {
      yPos = this.addField(doc, 'Estimated Cost', 'Pending quote', 20, yPos)
    }
    if (data.finalCost) {
      yPos = this.addField(doc, 'Final Cost', currencyFormatter.format(data.finalCost), 110, yPos - 10)
    } else {
      yPos = this.addField(doc, 'Final Cost', 'Not finalized', 110, yPos - 10)
    }
    yPos = this.addField(doc, 'Currency', data.currency, 20, yPos)
    yPos += 5
    
    // Progress Timeline Section
    if (data.progressUpdates.length > 0) {
      yPos = this.addSection(doc, 'Progress Timeline', yPos)
      
      data.progressUpdates.forEach((update, index) => {
        if (yPos > 250) {
          doc.addPage()
          yPos = 20
        }
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(`${index + 1}. ${this.formatStatus(update.status)}`, 25, yPos)
        
        if (update.location) {
          doc.setFont('helvetica', 'normal')
          doc.text(`in ${update.location}`, 25, yPos + 4)
        }
        
        doc.setFont('helvetica', 'normal')
        doc.text(update.description, 25, yPos + 8)
        doc.text(this.formatDateTime(update.timestamp), 25, yPos + 12)
        
        yPos += 20
      })
    }
    
    // Add footer
    this.addFooter(doc)
    
    // Save the PDF
    doc.save(`Transportation_Request_${data.requestNumber}.pdf`)
  }

  static async generateWarehousingRequestPDF(data: WarehousingRequest): Promise<void> {
    const doc = new jsPDF()
    
    // Add header
    let yPos = await this.addHeader(doc, `Warehousing Request - ${data.requestNumber}`)
    
    // Request Overview Section
    yPos = this.addSection(doc, 'Request Overview', yPos)
    yPos = this.addField(doc, 'Request Number', data.requestNumber, 20, yPos)
    yPos = this.addField(doc, 'Status', this.formatStatus(data.status), 110, yPos - 10)
    yPos = this.addField(doc, 'Storage Type', this.formatServiceType(data.storageType), 20, yPos)
    yPos = this.addField(doc, 'Priority', this.formatStatus(data.priority), 110, yPos - 10)
    if (data.storageLocation) {
      yPos = this.addField(doc, 'Storage Location', data.storageLocation, 20, yPos)
    }
    yPos += 5
    
    // Storage Requirements Section
    yPos = this.addSection(doc, 'Storage Requirements', yPos)
    yPos = this.addField(doc, 'Estimated Volume', `${data.estimatedVolume} m³`, 20, yPos)
    yPos = this.addField(doc, 'Estimated Weight', `${data.estimatedWeight} kg`, 110, yPos - 10)
    yPos = this.addField(doc, 'Storage Duration', `${data.estimatedStorageDuration.value} ${data.estimatedStorageDuration.unit}`, 20, yPos)
    yPos = this.addField(doc, 'Security Level', this.formatStatus(data.securityLevel), 110, yPos - 10)
    
    const requirements = []
    if (data.requiresTemperatureControl) requirements.push('Temperature Control')
    if (data.requiresHumidityControl) requirements.push('Humidity Control')
    if (data.requiresSpecialHandling) requirements.push('Special Handling')
    if (requirements.length > 0) {
      yPos = this.addField(doc, 'Special Requirements', requirements.join(', '), 20, yPos, 170)
    }
    yPos += 5
    
    // Cargo Information Section
    yPos = this.addSection(doc, 'Cargo Information', yPos)
    yPos = this.addField(doc, 'Description', data.cargo.description, 20, yPos, 170)
    if(data.cargo.cargoType) yPos = this.addField(doc, 'Cargo Type', this.formatServiceType(data.cargo.cargoType), 20, yPos);
    yPos = this.addField(doc, 'Packaging', this.formatServiceType(data.cargo.packaging), 110, yPos - 10)
    yPos = this.addField(doc, 'Quantity', `${data.cargo.quantity} ${data.cargo.unitType}`, 20, yPos)
    if (data.cargo.value) {
      yPos = this.addField(doc, 'Value', currencyFormatter.format(data.cargo.value), 110, yPos - 10)
    }
    yPos += 5
    
    // Check if we need a new page
    if (yPos > 200) {
      doc.addPage()
      yPos = 20
    }
    
    // Services Section
    yPos = this.addSection(doc, 'Services', yPos)
    if (data.handlingServices.length > 0) {
      yPos = this.addField(doc, 'Handling Services', data.handlingServices.map(s => this.formatServiceType(s)).join(', '), 20, yPos, 170)
    }
    if (data.valueAddedServices.length > 0) {
      yPos = this.addField(doc, 'Value-Added Services', data.valueAddedServices.map(s => this.formatServiceType(s)).join(', '), 20, yPos, 170)
    }
    yPos += 5
    
    // Pricing Information Section
    yPos = this.addSection(doc, 'Pricing Information', yPos)
    if (data.estimatedCost) {
      yPos = this.addField(doc, 'Estimated Cost', currencyFormatter.format(data.estimatedCost), 20, yPos)
    } else {
      yPos = this.addField(doc, 'Estimated Cost', 'Pending quote', 20, yPos)
    }
    if (data.finalCost) {
      yPos = this.addField(doc, 'Final Cost', currencyFormatter.format(data.finalCost), 110, yPos - 10)
    } else {
      yPos = this.addField(doc, 'Final Cost', 'Not finalized', 110, yPos - 10)
    }
    yPos = this.addField(doc, 'Billing Type', this.formatServiceType(data.billingType), 20, yPos)
    yPos = this.addField(doc, 'Currency', data.currency, 110, yPos - 10)
    yPos += 5
    
    // Progress Timeline Section
    if (data.progressUpdates.length > 0) {
      yPos = this.addSection(doc, 'Progress Timeline', yPos)
      
      data.progressUpdates.forEach((update, index) => {
        if (yPos > 250) {
          doc.addPage()
          yPos = 20
        }
        
        doc.setFontSize(10)
        doc.setFont('helvetica', 'bold')
        doc.text(`${index + 1}. ${this.formatStatus(update.status)}`, 25, yPos)
        
        if (update.location) {
          doc.setFont('helvetica', 'normal')
          doc.text(`at ${update.location}`, 25, yPos + 4)
        }
        
        doc.setFont('helvetica', 'normal')
        doc.text(update.description, 25, yPos + 8)
        doc.text(this.formatDateTime(update.timestamp), 25, yPos + 12)
        
        yPos += 20
      })
    }
    
    // Add footer
    this.addFooter(doc)
    
    // Save the PDF
    doc.save(`Warehousing_Request_${data.requestNumber}.pdf`)
  }
}