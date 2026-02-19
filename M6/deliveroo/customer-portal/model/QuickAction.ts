import { Schema, model } from 'mongoose'

const quickActionSchema = new Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  iconName: { type: String, required: true },
  href: { type: String, required: true }
})

export const QuickAction = model('QuickAction', quickActionSchema, 'quick_actions')
export default QuickAction
