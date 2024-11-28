import { EmailId } from "./EmailId";
import { Tag } from "./Tag";

export interface UpiDetails {
    /** UPI Id number */
    upiId: string;
    /** Bank provider name */
    bankProvider?: string;
    /** Interface provider name */
    interfaceProvider?: string;
    /** Name of the account holder */
    name?: string;
    emailId?: EmailId;
    /** Additional information that can be added via tags */
    tags?: Tag[];
}
