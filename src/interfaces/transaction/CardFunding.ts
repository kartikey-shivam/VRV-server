export type CardFunding = "CREDIT" | "DEBIT" | "PREPAID";

export const CardFunding = {
    Credit: "CREDIT",
    Debit: "DEBIT",
    Prepaid: "PREPAID",
} as const;