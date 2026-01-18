import mongoose, { Schema, model } from 'mongoose'

const invoiceSchema = new Schema({
  number: { type: String, required: true },
  description: { type: String, required: true },
  date: { type: Date, required: true },
  amount: { type: Number, required: true },
  status: { type: String, required: true },
  dueDate: { type: Date, required: true }
})

export const Invoice = model('Invoice', invoiceSchema)


export default Invoice



// main().catch(err => console.log(err));

// async function main() {
//   await mongoose.connect('mongodb://127.0.0.1:27017/test');
// }