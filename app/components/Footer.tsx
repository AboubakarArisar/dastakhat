export default function Footer() {
  return (
    <footer className="w-full border-t bg-background text-gray-600 py-8">
      <div className="max-w-5xl mx-auto px-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div className="text-sm">© {new Date().getFullYear()} Signeasy — Built for freelancers & creators</div>
        <div className="flex gap-4 text-sm">
          <a href="/privacy" className="hover:underline">Privacy</a>
          <a href="/terms" className="hover:underline">Terms</a>
        </div>
      </div>
    </footer>
  );
}
