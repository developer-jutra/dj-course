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

import { HealthResponse } from "./data-contracts";

export namespace Health {
  /**
   * @description Returns a JSON object indicating the service is healthy. Used by load balancers and monitoring.
   * @tags Status
   * @name GetHealth
   * @summary Health check
   * @request GET:/health
   * @response `200` `HealthResponse` Service is healthy
   */
  export namespace GetHealth {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = HealthResponse;
  }
}
