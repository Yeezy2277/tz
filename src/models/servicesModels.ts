interface MinimalAmountProps {
    fromCurrency: string;
    toCurrency: string;
}
interface EstimatedAmountProps {
    amount: number
    fromCurrency: string;
    toCurrency: string;
}

export type {MinimalAmountProps, EstimatedAmountProps}