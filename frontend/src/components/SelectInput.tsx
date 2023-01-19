import { ChangeEvent } from "react";

interface SelectInputOption {
  name: string;
  value: string | number;
}

interface Props {
  options: SelectInputOption[];
  onChange: (e: ChangeEvent<HTMLSelectElement>) => void;
  id?: string;
}

const SelectInput = ({ options, onChange, id }: Props) => {
  return (
    <select
      id={id}
      onChange={onChange}
    >
      {options.map((option, i) => (
        <option key={i} value={option.value}>
          {option.name}
        </option>
      ))}
    </select>
  );
};

export default SelectInput;