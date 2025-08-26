import { SubscriptionType } from "./SubscriptionType";

/**
 * Names of objects that span multiple regions (in serialized order).
 * Object<ComplexTypeNameLowerCase, SubscriptionType[]>
 */
export const SUBSCRIPTION_SPLITS: any = {
    "company": [
        SubscriptionType.companyGeneral,
        //SubscriptionType.companySettings,
        //SubscriptionType.companyDirectory,
        SubscriptionType.companyLabels,
        SubscriptionType.companyPolicies,
    ],
    "user": [
        SubscriptionType.userGeneral,
        SubscriptionType.userAdvanced,
    ],
    "asset": [
        SubscriptionType.assetGeneral,
        SubscriptionType.assetAdvanced,
        SubscriptionType.assetDispatch,
    ],
    "place": [
        SubscriptionType.placeGeneral,
        //SubscriptionType.placeExtended,
    ],
    "provider": [
        SubscriptionType.providerGeneral,
        SubscriptionType.providerAdvanced,
        SubscriptionType.providerControl,
    ],
};

/**
 * A mapping of RESTful service routes to get things listed by company.
 **/
export const SUBSCRIPTION_LIST_BY_COMPANY: any = {
    /* company */
    //"companyGeneral": "/companies/{companyId}/tree?includeParent=true",
    //"companyBilling": "",
    //"companyDirectory": "",
    //"companyLabels": "",
    //"companyPolicies": "",
    //"companyReseller": "",
    "contact": "/companies/{companyId}/contacts",
    /* users/accounts */
    "user": "/companies/{companyId}/users",
    "userGeneral": "/companies/{companyId}/users/generals",
    "userAdvanced": "/companies/{companyId}/users/advanceds",
    "userGroup": "/companies/{companyId}/users/groups",
    "machine": "/companies/{companyId}/machines",
    /* file hosting */
    "icon": "/companies/{companyId}/icons",
    "picture": "/companies/{companyId}/pictures",
    "document": "/companies/{companyId}/documents",
    "formTemplate": "/companies/{companyId}/forms/templates",
    "formResult": "/companies/{companyId}/forms",
    /* assets */
    "assetGeneral": "/companies/{companyId}/assets",    //assets/generals
    "assetAdvanced": "/companies/{companyId}/assets",   //assets/advanceds
    "assetDispatch": "/companies/{companyId}/assets",   //assets/dispatches
    "assetMessage": "/companies/{companyId}/assets/messages",
    //	"assetAlert",
    /* dispatch */
    "dispatchTask": "/companies/{companyId}/assets/dispatch/tasks",
    "dispatchTemplate": "/companies/{companyId}/assets/dispatch/templates",
    "dispatchJob": "/companies/{companyId}/assets/dispatch/jobs",
    /* maintenance */
    "maintenanceSchedule": "/companies/{companyId}/maintenance/schedules",
    "maintenanceJob": "/companies/{companyId}/maintenance/jobs",
    /* places */
    "placeGeneral": "/companies/{companyId}/places",
    //"placeExtended": "/companies/{companyId}/places",
    /* behaviours */
    "behaviourScript": "/companies/{companyId}/behaviours/scripts",
    "behaviour": "/companies/{companyId}/behaviours",
    //"behaviourLog": "",
    /* providers and configs */
    "providerGeneral": "/companies/{companyId}/providers",  //providers/generals
    "providerAdvanced": "/companies/{companyId}/providers", //providers/advanceds
    "providerControl": "/companies/{companyId}/providers",  //providers/controls
    "providerConfiguration": "/companies/{companyId}/providers/configurations", 
    "providerScript": "/companies/{companyId}/providers/scripts", 
    "providerConfig": "/companies/{companyId}/providers/configs", 
    "providerRegistration": "/companies/{companyId}/providers/registrations",
    /* reports */
    "reportTemplate": "/companies/{companyId}/reports/templates",
    "reportSchedule": "/companies/{companyId}/reports/schedules",
    "reportResult": "/companies/{companyId}/reports/results",
    /* billing */
    "billingProfile": "/companies/{companyId}/billing/profiles",
    //"billingHosting": "",
    //"billingDiscount": "",
    //"billingLicense": "",
    "billingReport": "/companies/{companyId}/billing/profiles/reports",
    //	"billingMapCast",
    //	"billingRatePlan",
    //	"billingReseller",
    //	"billingSupport",
};

/**
 * A mapping of Trak-iT RESTful routes to get things listed by asset.
 **/
export const SUBSCRIPTION_LIST_BY_ASSET: any = {
    /* messaging */
    "assetMessage": "/assets/{assetId}/messages",
    /* dispatch */
    "dispatchTask": "/assets/{assetId}/dispatch/tasks",
    "dispatchTemplate": "/assets/{assetId}/dispatch/templates",
    "dispatchJob": "/assets/{assetId}/dispatch/jobs",
    /* file hosting */
    "formResult": "/assets/{assetId}/forms",
    /* maintenance */
    "maintenanceJob": "/assets/{assetId}/maintenance/jobs",
    /* ELD (deprecated) */
    "hosInspection": "/assets/{assetId}/hos/inspections",
    "hosEvent": "/assets/{assetId}/hos/events",
};

/**
 * A mapping of Trak-iT RESTful routes to get things listed by billing profile.
 **/
export const SUBSCRIPTION_LIST_BY_BILLING_PROFILE: any = {
    "billingHosting": "/billing/profiles/{profileId}/rules",
    "billingDiscount": "/billing/profiles/{profileId}/discounts",
    "billingLicense": "/billing/profiles/{profileId}/licenses",
    "billingReport": "/billing/profiles/{profileId}/reports",
};

/**
 * A mapping of Trak-iT RESTful routes to get things listed by behaviour script.
 **/
export const SUBSCRIPTION_LIST_BY_BEHAVIOUR_SCRIPT: any = {
    "behaviourLog": "/companies/{companyId}/behaviours/scripts/{scriptId}/logs",
    "behaviour": "/companies/{companyId}/behaviours/scripts/{scriptId}/behaviours",
};
