/**
 * Parsing date sended from client with any timezone to UTC-0
 */
export const parseDate = (date: string): string => new Date(date).toISOString();