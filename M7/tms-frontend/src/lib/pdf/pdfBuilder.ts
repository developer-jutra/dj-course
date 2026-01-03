import jsPDF from 'jspdf'
const DELIVEROO_LOGO_PATH = '/deliveroo-pdf-logo.png'

export interface HeaderOptions {
  logoUrl?: string
  title: string
  companyName?: string
  companyInfo?: string[]
}

export class PDFBuilder {
  private doc: jsPDF
  private yPos = 20

  constructor () {
    this.doc = new jsPDF()
  }

  private async pathToDataURL (path: string): Promise<string | null> {
    try {
      const response = await fetch(path)
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

  async addHeader (opts: HeaderOptions): Promise<PDFBuilder> {
    const { title, companyName = 'Deliveroo Logistics', companyInfo = [] } = opts

    // Use local logo image converted to data URL
    const dataUrl = await this.pathToDataURL(DELIVEROO_LOGO_PATH)
    if (dataUrl) {
      this.doc.addImage(dataUrl, 'PNG', 15, 15, 15, 15)
    }

    // Title
    this.doc.setFontSize(16)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(title, 20, 35)

    // Company name & info
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'normal')
    this.doc.text(companyName, 20, 42)
    companyInfo.forEach((line, idx) => this.doc.text(line, 20, 48 + idx * 6))

    this.yPos = 55
    return this
  }

  private ensureSpace (spaceNeeded: number = 20): void {
    const pageHeight = this.doc.internal.pageSize.height
    if (this.yPos + spaceNeeded > pageHeight - 30) {
      this.doc.addPage()
      this.yPos = 20
    }
  }

  addSection (title: string): PDFBuilder {
    this.ensureSpace(15)
    this.doc.setFontSize(14)
    this.doc.setFont('helvetica', 'bold')
    this.doc.setFillColor(248, 250, 252)
    this.doc.rect(20, this.yPos, 170, 8, 'F')
    this.doc.text(title, 22, this.yPos + 5.5)
    this.yPos += 15
    return this
  }

  addField (label: string, value: string, options: { width?: number } = {}): PDFBuilder {
    this.ensureSpace(10)
    const { width = 80 } = options
    this.doc.setFontSize(10)
    this.doc.setFont('helvetica', 'bold')
    this.doc.text(label + ':', 20, this.yPos)
    this.doc.setFont('helvetica', 'normal')
    const lines = this.doc.splitTextToSize(value, width)
    this.doc.text(lines, 20, this.yPos + 4)
    this.yPos += lines.length * 4 + 6
    return this
  }

  addFooter (lines: string[] = [
    'Deliveroo Logistics | ul. Logistyczna 123, 00-001 Warsaw, Poland',
    'Phone: +48 123 456 789 | Email: contact@deliveroo.pl'
  ]): PDFBuilder {
    const pageHeight = this.doc.internal.pageSize.height
    this.doc.setDrawColor(200, 200, 200)
    this.doc.line(20, pageHeight - 25, 190, pageHeight - 25)
    this.doc.setFontSize(8)
    this.doc.setTextColor(100, 100, 100)

    lines.forEach((line, idx) => this.doc.text(line, 20, pageHeight - 18 + idx * 6))

    const pageCount = this.doc.getNumberOfPages()
    for (let i = 1; i <= pageCount; i++) {
      this.doc.setPage(i)
      this.doc.text(`Page ${i} of ${pageCount}`, 170, pageHeight - 12)
    }

    return this
  }

  save (fileName: string): void {
    this.addFooter()
    this.doc.save(fileName)
  }
} 