export const Button = ({ className, ...props }: any) => (
  <button
    {...props}
    className={`px-4 py-2 bg-blue-600 text-white rounded-lg font-medium ${className}`}
  />
);
