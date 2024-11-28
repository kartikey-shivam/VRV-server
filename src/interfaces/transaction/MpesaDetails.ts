import { EmailId } from "./EmailId";
import { MpesaTransactionType } from "./MpesaTransactionType";
import { Tag } from "./Tag";

/**
 * Model for Mpesa payment method
 */
export interface MpesaDetails {
    /** Business code */
    businessShortCode: string;
    transactionType: MpesaTransactionType;
    /** Contact Number of the account holder */
    phoneNumber: string;
    emailId?: EmailId;
    /** Additional information that can be added via tags */
    tags?: Tag[];
}
