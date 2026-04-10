export function Footer() {
  return (
    <footer className="border-t border-border bg-card/50 px-6 py-4">
      <div className="flex flex-col items-center justify-between gap-2 text-xs text-muted-foreground sm:flex-row">
        <p>&copy; {new Date().getFullYear()} Infinititech Partners. All rights reserved.</p>
        <div className="flex items-center gap-4">
          <a href="/opt-out" className="hover:text-foreground transition-colors">
            Privacy & Opt-Out
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            Terms of Service
          </a>
          <a href="#" className="hover:text-foreground transition-colors">
            API Docs
          </a>
        </div>
      </div>
    </footer>
  );
}
