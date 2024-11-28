import { AchDetails } from "./AchDetails";
import { CardDetails } from "./CardDetails";
import { CashDetails } from "./CashDetails";
import { CheckDetails } from "./CheckDetails";
import { GenericBankAccountDetails } from "./GenericBankAccountDetails";
import { IbanDetails } from "./IbanDetails";
import { MpesaDetails } from "./MpesaDetails";
import { SwiftDetails } from "./SwiftDetails";
import { UpiDetails } from "./UpiDetails";
import { WalletDetails } from "./WalletDetails";

export type TransactionDestinationPaymentDetails =
    | TransactionDestinationPaymentDetails.Cash;

export declare namespace TransactionDestinationPaymentDetails {
    interface Card extends CardDetails {
        method: "CARD";
    }

    interface GenericBankAccount extends GenericBankAccountDetails {
        method: "GENERIC_BANK_ACCOUNT";
    }

    interface Iban extends IbanDetails {
        method: "IBAN";
    }

    interface Ach extends AchDetails {
        method: "ACH";
    }

    interface Upi extends UpiDetails {
        method: "UPI";
    }

    interface Wallet extends WalletDetails {
        method: "WALLET";
    }

    interface Swift extends SwiftDetails {
        method: "SWIFT";
    }

    interface Mpesa extends MpesaDetails {
        method: "MPESA";
    }

    interface Check extends CheckDetails {
        method: "CHECK";
    }

    interface Cash extends CashDetails {
        method: "CASH";
    }
}