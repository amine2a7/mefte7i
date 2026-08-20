export const APP_NAME = "MefTe7i";
export const APP_TAGLINE = "Votre sécurité, notre clé";
export const COMMISSION_RATE = 0.1;

export const SUPPORT_PHONE = "52 197 602";
export const EMERGENCY_AVAILABLE = "24h/24 - 7j/7";

// TODO: replace with the real domain once one is chosen (see deployment discussion).
export const SITE_URL = "https://mefte7i.tn";
export const SITE_CITY = "Tunis";
export const SITE_COUNTRY = "Tunisie";

export const CURRENCY_SYMBOL = "DT";

export function formatMontant(amount: number): string {
  return `${amount.toFixed(3)} ${CURRENCY_SYMBOL}`;
}
