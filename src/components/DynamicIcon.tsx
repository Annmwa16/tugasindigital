import * as Icons from "lucide-react";

export const DynamicIcon = ({ name, className }: { name: string, className?: string }) => {
  // @ts-ignore
  const IconComponent = Icons[name];

  if (!IconComponent) {
    return <Icons.HelpCircle className={className} />; // Icon default kalau gak ketemu
  }

  return <IconComponent className={className} />;
};