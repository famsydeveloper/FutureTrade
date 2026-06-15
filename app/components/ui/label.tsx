export const Label = ({ className, ...props }: any) => (
  <label
    {...props}
    className={`block text-sm font-semibold text-gray-700 ${className}`}
  />
);
