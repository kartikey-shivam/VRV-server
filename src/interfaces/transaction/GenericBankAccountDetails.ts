import { Address } from "./Address";
import { Amount } from "./Amount";
import { CountryCode } from "./CountryCode";
import { EmailId } from "./EmailId";
import { Tag } from "./Tag";

export interface GenericBankAccountDetails {
    /** Bank account number */
    accountNumber?: string;
    /** Bank account type. E.g. Checking, Savings etc. */
    accountType?: string;
    accountBalance?: Amount;
    /** Name of the bank */
    bankName?: string;
    /** Unique identifier of the bank. In some countries, this can be the same as the bank's SWIFT code */
    bankCode?: string;
    country?: CountryCode;
    /** Name of the account holder */
    name?: string;
    bankAddress?: Address;
    emailId?: EmailId;
    /** Special instructions to be specified if any */
    specialInstructions?: string;
    paymentChannel?: string;
    /** Additional information that can be added via tags */
    tags?: Tag[];
}
