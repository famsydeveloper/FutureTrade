export const RadioGroup = ({ className, ...props }: any) => (
  <div {...props} className={`flex gap-4 ${className}`} />
);
export const RadioGroupItem = ({ className, ...props }: any) => (
  <input type="radio" {...props} className={`h-4 w-4 ${className}`} />
);
