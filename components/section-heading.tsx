export function SectionHeading({
  eyebrow,
  title,
  children,
  wide = false
}: {
  eyebrow: string;
  title: string;
  children?: React.ReactNode;
  wide?: boolean;
}) {
  return (
    <div className={wide ? "max-w-4xl" : "max-w-2xl"}>
      <p className="mb-3 text-xs font-black uppercase tracking-[0.12em] text-moss">{eyebrow}</p>
      <h2 className="mb-4 text-4xl font-black leading-[1.02] tracking-normal md:text-6xl">{title}</h2>
      {children ? <div className="text-lg text-muted">{children}</div> : null}
    </div>
  );
}
