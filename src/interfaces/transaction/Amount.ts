import { CurrencyCode } from "./CurrencyCode";

export interface Amount {
    /** Numerical value of the transaction */
    amountValue: number;
    amountCurrency: CurrencyCode;
}