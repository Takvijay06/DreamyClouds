import type { HTMLInputTypeAttribute } from 'react';

interface FormInputProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  placeholder?: string;
}

export const FormInput = ({
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder
}: FormInputProps) => {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-lavender-800">
        {label}
        {required ? ' *' : ''}
      </span>
      <input
        className="input"
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
};
