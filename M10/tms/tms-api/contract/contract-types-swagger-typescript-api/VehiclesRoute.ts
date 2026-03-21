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
  Vehicle,
  VehicleCreateInput,
  VehicleListResponse,
  VehicleUpdateInput,
} from "./data-contracts";

export namespace Vehicles {
  /**
   * @description Returns a paginated list of all vehicles.
   * @tags Vehicles
   * @name GetVehicles
   * @summary List vehicles
   * @request GET:/vehicles
   * @response `200` `VehicleListResponse` Paginated list of vehicles
   * @response `400` `ErrorResponse`
   * @response `500` `ErrorResponse`
   */
  export namespace GetVehicles {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * Page number (1-based)
       * @default "1"
       * @example "1"
       */
      page?: string;
      /**
       * Number of items per page (max 100)
       * @default "20"
       * @example "20"
       */
      limit?: string;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = VehicleListResponse;
  }

  /**
   * @description Creates a new vehicle record.
   * @tags Vehicles
   * @name CreateVehicle
   * @summary Create a vehicle
   * @request POST:/vehicles
   * @response `201` `Vehicle` Vehicle created successfully
   * @response `400` `ErrorResponse` Request payload has an invalid structure or contains missing/invalid fields.
   * @response `500` `ErrorResponse`
   */
  export namespace CreateVehicle {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = VehicleCreateInput;
    export type RequestHeaders = {};
    export type ResponseBody = Vehicle;
  }

  /**
   * @description Returns a single vehicle by its numeric ID.
   * @tags Vehicles
   * @name GetVehicleById
   * @summary Get vehicle by ID
   * @request GET:/vehicles/{id}
   * @response `200` `Vehicle` Vehicle found
   * @response `400` `ErrorResponse` The provided ID is missing or has an invalid format.
   * @response `404` `ErrorResponse` No vehicle exists with the given ID.
   * @response `500` `ErrorResponse`
   */
  export namespace GetVehicleById {
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
    export type ResponseBody = Vehicle;
  }

  /**
   * @description Replaces vehicle data. All fields are optional – only provided fields are updated.
   * @tags Vehicles
   * @name UpdateVehicle
   * @summary Update a vehicle
   * @request PUT:/vehicles/{id}
   * @response `200` `Vehicle` Vehicle updated successfully
   * @response `400` `ErrorResponse` Request payload has an invalid structure or contains missing/invalid fields.
   * @response `404` `ErrorResponse` No vehicle exists with the given ID, or the update produced no result.
   * @response `500` `ErrorResponse`
   */
  export namespace UpdateVehicle {
    export type RequestParams = {
      /**
       * Numeric resource identifier
       * @example 1
       */
      id: number;
    };
    export type RequestQuery = {};
    export type RequestBody = VehicleUpdateInput;
    export type RequestHeaders = {};
    export type ResponseBody = Vehicle;
  }

  /**
   * @description Permanently deletes a vehicle by its ID.
   * @tags Vehicles
   * @name DeleteVehicle
   * @summary Delete a vehicle
   * @request DELETE:/vehicles/{id}
   * @response `204` `void` Vehicle deleted successfully – no body returned.
   * @response `400` `ErrorResponse` The provided ID is not a valid positive integer.
   * @response `404` `ErrorResponse` No vehicle exists with the given ID.
   * @response `500` `ErrorResponse`
   */
  export namespace DeleteVehicle {
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
