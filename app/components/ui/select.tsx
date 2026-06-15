export const Select = ({
  children,
  onValueChange,
  defaultValue,
  ...props
}: any) => (
  <select
    defaultValue={defaultValue}
    onChange={(e) => onValueChange?.(e.target.value)}
    className="border rounded-lg p-2 bg-white"
    {...props}
  >
    {children}
  </select>
);
export const SelectTrigger = ({ children }: any) => <>{children}</>;
export const SelectValue = ({ placeholder }: any) => (
  <option value="">{placeholder}</option>
);
export const SelectContent = ({ children }: any) => <>{children}</>;
export const SelectItem = ({ value, children }: any) => (
  <option value={value}>{children}</option>
);
