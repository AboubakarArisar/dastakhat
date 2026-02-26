export default function Footer() {
  return (
    <footer className="w-full border-t border-surface/60 bg-background py-8">
      <div className="site-container flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 px-4">
        <div className="text-sm text-muted">© {new Date().getFullYear()} Signeasy — Built for freelancers & creators</div>
        <div className="flex gap-4 text-sm">
          <a href="/privacy" className="text-muted hover:text-foreground">Privacy</a>
          <a href="/terms" className="text-muted hover:text-foreground">Terms</a>
        </div>
      </div>
    </footer>
  );
}
