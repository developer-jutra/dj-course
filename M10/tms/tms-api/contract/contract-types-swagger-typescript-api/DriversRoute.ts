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
  DriverCreateInput,
  DriverDetail,
  DriverListItem,
} from "./data-contracts";

export namespace Drivers {
  /**
   * @description Returns a list of all drivers (up to 100). No pagination.
   * @tags Drivers
   * @name GetDrivers
   * @summary List drivers
   * @request GET:/drivers
   * @response `200` `(DriverListItem)[]` List of drivers
   * @response `500` `ErrorResponse`
   */
  export namespace GetDrivers {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = DriverListItem[];
  }

  /**
   * @description Creates a new driver record. All fields are optional.
   * @tags Drivers
   * @name CreateDriver
   * @summary Create a driver
   * @request POST:/drivers
   * @response `201` `DriverListItem` Driver created successfully
   * @response `400` `ErrorResponse` Request payload has an invalid structure or contains missing/invalid fields.
   * @response `500` `ErrorResponse`
   */
  export namespace CreateDriver {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = DriverCreateInput;
    export type RequestHeaders = {};
    export type ResponseBody = DriverListItem;
  }

  /**
   * @description Returns a single driver with their associated driver licenses.
   * @tags Drivers
   * @name GetDriverById
   * @summary Get driver by ID
   * @request GET:/drivers/{id}
   * @response `200` `DriverDetail` Driver found
   * @response `400` `ErrorResponse` The provided ID is not a valid positive integer.
   * @response `404` `ErrorResponse` No driver exists with the given ID.
   * @response `500` `ErrorResponse`
   */
  export namespace GetDriverById {
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
    export type ResponseBody = DriverDetail;
  }
}
