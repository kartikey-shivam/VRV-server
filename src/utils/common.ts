export const GetRandomData = <T>(data: T[] | Record<string, T>): T => {
  if (Array.isArray(data)) {
    const randomIndex = Math.floor(Math.random() * data.length)
    // If it's an array, pick a random element
    return data[randomIndex]
  } else {
    // If it's an object, pick a random value
    const values = Object.values(data)
    const randomIndex = Math.floor(Math.random() * values.length)
    return values[randomIndex]
  }
}
export const transactionMethods = ['CARD', 'GENERIC_BANK_ACCOUNT', 'IBAN', 'ACH', 'SWIFT', 'MPESA', 'UPI', 'WALLET', 'CHECK', 'CASH']
