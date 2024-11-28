import { Address } from "./Address";
import { Amount } from "./Amount";
import { CountryCode } from "./CountryCode";
import { EmailId } from "./EmailId";
import { Tag } from "./Tag";

export interface IbanDetails {
    /** Identifier for the bank. Can be routing number, BIK number, SWIFT code, BIC number etc. */
    bic?: string;
    /** Name of the bank */
    bankName?: string;
    bankAddress?: Address;
    country?: CountryCode;
    /** Account number of the user. Can be account number, IBAN number etc. */
    iban?: string;
    accountBalance?: Amount;
    /** Name of the bank account holder */
    name?: string;
    emailId?: EmailId;
    /** Branch code of the bank. In some countries, this can be the same as the bank's SWIFT code */
    bankBranchCode?: string;
    paymentChannel?: string;
    /** Additional information that can be added via tags */
    tags?: Tag[];
}