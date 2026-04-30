// Site footer

export default function Footer() {
  return (
    <footer className="bg-white border-t border-slate-200 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-sm text-slate-500">
            Child Growth Monitor | AI-Powered Nutrition Platform for Rwanda
          </p>
          <p className="text-xs text-slate-400">
            Based on WHO Child Growth Standards &bull; XGBoost ML Model
          </p>
        </div>
      </div>
    </footer>
  );
}
