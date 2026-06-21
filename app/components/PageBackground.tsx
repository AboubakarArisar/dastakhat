// Shared decorative backdrop (masked grid + blurred orbs) so inner app pages
// match the landing page's polish.
export default function PageBackground() {
  return (
    <div className="pointer-events-none absolute inset-0 -z-10 overflow-hidden">
      <div className="absolute inset-0 bg-grid" />
      <div className="glow left-[8%] top-[-6rem] h-72 w-72 bg-primary/25" />
      <div className="glow right-[-4rem] top-[16rem] h-80 w-80 bg-accent/15" />
    </div>
  );
}
