export default function NotFound() {
  return (
    <div className="flex min-h-screen items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-slate-900">404</h1>
        <p className="mt-2 text-slate-600">Хуудас олдсонгүй</p>
        <a href="/" className="mt-4 inline-block text-blue-600 hover:underline">Нүүр хуудас руу буцах</a>
      </div>
    </div>
  );
}
