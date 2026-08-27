import { cn } from "@/lib/utils";
import { appConfig } from "@/lib/config";

export function BrandMark({
  className,
  showName = true,
  nameClassName,
}: {
  className?: string;
  showName?: boolean;
  nameClassName?: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "flex size-8 shrink-0 items-center justify-center rounded-md bg-primary text-primary-foreground",
          className
        )}
      >
        <span className="text-sm font-bold">{appConfig.logoMark}</span>
      </div>
      {showName && (
        <span className={cn("text-base font-semibold truncate", nameClassName)}>
          {appConfig.name}
        </span>
      )}
    </div>
  );
}
