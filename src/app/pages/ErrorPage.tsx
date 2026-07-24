export default function ErrorPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-stone-950 via-black to-stone-950 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center">
        <div className="text-6xl font-bold text-amber-500 mb-4">⚠️</div>
        <h1 className="text-3xl font-bold text-white mb-2">Página Não Encontrada</h1>
        <p className="text-white/60 mb-8">A página que você está procurando não existe ou ocorreu um erro ao carregar.</p>
        <a
          href="/Liberdade/"
          className="inline-block px-6 py-3 bg-amber-500 hover:bg-amber-400 text-black font-bold rounded-lg transition-colors"
        >
          Voltar ao Dashboard
        </a>
      </div>
    </div>
  );
}
