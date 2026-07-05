interface QuantityFieldProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
}

const parseQuantity = (value: string): number | null => {
  if (value.trim() === '') {
    return null;
  }
  const parsed = Math.floor(Number(value));
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : null;
};

export const QuantityField = ({
  id,
  label,
  value,
  onChange,
  error = '',
  placeholder = 'Leave blank for unlimited'
}: QuantityFieldProps) => {
  const quantity = parseQuantity(value);
  const canDecrement = quantity !== null && quantity > 0;

  const handleIncrement = () => {
    if (quantity === null) {
      onChange('1');
      return;
    }
    onChange(String(quantity + 1));
  };

  const handleDecrement = () => {
    if (quantity === null || quantity === 0) {
      return;
    }
    onChange(String(quantity - 1));
  };

  const handleInputChange = (nextValue: string) => {
    if (nextValue.trim() === '') {
      onChange('');
      return;
    }
    const parsed = Math.floor(Number(nextValue));
    if (!Number.isFinite(parsed) || parsed < 0) {
      return;
    }
    onChange(String(parsed));
  };

  return (
    <label className="block space-y-1.5" {...(id ? { htmlFor: id } : {})}>
      <span className="text-sm font-semibold text-lavender-800">{label}</span>
      <div className="flex items-stretch gap-2">
        <button
          type="button"
          aria-label="Decrease quantity"
          disabled={!canDecrement}
          onClick={handleDecrement}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-lavender-300 bg-white text-lg font-bold text-lavender-700 transition hover:border-lavender-500 hover:bg-lavender-50 disabled:cursor-not-allowed disabled:opacity-40"
        >
          −
        </button>
        <input
          id={id}
          className={`input text-center tabular-nums ${error ? '!border-red-400 !ring-1 !ring-red-200' : ''}`}
          type="number"
          min={0}
          step={1}
          inputMode="numeric"
          value={value}
          placeholder={placeholder}
          onChange={(event) => handleInputChange(event.target.value)}
        />
        <button
          type="button"
          aria-label="Increase quantity"
          onClick={handleIncrement}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl border border-lavender-300 bg-white text-lg font-bold text-lavender-700 transition hover:border-lavender-500 hover:bg-lavender-50"
        >
          +
        </button>
      </div>
      <p className="text-xs text-lavender-600">
        {quantity === null ? 'Unlimited stock' : quantity === 0 ? 'Sold out (0 in stock)' : `${quantity} in stock`}
      </p>
      {error ? <p className="text-xs text-red-600">{error}</p> : null}
    </label>
  );
};
