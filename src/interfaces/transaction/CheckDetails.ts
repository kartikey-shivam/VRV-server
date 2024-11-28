import { Address } from "./Address";
import { CheckDeliveryStatus } from "./CheckDeliveryStatus";
import { Tag } from "./Tag";

export interface CheckDetails {
    checkNumber?: string;
    checkIdentifier?: string;
    name?: string;
    deliveryStatus?: CheckDeliveryStatus;
    etaTimestamp?: number;
    shippingAddress?: Address;
    /** Additional information that can be added via tags */
    tags?: Tag[];
}