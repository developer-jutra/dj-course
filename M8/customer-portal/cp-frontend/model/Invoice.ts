import mongoose, { Schema } from 'mongoose'

const invoiceSchema = new Schema({
  number: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  dueDate: { type: Date, required: true }
})

export const Invoice = mongoose.models.Invoice || mongoose.model('Invoice', invoiceSchema)

export default Invoice