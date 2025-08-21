

/**
 * The types of subscriptions available using {@link subscribe}/{@link unsubscribe}.
 * Each type has a different synchronization messages and objects.
 */
export enum SubscriptionType {
    /**
     * Assets' {@link AssetGeneral|general properties} such as name, icon, and labels.
     * {@link AssetGeneral}
     * {@link PersonGeneral}
     * {@link VehicleGeneral}
     * {@link TrailerGeneral}
     */
    assetGeneral = "assetGeneral",
    /**
     * Assets' {@link AssetAdvanced|advanced properties} such as position, attributes, and status tags.
     * {@link AssetAdvanced}
     * {@link VehicleAdvanced}
     */
    assetAdvanced = "assetAdvanced",
    /**
     * {@link AssetMessage}s between {@link Asset}s and {@link User}s.
     * {@link AssetMessage}
     */
    assetMessage = "assetMessage",
    /**
     * Assets' {@link AssetDispatch|current dispatch} such as  {@link DispatchJob}s and route progress.
     * {@link AssetDispatch}
     */
    assetDispatch = "assetDispatch",

    /**
     * Assets' {@link DispatchTask} information.
     * {@link DispatchTask}
     */
    dispatchTask = "dispatchTask",
    /**
     * Some work that needs to be done by performing one or more {@link DispatchStep}s.
     * {@link DispatchJob}
     */
    dispatchJob = "dispatchJob",

    /**
     * Customized {@link FormTemplate|forms} to be filled.
     * {@link FormTemplate}
     */
    formTemplate = "formTemplate",
    /**
     * {@link FormResult|Forms} that are completed and fully filled out.
     * {@link FormResult}
     */
    formResult = "formResult",

    /**
     * {@link Place} information.
     * {@link PlaceGeneral}
     */
    placeGeneral = "placeGeneral",

    /**
     * Providers' (device) {@link ProviderGeneral|general properties} such as name, notes, and selected {@link Asset}.
     * {@link ProviderGeneral}
     */
    providerGeneral = "providerGeneral",
    /**
     * Raw provider (device) {@link ProviderAdvanced|data} like GPS coordinates and parsed ODB-II values.
     * {@link ProviderAdvanced}
     */
    providerAdvanced = "providerAdvanced",
    /**
     * Provider (device) configurations.
     * {@link ProviderConfiguration}
     * @deprecated Use {@link providerConfig} instead.
     */
    providerConfiguration = "providerConfiguration",
    /**
     * Provider (device) script logic.
     * {@link ProviderScript}
     */
    providerScript = "providerScript",
    /**
     * Provider (device) configurations.
     */
    providerConfig = "providerConfig",
    /**
     * Provider (device) comamnds.
     * {@link ProviderControl}
     */
    providerControl = "providerControl",
    /**
     * Pending Providers (devices) that have not yet been configured or provisioned.
     * {@link ProviderRegistration}
     */
    providerRegistration = "providerRegistration",

    /**
     * Recurring maintenance work for {@link Vehicle}s and {@link Trailer}s.
     * {@link MaintenanceSchedule}
     */
    maintenanceSchedule = "maintenanceSchedule",
    /**
     * Historical {@link Vehicle} and {@link Trailer} maintenance work.
     * {@link MaintenanceJob}
     */
    maintenanceJob = "maintenanceJob",

    /**
     * Behaviour script logic.
     * {@link BehaviourScript}
     */
    behaviourScript = "behaviourScript",
    /**
     * Configured behaviours.
     * {@link Behaviour}
     */
    behaviour = "behaviour",
    /**
     * Behaviour log messages to help developers debug their {@link BehaviourScript}.
     * {@link BehaviourLog}
     */
    behaviourLog = "behaviourLog",

    /**
     * Renaming and changing the nodes of a company.
     * {@link CompanyGeneral}
     */
    companyGeneral = "companyGeneral",
    /**
     * Company's label and tag styles.
     * {@link CompanyStyles}
     */
    companyLabels = "companyLabels",
    /**
     * Company's {@link SessionPolicy} and {@link PasswordPolicy}.
     * {@link CompanyPolicies}
     */
    companyPolicies = "companyPolicies",
    /**
     * A {@link Company}'s white-labelling details.
     * {@link CompanyReseller}
     */
    companyReseller = "companyReseller",

    /**
     * Profiles used to generate {@link BillingReport} for a customer.
     * {@link BillingProfile}
     */
    billingProfile = "billingProfile",
    /**
     * Billing rules for {@link Asset}s.
     * {@link BillableHostingRule}
     */
    billingHosting = "billingHosting",
    /**
     * Discount rules for {@link Asset}s.
     * {@link BillableHostingDiscount}
     */
    billingDiscount = "billingDiscount",
    /**
     * Hardware licenses for {@link Provider}s.
     * {@link BillableHostingLicense}
     */
    billingLicense = "billingLicense",
    /**
     * Reports generated for a billee {@link Company}.
     * {@link BillingReport}
     */
    billingReport = "billingReport",

    /**
     * Contact information used by {@link Asset}s and {@link User}s.
     * {@link Contact}
     */
    contact = "contact",

    /**
     * Synchronizes icon information.
     * {@link Icon}
     */
    icon = "icon",
    /**
     * Synchronizes picture information.
     * {@link Picture}
     */
    picture = "picture",
    /**
     * Hosted document information.
     * {@link Document}
     */
    document = "document",

    /**
     * Report configurations.
     * {@link ReportTemplate}
     */
    reportTemplate = "reportTemplate",
    /**
     * Schedules for reports that run automatically.
     * {@link ReportSchedule}
     */
    reportSchedule = "reportSchedule",
    /**
     * Historical asset details like breadcrumb trails.
     * {@link ReportResult}
     */
    reportResult = "reportResult",

    /**
     * General user information such as name, contact information, and preferences.
     * {@link UserGeneral}
     */
    userGeneral = "userGeneral",
    /**
     * User information such as permissions and group membership.
     * {@link UserAdvanced}
     */
    userAdvanced = "userAdvanced",
    /**
     * Group information for easy access control.
     * {@link UserGroup}
     */
    userGroup = "userGroup",
    /**
     * API Credentials information and permissions.
     * {@link Machine}
     */
    machine = "machine",
}