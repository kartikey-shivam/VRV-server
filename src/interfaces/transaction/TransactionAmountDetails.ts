import { CountryCode } from "./CountryCode";
import { CurrencyCode } from "./CurrencyCode";

export interface TransactionAmountDetails {
    /** Amount of the transaction */
    transactionAmount: number;
    transactionCurrency: CurrencyCode;
    country?: CountryCode;
}
