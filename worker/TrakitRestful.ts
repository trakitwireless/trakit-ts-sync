import { RepSelfGet } from "@commands/Accounts/Self/Responses/RepSelfGet";
import { Payload } from "@commands/API/Requests/Payload";
import { ErrorDetail } from "@commands/API/Responses/Errors/ErrorDetail";
import { Reply } from "@commands/API/Responses/Reply";
import { CLEAR_TIMER, JSON_PARSE, JSON_STRINGIFY, MIN, SET_TIMER } from "@objects/API/Constants";
import { ID } from "@objects/API/Functions";
import { TrakitSocketStatus } from "./TrakitSocketStatus";
import { ErrorCode } from "@commands/API/Responses/Errors/ErrorCode";
import { SelfMachine } from "@commands/Accounts/Self/Responses/Content/SelfMachine";
import { SelfUserGeneral } from "@commands/Accounts/Self/Responses/Content/SelfUserGeneral";
import { SelfUserAdvanced } from "@commands/Accounts/Self/Responses/Content/SelfUserAdvanced";
import { SelfUser } from "@commands/Accounts/Self/Responses/Content/SelfUser";

/**
 * Production RESTful service URL.
 * This service is covered by the SLA and should be used for serices and code running in your own production environment.
 * Both services access the same data-set, so be careful making changes as they will be reflected in production as well.
 */
export const URI_PROD = "https://rest.trakit.ca/";  
/**
 * Testing or beta RESTful service URL.
 * This service is not covered by the SLA and should be used to test your own code before deployment.
 * Throttling of connections and commands is tighter to help you diagnose issues before switching to production.
 * Both services access the same data-set, so be careful making changes as they will be reflected in production as well.
 */
export const URI_BETA = "https://mindflayer.trakit.ca/";  

