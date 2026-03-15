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

import { AssignDriverInput, TransportationOrder } from "./data-contracts";

export namespace TransportationOrders {
  /**
   * @description Returns a list of transportation orders, optionally filtered by customer ID. Results are ordered by order_date descending, limited to 100 items.
   * @tags TransportationOrders
   * @name GetTransportationOrders
   * @summary List transportation orders
   * @request GET:/transportation-orders
   * @response `200` `(TransportationOrder)[]` List of transportation orders
   * @response `500` `ErrorResponse`
   */
  export namespace GetTransportationOrders {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Filter orders by customer ID. When omitted, returns all orders.
       * @example "1"
       */
      customer_id?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = TransportationOrder[];
  }

  /**
   * @description Assigns an existing driver to the specified transportation order. Replaces any previously assigned driver. The operation is idempotent.
   * @tags TransportationOrders
   * @name AssignDriverToOrder
   * @summary Assign a driver to a transportation order
   * @request PUT:/transportation-orders/{id}/driver
   * @response `200` `void` Driver assigned successfully.
   * @response `400` `ErrorResponse` Request payload has an invalid structure or contains missing/invalid fields.
   * @response `404` `ErrorResponse` Transportation order or driver with the given ID does not exist.
   * @response `500` `ErrorResponse`
   */
  export namespace AssignDriverToOrder {
    export type RequestParams = {
      /**
       * Numeric resource identifier
       * @example 1
       */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = AssignDriverInput;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}
