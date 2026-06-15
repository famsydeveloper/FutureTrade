export const Card = ({ className, ...props }: any) => (
  <div
    {...props}
    className={`bg-slate-900 border border-slate-800 rounded-xl p-4 shadow-2xl ${className}`}
  />
);

export const CardContent = ({ className, ...props }: any) => (
  <div {...props} className={`${className}`} />
);

export const CardHeader = ({ className, ...props }: any) => (
  <div {...props} className={`flex flex-col space-y-1.5 pb-4 ${className}`} />
);

export const CardTitle = ({ className, ...props }: any) => (
  <h3
    {...props}
    className={`text-lg font-semibold leading-none tracking-tight text-white ${className}`}
  />
);
