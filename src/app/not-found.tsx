import "./globals.css";

// Fallback 404 for paths outside /ar and /en (the middleware normally redirects them first).
export default function RootNotFound() {
  return (
    <html lang="ar" dir="rtl">
      <body className="flex min-h-dvh items-center justify-center bg-lapis-900 p-6 text-center text-white">
        <div>
          <p className="text-8xl font-bold text-gold-300">404</p>
          <p className="mt-4 text-xl">الصفحة غير موجودة · Page not found</p>
          <a href="/ar" className="btn btn-gold btn-lg mt-8">الرئيسية · Home</a>
        </div>
      </body>
    </html>
  );
}
