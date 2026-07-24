import logoAsset from "@/assets/flty-logo.png.asset.json";

export function Logo({ size = 36 }: { size?: number }) {
  return (
    <div className="flex items-center gap-2">
      <img src={logoAsset.url} alt="FLTY" width={size} height={size} className="rounded-md" />
      <span className="text-xl font-bold tracking-tight text-foreground">FLTY</span>
    </div>
  );
}
