import { defineStore } from 'pinia'
import type { ShipmentFilters as ShipmentFiltersType } from './shipment-filters'

// Pinia store for managing shipment listing filters
export const useShipmentsListingStore = defineStore('shipmentsListing', {
  state: () => ({
    filters: {
      status: '',
      serviceType: '',
      dateFrom: ''
    } as ShipmentFiltersType
  }),
  actions: {
    setFilters(newFilters: ShipmentFiltersType) {
      this.filters = newFilters
    },
    clearFilters() {
      this.filters = {
        status: '',
        serviceType: '',
        dateFrom: ''
      }
    }
  }
})
