import { BrandMark } from "@/components/brand-mark";

export function AuthHeading({
  title,
  description,
}: {
  title: string;
  description: React.ReactNode;
}) {
  return (
    <div className="grid gap-2">
      <div className="lg:hidden">
        <BrandMark />
      </div>
      <h1 className="text-xl sm:text-2xl font-semibold tracking-tight">
        {title}
      </h1>
      <p className="text-sm text-muted-foreground text-pretty">{description}</p>
    </div>
  );
}
