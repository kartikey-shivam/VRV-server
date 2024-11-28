import { Address } from "./Address";
import { Amount } from "./Amount";
import { EmailId } from "./EmailId";
import { Tag } from "./Tag";

export interface AchDetails {
    /** Routing number of the bank */
    routingNumber?: string;
    /** Bank account number of the individual */
    accountNumber?: string;
    accountBalance?: Amount;
    /** Name of the bank */
    bankName?: string;
    /** Name of the account holder */
    name?: string;
    bankAddress?: Address;
    /** Beneficiary name of the account */
    beneficiaryName?: string;
    emailId?: EmailId;
    /** Additional information that can be added via tags */
    tags?: Tag[];
}
