import type { HTMLInputTypeAttribute } from 'react';

interface FormInputProps {
  id?: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: HTMLInputTypeAttribute;
  required?: boolean;
  placeholder?: string;
  error?: string;
}

export const FormInput = ({
  id,
  label,
  value,
  onChange,
  type = 'text',
  required = false,
  placeholder,
  error = ''
}: FormInputProps) => {
  return (
    <label className="block space-y-1.5">
      <span className="text-sm font-semibold text-lavender-800">
        {label}
        {required ? ' *' : ''}
      </span>
      <input
        id={id}
        className={`input ${error ? '!border-red-400 !ring-1 !ring-red-200' : ''}`}
        type={type}
        value={value}
        required={required}
        placeholder={placeholder}
        onChange={(event) => onChange(event.target.value)}
      />
    </label>
  );
};
