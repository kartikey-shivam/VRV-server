import { Amount } from "./Amount";
import { CardBrand } from "./CardBrand";
import { CardExpiry } from "./CardExpiry";
import { CardFunding } from "./CardFunding";
import { CardMerchantDetails } from "./CardMerchantDetails";
import { CardStatus } from "./CardStatus";
import { CardType } from "./CardType";
import { ConsumerName } from "./ConsumerName";
import { CountryCode } from "./CountryCode";
import { PosDetails } from "./PosDetails";
import { Tag } from "./Tag";

export interface CardDetails {
    /** Unique card fingerprint that helps identify a specific card without having to use explicit card number. This is likely available at your card payment scheme provider */
    cardFingerprint?: string;
    emailId?: string;
    cardStatus?: CardStatus;
    cardIssuedCountry?: CountryCode;
    /** Reference for the transaction */
    transactionReferenceField?: string;
    /** Whether 3ds was successfully enforced for the transaction */
    "3DsDone"?: boolean;
    nameOnCard?: ConsumerName;
    cardExpiry?: CardExpiry;
    posDetails?: PosDetails;
    /** Last 4 digits of Card */
    cardLast4Digits?: string;
    cardBrand?: CardBrand;
    cardFunding?: CardFunding;
    /** Authentication of Card */
    cardAuthenticated?: boolean;
    /** Was the card tokenized */
    cardTokenized?: boolean;
    /** Card Present */
    cardPresent?: boolean;
    paymentChannel?: string;
    cardType?: CardType;
    cardBalance?: Amount;
    merchantDetails?: CardMerchantDetails;
    /** Risk score of the card from your network provider */
    networkProviderRiskScore?: number;
    /** Additional information that can be added via tags */
    tags?: Tag[];
}