import jsPDF from 'jspdf'
import { Document } from '../../model/documents'

const DELIVEROO_LOGO_PATH = '/deliveroo-pdf-logo.png'

interface PDFOptions {
  includeWatermark?: boolean
  includeFooter?: boolean
}

function getDocumentTypeLabel(type: Document['type']): string {
  const labels = {
    'contract': 'Contract',
    'invoice': 'Invoice',
    'registration': 'Vehicle Registration',
    'insurance': 'Insurance Policy',
    'inspection': 'Technical Inspection Certificate',
    'tir-carnet': 'TIR Carnet',
    'adr': 'ADR Certificate',
    'hazmat-permit': 'Hazmat Transport Permit',
    'license': 'License',
    'certificate': 'Certificate',
    'other': 'Document'
  }
  return labels[type]
}

function getEntityTypeLabel(type: Document['entityType']): string {
  const labels = {
    'vehicle': 'Vehicle',
    'customer': 'Customer',
    'supplier': 'Supplier',
    'driver': 'Driver',
    'company': 'Company',
    'other': 'Other'
  }
  return labels[type]
}

function formatDate(date: string | Date): string {
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit'
  }).format(new Date(date))
}

// Utility function to generate and download a document PDF
export async function generateDocumentPDF(document: Document, options: PDFOptions = {}): Promise<void> {
  const doc = new jsPDF()
  const pageHeight = doc.internal.pageSize.height
  const pageWidth = doc.internal.pageSize.getWidth()
  
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
    doc.addImage(logoDataUrl, 'PNG', 20, 10, 40, 15)
  }

  // Company info
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Transport Management System', pageWidth - 20 - 60, 15)
  doc.text('Deliveroo TMS Sp. z o.o.', pageWidth - 20 - 60, 22)
  
  // Header line
  doc.setLineWidth(0.5)
  doc.line(20, 30, pageWidth - 20, 30)
  
  let yPos = 40

  // Add watermark if requested
  if (options.includeWatermark) {
    doc.setFontSize(50)
    doc.setTextColor(200, 200, 200)
    doc.setFont('helvetica', 'bold')
    doc.text('SAMPLE DOCUMENT', pageWidth / 2, pageHeight / 2, {
      angle: 45,
      align: 'center'
    })
    doc.setTextColor(0, 0, 0)
  }

  // Document title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(getDocumentTypeLabel(document.type), 20, yPos)
  yPos += 15

  // Document Information Section
  if (yPos + 15 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Document Information', 20, yPos)
  yPos += 8

  // Document Name field
  if (yPos + 10 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Document Name:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  let lines = doc.splitTextToSize(document.name, 80)
  doc.text(lines, 60, yPos)
  yPos += Math.max(lines.length * 4, 6)

  // Document Type field
  if (yPos + 10 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Document Type:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(getDocumentTypeLabel(document.type), 80)
  doc.text(lines, 60, yPos)
  yPos += Math.max(lines.length * 4, 6)

  // Document ID field
  if (yPos + 10 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Document ID:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(document.id, 80)
  doc.text(lines, 60, yPos)
  yPos += Math.max(lines.length * 4, 6)

  // Document Number field (if exists)
  if (document.number) {
    if (yPos + 10 > pageHeight - 40) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Document Number:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    lines = doc.splitTextToSize(document.number, 80)
    doc.text(lines, 60, yPos)
    yPos += Math.max(lines.length * 4, 6)
  }

  yPos += 5

  // Related Entity Section
  if (yPos + 15 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Related Entity', 20, yPos)
  yPos += 8

  // Related To field
  if (yPos + 10 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Related To:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(getEntityTypeLabel(document.entityType), 80)
  doc.text(lines, 60, yPos)
  yPos += Math.max(lines.length * 4, 6)

  // Entity Name field
  if (yPos + 10 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Entity Name:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(document.entityName, 80)
  doc.text(lines, 60, yPos)
  yPos += Math.max(lines.length * 4, 6)

  // Entity ID field
  if (yPos + 10 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Entity ID:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(document.entityId, 80)
  doc.text(lines, 60, yPos)
  yPos += Math.max(lines.length * 4, 6)

  yPos += 5

  // Important Dates Section
  if (yPos + 15 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Important Dates', 20, yPos)
  yPos += 8

  // Issue Date field
  if (yPos + 10 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Issue Date:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(formatDate(document.issueDate), 80)
  doc.text(lines, 60, yPos)
  yPos += Math.max(lines.length * 4, 6)

  // Expiry Date field (if exists)
  if (document.expiryDate) {
    if (yPos + 10 > pageHeight - 40) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Expiry Date:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    lines = doc.splitTextToSize(formatDate(document.expiryDate), 80)
    doc.text(lines, 60, yPos)
    yPos += Math.max(lines.length * 4, 6)
  }

  // Created field
  if (yPos + 10 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Created:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(formatDate(document.createdAt), 80)
  doc.text(lines, 60, yPos)
  yPos += Math.max(lines.length * 4, 6)

  // Last Updated field
  if (yPos + 10 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Last Updated:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(formatDate(document.updatedAt), 80)
  doc.text(lines, 60, yPos)
  yPos += Math.max(lines.length * 4, 6)

  yPos += 5

  // Issuing Authority Section (if exists)
  if (document.issuingAuthority) {
    if (yPos + 15 > pageHeight - 40) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Issuing Authority', 20, yPos)
    yPos += 8

    if (yPos + 10 > pageHeight - 40) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Authority:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    lines = doc.splitTextToSize(document.issuingAuthority, 80)
    doc.text(lines, 60, yPos)
    yPos += Math.max(lines.length * 4, 6)

    yPos += 5
  }

  // Notes Section (if exists)
  if (document.notes) {
    if (yPos + 15 > pageHeight - 40) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Notes', 20, yPos)
    yPos += 8
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    // Split notes into lines to handle long text
    lines = doc.splitTextToSize(document.notes, pageWidth - 2 * 20)
    lines.forEach((line: string) => {
      if (yPos > pageHeight - 40) {
        doc.addPage()
        yPos = 20
      }
      doc.text(line, 20, yPos)
      yPos += 5
    })

    yPos += 5
  }

  // Document Content Section
  if (yPos + 15 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Document Content', 20, yPos)
  yPos += 8
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('This is a sample document generated by the Deliveroo TMS system.', 20, yPos)
  yPos += 6
  doc.text('This document contains all the relevant information as stored in the system.', 20, yPos)

  // Add footer if requested
  if (options.includeFooter !== false) {
    const footerY = pageHeight - 20
    
    // Footer line
    doc.setLineWidth(0.5)
    doc.line(20, footerY - 5, pageWidth - 20, footerY - 5)
    
    // Footer text
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Generated by Deliveroo TMS', 20, footerY)
    doc.text(`Generated on: ${formatDate(new Date())}`, pageWidth - 20 - 50, footerY)
    
    // Page number
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2 - 10, footerY)
    }
  }

  const filename = `${document.name.replace(/[^a-z0-9]/gi, '_').toLowerCase()}_${document.id}.pdf`
  doc.save(filename)
}

// Utility function to generate PDF blob for preview
export async function generateDocumentPDFBlob(document: Document, options: PDFOptions = {}): Promise<Blob> {
  const doc = new jsPDF()
  const pageHeight = doc.internal.pageSize.height
  const pageWidth = doc.internal.pageSize.getWidth()
  
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
    doc.addImage(logoDataUrl, 'PNG', 20, 10, 40, 15)
  }

  // Company info
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('Transport Management System', pageWidth - 20 - 60, 15)
  doc.text('Deliveroo TMS Sp. z o.o.', pageWidth - 20 - 60, 22)
  
  // Header line
  doc.setLineWidth(0.5)
  doc.line(20, 30, pageWidth - 20, 30)
  
  let yPos = 40

  // Add watermark if requested
  if (options.includeWatermark) {
    doc.setFontSize(50)
    doc.setTextColor(200, 200, 200)
    doc.setFont('helvetica', 'bold')
    doc.text('SAMPLE DOCUMENT', pageWidth / 2, pageHeight / 2, {
      angle: 45,
      align: 'center'
    })
    doc.setTextColor(0, 0, 0)
  }

  // Document title
  doc.setFontSize(18)
  doc.setFont('helvetica', 'bold')
  doc.text(getDocumentTypeLabel(document.type), 20, yPos)
  yPos += 15

  // Document Information Section
  if (yPos + 15 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Document Information', 20, yPos)
  yPos += 8

  // Document Name field
  if (yPos + 10 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Document Name:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  let lines = doc.splitTextToSize(document.name, 80)
  doc.text(lines, 60, yPos)
  yPos += Math.max(lines.length * 4, 6)

  // Document Type field
  if (yPos + 10 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Document Type:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(getDocumentTypeLabel(document.type), 80)
  doc.text(lines, 60, yPos)
  yPos += Math.max(lines.length * 4, 6)

  // Document ID field
  if (yPos + 10 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Document ID:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(document.id, 80)
  doc.text(lines, 60, yPos)
  yPos += Math.max(lines.length * 4, 6)

  // Document Number field (if exists)
  if (document.number) {
    if (yPos + 10 > pageHeight - 40) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Document Number:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    lines = doc.splitTextToSize(document.number, 80)
    doc.text(lines, 60, yPos)
    yPos += Math.max(lines.length * 4, 6)
  }

  yPos += 5

  // Related Entity Section
  if (yPos + 15 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Related Entity', 20, yPos)
  yPos += 8

  // Related To field
  if (yPos + 10 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Related To:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(getEntityTypeLabel(document.entityType), 80)
  doc.text(lines, 60, yPos)
  yPos += Math.max(lines.length * 4, 6)

  // Entity Name field
  if (yPos + 10 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Entity Name:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(document.entityName, 80)
  doc.text(lines, 60, yPos)
  yPos += Math.max(lines.length * 4, 6)

  // Entity ID field
  if (yPos + 10 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Entity ID:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(document.entityId, 80)
  doc.text(lines, 60, yPos)
  yPos += Math.max(lines.length * 4, 6)

  yPos += 5

  // Important Dates Section
  if (yPos + 15 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Important Dates', 20, yPos)
  yPos += 8

  // Issue Date field
  if (yPos + 10 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Issue Date:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(formatDate(document.issueDate), 80)
  doc.text(lines, 60, yPos)
  yPos += Math.max(lines.length * 4, 6)

  // Expiry Date field (if exists)
  if (document.expiryDate) {
    if (yPos + 10 > pageHeight - 40) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Expiry Date:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    lines = doc.splitTextToSize(formatDate(document.expiryDate), 80)
    doc.text(lines, 60, yPos)
    yPos += Math.max(lines.length * 4, 6)
  }

  // Created field
  if (yPos + 10 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Created:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(formatDate(document.createdAt), 80)
  doc.text(lines, 60, yPos)
  yPos += Math.max(lines.length * 4, 6)

  // Last Updated field
  if (yPos + 10 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(10)
  doc.setFont('helvetica', 'bold')
  doc.text('Last Updated:', 20, yPos)
  doc.setFont('helvetica', 'normal')
  lines = doc.splitTextToSize(formatDate(document.updatedAt), 80)
  doc.text(lines, 60, yPos)
  yPos += Math.max(lines.length * 4, 6)

  yPos += 5

  // Issuing Authority Section (if exists)
  if (document.issuingAuthority) {
    if (yPos + 15 > pageHeight - 40) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Issuing Authority', 20, yPos)
    yPos += 8

    if (yPos + 10 > pageHeight - 40) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(10)
    doc.setFont('helvetica', 'bold')
    doc.text('Authority:', 20, yPos)
    doc.setFont('helvetica', 'normal')
    lines = doc.splitTextToSize(document.issuingAuthority, 80)
    doc.text(lines, 60, yPos)
    yPos += Math.max(lines.length * 4, 6)

    yPos += 5
  }

  // Notes Section (if exists)
  if (document.notes) {
    if (yPos + 15 > pageHeight - 40) {
      doc.addPage()
      yPos = 20
    }
    doc.setFontSize(12)
    doc.setFont('helvetica', 'bold')
    doc.text('Notes', 20, yPos)
    yPos += 8
    
    doc.setFontSize(10)
    doc.setFont('helvetica', 'normal')
    
    // Split notes into lines to handle long text
    lines = doc.splitTextToSize(document.notes, pageWidth - 2 * 20)
    lines.forEach((line: string) => {
      if (yPos > pageHeight - 40) {
        doc.addPage()
        yPos = 20
      }
      doc.text(line, 20, yPos)
      yPos += 5
    })

    yPos += 5
  }

  // Document Content Section
  if (yPos + 15 > pageHeight - 40) {
    doc.addPage()
    yPos = 20
  }
  doc.setFontSize(12)
  doc.setFont('helvetica', 'bold')
  doc.text('Document Content', 20, yPos)
  yPos += 8
  
  doc.setFontSize(10)
  doc.setFont('helvetica', 'normal')
  doc.text('This is a sample document generated by the Deliveroo TMS system.', 20, yPos)
  yPos += 6
  doc.text('This document contains all the relevant information as stored in the system.', 20, yPos)

  // Add footer if requested
  if (options.includeFooter !== false) {
    const footerY = pageHeight - 20
    
    // Footer line
    doc.setLineWidth(0.5)
    doc.line(20, footerY - 5, pageWidth - 20, footerY - 5)
    
    // Footer text
    doc.setFontSize(8)
    doc.setFont('helvetica', 'normal')
    doc.text('Generated by Deliveroo TMS', 20, footerY)
    doc.text(`Generated on: ${formatDate(new Date())}`, pageWidth - 20 - 50, footerY)
    
    // Page number
    const pageCount = doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      doc.setPage(i)
      doc.text(`Page ${i} of ${pageCount}`, pageWidth / 2 - 10, footerY)
    }
  }

  return doc.output('blob')
}
