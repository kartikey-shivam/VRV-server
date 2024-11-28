import { Address } from "./Address";
import { Amount } from "./Amount";
import { EmailId } from "./EmailId";
import { Tag } from "./Tag";

export interface SwiftDetails {
    /** SWIFT code of the financial institution */
    swiftCode?: string;
    /** Account number */
    accountNumber?: string;
    accountBalance?: Amount;
    /** Account type. E.g. Checking, Savings etc. */
    accountType?: string;
    /** Name of the bank */
    bankName?: string;
    /** Name of the account holder */
    name?: string;
    bankAddress?: Address;
    emailId?: EmailId;
    /** Special instructions if any */
    specialInstructions?: string;
    /** Additional information that can be added via tags */
    tags?: Tag[];
}