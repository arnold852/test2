import moment from "moment";
export const initCustomerData = {
    id: null,
    user_id: null,
    credit_limit: 0,
    beginning_balance: 0,
    business_name: "",
    type: "Single Proprietor",
    account_no: "",
    business_address: "",
    mayors_permit_no: "",
    dti_sec_no: "",
    cert_reg_no: "",
    line_of_business: "",
    no_yrs_in_business: "",
    tin: "",
    est_monthly_purchase: "",
    mode_of_payment: "Cash",

    accomplished_by: "",
    designation: "",
    signature: "",
    date: moment().format("YYYY-MM-DD"),
    dn_mayors_business_permit: false,
    dn_dt_sec_reg: false,
    dn_cert_reg: false,
    billing_address: ""
};

export const initCustomerBankChecks = [
    { id: null, customer_id: null, name: "", designation: "" },
    { id: null, customer_id: null, name: "", designation: "" }
];

export const initCustomerBankAccounts = [
    {
        id: null,
        customer_id: null,
        bank_name: "",
        branch: "",
        account_type: ""
    },
    {
        id: null,
        customer_id: null,
        bank_name: "",
        branch: "",
        account_type: ""
    }
];

export const initCustomerEstabInfo = {
    id: null,
    customer_id: null,
    cs_level1: false,
    cs_level2: false,
    cs_level3: false,
    lc_primary: false,
    lc_secondary: false,
    lc_tertiary: false,
    ohc_primary_care: false,
    ohc_custodial_care: false,
    ohc_diagnostic_therapeutic: false,
    ohc_specialized_out_patient: false,
    others_medical_clinic: false,
    others_pharmacy: false,
    others_veterinary: false,
    others_traders: false
};

export const initCustomerMajorSuppliers = [
    {
        id: null,
        customer_id: null,
        company_name: "",
        credit_terms: "",
        contact_person: "",
        contact_no: ""
    },
    {
        id: null,
        customer_id: null,
        company_name: "",
        credit_terms: "",
        contact_person: "",
        contact_no: ""
    },
    {
        id: null,
        customer_id: null,
        company_name: "",
        credit_terms: "",
        contact_person: "",
        contact_no: ""
    }
];

export const initCustomerContactPersons = [
    {
        id: null,
        customer_id: null,
        department: "Accounting",
        name: "",
        designation: "",
        contact_no: "",
        email_address: ""
    },
    {
        id: null,
        customer_id: null,
        department: "Purchasing",
        name: "",
        designation: "",
        contact_no: "",
        email_address: ""
    },
    {
        id: null,
        customer_id: null,
        department: "Warehouse",
        name: "",
        designation: "",
        contact_no: "",
        email_address: ""
    }
];
