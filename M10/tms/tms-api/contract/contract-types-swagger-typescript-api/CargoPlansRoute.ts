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
  AddCargoInput,
  CargoLoadPlanReadModel,
  ChangeTrailerInput,
  CreateLoadPlanInput,
  CreateLoadPlanResponse,
  WeightUnit,
} from "./data-contracts";

export namespace CargoPlans {
  /**
   * @description Creates a new cargo load plan for a given trailer type.
   * @tags CargoPlans
   * @name CreateLoadPlan
   * @summary Create a load plan
   * @request POST:/cargo-plans
   * @response `201` `CreateLoadPlanResponse` Load plan created successfully
   * @response `400` `ErrorResponse` Missing or invalid trailerType.
   * @response `500` `ErrorResponse`
   */
  export namespace CreateLoadPlan {
    export type RequestParams = {};
    export type RequestQuery = {};
    export type RequestBody = CreateLoadPlanInput;
    export type RequestHeaders = {};
    export type ResponseBody = CreateLoadPlanResponse;
  }

  /**
   * @description Returns the full state of a load plan including assigned cargo units.
   * @tags CargoPlans
   * @name GetLoadPlan
   * @summary Get load plan details
   * @request GET:/cargo-plans/{id}
   * @response `200` `CargoLoadPlanReadModel` Load plan found
   * @response `404` `ErrorResponse` No load plan exists with the given ID.
   * @response `500` `ErrorResponse`
   */
  export namespace GetLoadPlan {
    export type RequestParams = {
      /**
       * UUID of the load plan
       * @format uuid
       * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
       */
      id: string;
    };
    export type RequestQuery = {
      /** Unit in which weight values are expressed in the response. Defaults to KG. */
      weightUnit?: WeightUnit;
    };
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = CargoLoadPlanReadModel;
  }

  /**
   * @description Adds a pallet unit with cargo to an existing draft load plan.
   * @tags CargoPlans
   * @name AddCargoToLoadPlan
   * @summary Add cargo to a load plan
   * @request POST:/cargo-plans/{id}/cargo
   * @response `204` `void` Cargo added successfully – no body returned.
   * @response `400` `ErrorResponse` Invalid request payload or business rule violation (e.g. weight/LDM exceeded, incompatible cargo).
   * @response `404` `ErrorResponse` No load plan exists with the given ID.
   * @response `500` `ErrorResponse`
   */
  export namespace AddCargoToLoadPlan {
    export type RequestParams = {
      /**
       * UUID of the load plan
       * @format uuid
       * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = AddCargoInput;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Removes a specific pallet unit from a draft load plan by its unit ID.
   * @tags CargoPlans
   * @name RemoveCargoFromLoadPlan
   * @summary Remove cargo from a load plan
   * @request DELETE:/cargo-plans/{id}/cargo/{unitId}
   * @response `204` `void` Cargo removed successfully – no body returned.
   * @response `400` `ErrorResponse` Unit not found in the plan or plan is finalized.
   * @response `404` `ErrorResponse` No load plan exists with the given ID.
   * @response `500` `ErrorResponse`
   */
  export namespace RemoveCargoFromLoadPlan {
    export type RequestParams = {
      /**
       * UUID of the load plan
       * @format uuid
       * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
       */
      id: string;
      /**
       * UUID of the pallet unit to remove
       * @format uuid
       * @example "b2c3d4e5-f6a7-8901-bcde-f12345678901"
       */
      unitId: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Replaces the trailer on a draft load plan. All currently assigned cargo units are re-validated against the new trailer's capabilities and capacity.
   * @tags CargoPlans
   * @name ChangeTrailerType
   * @summary Change trailer type
   * @request PUT:/cargo-plans/{id}/trailer
   * @response `204` `void` Trailer type changed successfully – no body returned.
   * @response `400` `ErrorResponse` Invalid trailerType or re-validation of existing cargo failed.
   * @response `404` `ErrorResponse` No load plan exists with the given ID.
   * @response `500` `ErrorResponse`
   */
  export namespace ChangeTrailerType {
    export type RequestParams = {
      /**
       * UUID of the load plan
       * @format uuid
       * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = ChangeTrailerInput;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }

  /**
   * @description Marks the load plan as FINALIZED. A finalized plan cannot be modified. The plan must have at least one cargo unit and must not exceed trailer capacity.
   * @tags CargoPlans
   * @name FinalizeLoadPlan
   * @summary Finalize a load plan
   * @request POST:/cargo-plans/{id}/finalize
   * @response `204` `void` Load plan finalized successfully – no body returned.
   * @response `400` `ErrorResponse` Plan cannot be finalized (empty plan or capacity exceeded).
   * @response `404` `ErrorResponse` No load plan exists with the given ID.
   * @response `500` `ErrorResponse`
   */
  export namespace FinalizeLoadPlan {
    export type RequestParams = {
      /**
       * UUID of the load plan
       * @format uuid
       * @example "a1b2c3d4-e5f6-7890-abcd-ef1234567890"
       */
      id: string;
    };
    export type RequestQuery = {};
    export type RequestBody = never;
    export type RequestHeaders = {};
    export type ResponseBody = void;
  }
}
