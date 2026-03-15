/* eslint-disable */
/* tslint:disable */
// @ts-nocheck
/*
 * ---------------------------------------------------------------
 * ## THIS FILE WAS GENERATED VIA SWAGGER-TYPESCRIPT-API        ##
 * ##                                                           ##
 * ## AUTHOR: acacode                                           ##
 * ## SOURCE: https://github.com/acacode/swagger-typescript-api ##
 * ---------------------------------------------------------------
 */

import {
  CustomerDetail,
  CustomerListResponse,
  CustomerPatchInput,
  CustomerPatchResponse,
} from "./data-contracts";

export namespace Customers {
  /**
   * @description Returns a paginated list of customers. Supports optional full-text search by first or last name.
   * @tags Customers
   * @name GetCustomers
   * @summary List customers
   * @request GET:/customers
   * @response `200` `CustomerListResponse` Paginated list of customers
   * @response `500` `ErrorResponse`
   */
  export namespace GetCustomers {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number (1-based)
       * @min 1
       * @default 1
       * @example 1
       */
      page?: number;
      /**
       * Number of items per page (max 100)
       * @min 1
       * @max 100
       * @default 20
       * @example 20
       */
      limit?: number;
      /**
       * Filter customers by first or last name prefix (case-insensitive)
       * @example "an"
       */
      search?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CustomerListResponse;
  }

  /**
   * @description Returns a single customer with their full details and a summary of associated transportation orders.
   * @tags Customers
   * @name GetCustomerById
   * @summary Get customer by ID
   * @request GET:/customers/{id}
   * @response `200` `CustomerDetail` Customer found
   * @response `404` `ErrorResponse` No customer exists with the given ID.
   * @response `500` `ErrorResponse`
   */
  export namespace GetCustomerById {
    export type RequestParams = {
      /**
       * Numeric resource identifier
       * @example 1
       */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CustomerDetail;
  }

  /**
   * @description Partially updates a customer's first and/or last name. Uses optimistic locking – the request must include the current `version` value. If the resource was modified by another request since it was last read, a 409 conflict is returned.
   * @tags Customers
   * @name PatchCustomer
   * @summary Update customer name
   * @request PATCH:/customers/{id}
   * @response `200` `CustomerPatchResponse` Customer updated successfully
   * @response `400` `ErrorResponse` Request payload is missing required fields or contains invalid values (e.g. missing version, no name field provided).
   * @response `404` `ErrorResponse` No customer exists with the given ID.
   * @response `409` `ErrorResponse` Version conflict – the customer was modified by another request. Fetch the latest version and retry.
   * @response `500` `ErrorResponse`
   */
  export namespace PatchCustomer {
    export type RequestParams = {
      /**
       * Numeric resource identifier
       * @example 1
       */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = CustomerPatchInput;
    export type RequestHeaders = {};
    export type ResponseBody = CustomerPatchResponse;
  }

  /**
   * @description Permanently deletes a customer by their ID.
   * @tags Customers
   * @name DeleteCustomer
   * @summary Delete a customer
   * @request DELETE:/customers/{id}
   * @response `204` `void` Customer deleted successfully – no body returned.
   * @response `404` `ErrorResponse` No customer exists with the given ID.
   * @response `500` `ErrorResponse`
   */
  export namespace DeleteCustomer {
    export type RequestParams = {
      /**
       * Numeric resource identifier
       * @example 1
       */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}
