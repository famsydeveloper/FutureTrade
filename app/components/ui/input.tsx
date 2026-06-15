export const Input = ({ className, ...props }: any) => (
  <input
    {...props}
    className={`border border-gray-300 rounded-lg p-2 ${className}`}
  />
);
