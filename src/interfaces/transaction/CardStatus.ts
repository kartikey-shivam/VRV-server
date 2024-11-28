export type CardStatus = "ACTIVE" | "FROZEN" | "BLOCKED" | "SUSPECTED_FRAUD" | "STOLEN" | "LOST" | "CLOSED" | "OTHER";

export const CardStatus = {
    Active: "ACTIVE",
    Frozen: "FROZEN",
    Blocked: "BLOCKED",
    SuspectedFraud: "SUSPECTED_FRAUD",
    Stolen: "STOLEN",
    Lost: "LOST",
    Closed: "CLOSED",
    Other: "OTHER",
} as const;