import { Amount } from "./Amount";
import { EmailId } from "./EmailId";
import { Tag } from "./Tag";
import { WalletNetwork } from "./WalletNetwork";

export interface WalletDetails {
    /** Wallet type if there are various types of wallets belonging to the same user. E.g. Checking, savings, vault, different currency wallets etc. */
    walletType?: string;
    /** Unique ID of the wallet */
    walletId?: string;
    /** Payment Channel used through wallet */
    paymentChannel?: string;
    /** Name of the account holder for a specific wallet */
    name?: string;
    emailId?: EmailId;
    /** Additional information that can be added via tags */
    tags?: Tag[];
    /** Phone number associated with the wallet, if any */
    walletPhoneNumber?: string;
    walletBalance?: Amount;
    network?: WalletNetwork;
}