/* eslint-disable */
/**
 * Generated `api` utility.
 *
 * THIS CODE IS AUTOMATICALLY GENERATED.
 *
 * To regenerate, run `npx convex dev`.
 * @module
 */

import type {
  ApiFromModules,
  FilterApi,
  FunctionReference,
} from "convex/server";
import type * as actions_agent from "../actions/agent.js";
import type * as actions_analyze from "../actions/analyze.js";
import type * as actions_generate from "../actions/generate.js";
import type * as actions_initConfig from "../actions/initConfig.js";
import type * as auth from "../auth.js";
import type * as http from "../http.js";
import type * as mutations_config from "../mutations/config.js";
import type * as mutations_documents from "../mutations/documents.js";
import type * as mutations_generations from "../mutations/generations.js";
import type * as mutations_queries from "../mutations/queries.js";
import type * as queries_config from "../queries/config.js";
import type * as queries_documents from "../queries/documents.js";
import type * as queries_generations from "../queries/generations.js";
import type * as router from "../router.js";

/**
 * A utility for referencing Convex functions in your app's API.
 *
 * Usage:
 * ```js
 * const myFunctionReference = api.myModule.myFunction;
 * ```
 */
declare const fullApi: ApiFromModules<{
  "actions/agent": typeof actions_agent;
  "actions/analyze": typeof actions_analyze;
  "actions/generate": typeof actions_generate;
  "actions/initConfig": typeof actions_initConfig;
  auth: typeof auth;
  http: typeof http;
  "mutations/config": typeof mutations_config;
  "mutations/documents": typeof mutations_documents;
  "mutations/generations": typeof mutations_generations;
  "mutations/queries": typeof mutations_queries;
  "queries/config": typeof queries_config;
  "queries/documents": typeof queries_documents;
  "queries/generations": typeof queries_generations;
  router: typeof router;
}>;
export declare const api: FilterApi<
  typeof fullApi,
  FunctionReference<any, "public">
>;
export declare const internal: FilterApi<
  typeof fullApi,
  FunctionReference<any, "internal">
>;
