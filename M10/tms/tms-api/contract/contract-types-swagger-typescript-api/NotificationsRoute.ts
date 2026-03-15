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

import { NotificationListResponse } from "./data-contracts";

export namespace Notifications {
  /**
   * @description Returns a paginated list of notifications for the given user. Results are ordered by created_at descending.
   * @tags Notifications
   * @name GetNotificationsByUserId
   * @summary List notifications by user
   * @request GET:/notifications
   * @response `200` `NotificationListResponse` Paginated list of notifications
   * @response `400` `ErrorResponse` The userId query parameter is missing or invalid (must be a positive integer).
   * @response `500` `ErrorResponse`
   */
  export namespace GetNotificationsByUserId {
    export type RequestParams = {};
    export type RequestQuery = {
      /**
       * User ID to fetch notifications for. Required.
       * @min 1
       * @example 1
       */
      userId: number;
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
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = NotificationListResponse;
  }
}
