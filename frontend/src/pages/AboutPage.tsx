// Static information page about the project
export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-8">
      <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-6">About This Project</h1>

      <div className="space-y-6 sm:space-y-8">
        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">Research Background</h2>
          <p className="text-slate-600 leading-relaxed">
            This system is based on the research project titled{' '}
            <strong>
              "Predicting Child Growth Status and Nutritional Suggestions Using
              Selected Local Foods Among Under-Five Children in Rwanda Using
              XGBoost Model."
            </strong>{' '}
            It uses machine learning to predict child nutritional status and
            provides actionable dietary recommendations using locally available
            Rwandan foods.
          </p>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">Methodology</h2>
          <div className="space-y-3 text-slate-600">
            <p>
              <strong>Dataset:</strong> Rwanda Demographic and Health Survey (RDHS)
              data for under-five children.
            </p>
            <p>
              <strong>Model:</strong> XGBoost (Extreme Gradient Boosting) classifier
              trained with 14 features including anthropometric measurements,
              demographic variables, and WHO-derived Z-scores.
            </p>
            <p>
              <strong>Classification:</strong> Five nutritional categories &mdash;
              Normal, Stunted (HAZ &lt; -2), Wasted (WHZ &lt; -2), Underweight
              (WAZ &lt; -2), and Overweight (BAZ &gt; +2).
            </p>
            <p>
              <strong>Z-Scores:</strong> Computed using the WHO Child Growth
              Standards LMS method (Weight-for-Age, Height-for-Age,
              Weight-for-Height, BMI-for-Age).
            </p>
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">Nutrition Recommendations</h2>
          <p className="text-slate-600 mb-3">
            The system provides personalized dietary guidance using locally available
            Rwandan foods, mapped to each predicted nutritional condition:
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
            {[
              'Beans',
              'Maize',
              'Bananas',
              'Sweet Potatoes',
              'Milk',
              'Eggs',
              'Groundnuts',
              'Vegetables',
              'Small Fish',
            ].map((food) => (
              <div
                key={food}
                className="bg-green-50 border border-green-200 rounded-lg px-3 py-2 text-sm text-green-800"
              >
                {food}
              </div>
            ))}
          </div>
        </section>

        <section className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
          <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-3">Technology Stack</h2>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <h3 className="font-semibold text-slate-800">ML Model</h3>
              <ul className="text-sm text-slate-600 mt-1 space-y-1">
                <li>XGBoost Classifier</li>
                <li>scikit-learn</li>
                <li>pandas / NumPy</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Backend</h3>
              <ul className="text-sm text-slate-600 mt-1 space-y-1">
                <li>FastAPI (Python)</li>
                <li>Pydantic v2</li>
                <li>WHO Growth Standards</li>
              </ul>
            </div>
            <div>
              <h3 className="font-semibold text-slate-800">Frontend</h3>
              <ul className="text-sm text-slate-600 mt-1 space-y-1">
                <li>React + TypeScript</li>
                <li>Tailwind CSS</li>
                <li>Recharts</li>
              </ul>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
