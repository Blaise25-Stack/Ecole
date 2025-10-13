import { DollarSign } from 'lucide-react';

interface CurrencySelectorProps {
  value: string;
  onChange: (currency: string) => void;
  className?: string;
}

export const currencies = [
  { code: 'FC', symbol: 'FC', name: 'Franc Congolais' },
  { code: 'FCFA', symbol: 'FCFA', name: 'Franc CFA' },
  { code: 'USD', symbol: '$', name: 'Dollar US' },
  { code: 'EUR', symbol: '€', name: 'Euro' },
  { code: 'GBP', symbol: '£', name: 'Livre Sterling' },
  { code: 'MAD', symbol: 'MAD', name: 'Dirham Marocain' },
];

export function CurrencySelector({ value, onChange, className = '' }: CurrencySelectorProps) {
  return (
    <div className={`relative ${className}`}>
      <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white appearance-none cursor-pointer font-medium"
      >
        {currencies.map((currency) => (
          <option key={currency.code} value={currency.code}>
            {currency.symbol} - {currency.name}
          </option>
        ))}
      </select>
    </div>
  );
}

export function formatCurrency(amount: number, currencyCode: string): string {
  const currency = currencies.find(c => c.code === currencyCode);
  if (!currency) return `${amount}`;

  return `${amount.toLocaleString('fr-FR', { minimumFractionDigits: 2, maximumFractionDigits: 2 })} ${currency.symbol}`;
}
