import mongoose from '~/model/connection'
import { Invoice } from '~/model/Invoice'

export default defineEventHandler(async (event) => {
    const invoices = await Invoice.find({})
    return invoices
    return {
        hello: 'world'
    }
})
