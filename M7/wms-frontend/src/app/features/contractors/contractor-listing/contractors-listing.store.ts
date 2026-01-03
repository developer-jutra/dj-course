import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withComputed,
  withMethods,
  patchState,
  withHooks,
} from '@ngrx/signals';
import { rxMethod } from '@ngrx/signals/rxjs-interop';
import { pipe, switchMap, tap } from 'rxjs';
import { ContractorSummary as Contractor, ContractorStatus } from '../../../contract/contract';
import { ContractorsService } from '../contractors.service';
import { tapResponse } from '@ngrx/operators';
import { NotificationService } from '../../../notifications/notification.service';
import { ContractAPIService } from '../../../contract/api/api.service.contract';

export interface ContractorsState {
  contractors: Contractor[];
  isLoading: boolean;
  isAdding: boolean;
  filters: {
    status: string;
    searchTerm: string;
  };
  error: string | null;
}

const initialState: ContractorsState = {
  contractors: [],
  isLoading: false,
  isAdding: false,
  filters: { status: '', searchTerm: '' },
  error: null,
};

export const ContractorsListingStore = signalStore(
  withState(initialState),
  withComputed(({ contractors, filters }) => ({
    filteredContractors: computed(() => {
      const contractorList = contractors();
      const currentFilters = filters();
      return contractorList.filter(c => {
        const statusMatch =
          !currentFilters.status ||
          c.status.toUpperCase() === currentFilters.status.toUpperCase();
        const searchTermMatch =
          !currentFilters.searchTerm ||
          c.name.toLowerCase().includes(currentFilters.searchTerm.toLowerCase());
        return statusMatch && searchTermMatch;
      });
    }),
  })),
  withMethods(
    (
      store,
      contractorsService = inject(ContractorsService),
      contractAPIService = inject(ContractAPIService),
      notificationService = inject(NotificationService)
    ) => ({
      loadContractors: rxMethod<void>(
        pipe(
          tap(() => patchState(store, { isLoading: true })),
          switchMap(() =>
            contractAPIService.getContractors().pipe(
              tapResponse({
                next: (contractors: Contractor[]) =>
                  patchState(store, { contractors, isLoading: false }),
                error: (error: any) =>
                  patchState(store, { error: error.message, isLoading: false }),
              })
            )
          )
        )
      ),
      updateFilters(newFilters: Partial<{ status: string; searchTerm: string }>) {
        patchState(store, state => ({
          filters: { ...state.filters, ...newFilters },
        }));
      },
      toggleContractorStatus: rxMethod<Contractor>(
        pipe(
          switchMap(contractor => {
            const newStatus =
              contractor.status === 'ACTIVE' ? 'INACTIVE' : 'ACTIVE';

            const currentContractors = store.contractors();
            const updatedContractors = currentContractors.map(c =>
              c.id === contractor.id ? { ...c, status: newStatus as ContractorStatus } : c
            );
            patchState(store, { contractors: updatedContractors });

            return contractAPIService
              .patchContractorsId(contractor.id, { status: newStatus })
              .pipe(
                tapResponse({
                  next: () => {
                    notificationService.showSuccess(
                      `Contractor ${contractor.name} status updated to ${newStatus}.`
                    );
                  },
                  error: () => {
                    patchState(store, { contractors: currentContractors });
                    notificationService.showError(
                      'Failed to update contractor status.'
                    );
                  },
                })
              );
          })
        )
      ),
      addContractor: rxMethod<any>(
        pipe(
          tap(() => patchState(store, { isAdding: true })),
          switchMap(contractorData =>
            contractorsService.addContractor(contractorData).pipe(
              tapResponse({
                next: (newContractor: Contractor) => {
                  patchState(store, state => ({
                    contractors: [...state.contractors, newContractor],
                    isAdding: false,
                  }));
                  notificationService.showSuccess(
                    'Contractor added successfully!'
                  );
                },
                error: () => {
                  patchState(store, { isAdding: false });
                  notificationService.showError('Failed to add contractor.');
                },
              })
            )
          )
        )
      ),
    })
  ),
  withHooks({
    onInit({ loadContractors }) {
      loadContractors();
    },
  })
);
