import { CountryCode } from "./CountryCode";

export interface CardMerchantDetails {
    id?: string;
    name?: string;
    category?: string;
    mcc?: string;
    city?: string;
    country?: CountryCode;
    state?: string;
    postCode?: string;
}