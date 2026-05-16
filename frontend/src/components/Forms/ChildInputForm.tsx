// Form for entering child assessment data

import { useState } from 'react';
import type { ChildInput } from '../../types';
import { DISTRICTS_BY_REGION } from '../../types';

interface Props {
  onSubmit: (data: ChildInput) => void;
  loading: boolean;
}

// Default form values
const initialForm: ChildInput = {
  age_months: 24,
  sex: 'male',
  weight_kg: 10.5,
  height_cm: 82,
  wealth_index: 'middle',
  mothers_education: 'primary',
  residence_type: 'rural',
  region: 'south',
  district: 'huye',
  sanitation_type: 'improved',
  water_source: 'improved',
  currently_breastfeeding: 'yes',
};

export default function ChildInputForm({ onSubmit, loading }: Props) {
  const [form, setForm] = useState<ChildInput>(initialForm);
  const [errors, setErrors] = useState<Partial<Record<keyof ChildInput, string>>>({});

  // Age is entered as years + months but submitted as total months
  const [ageYears, setAgeYears] = useState<number>(Math.floor(initialForm.age_months / 12));
  const [ageMonths, setAgeMonths] = useState<number>(initialForm.age_months % 12);

  // Update age fields and convert to total months
  const updateAge = (years: number, months: number) => {
    const total = years * 12 + months;
    setAgeYears(years);
    setAgeMonths(months);
    setForm((prev) => ({ ...prev, age_months: total }));
    setErrors((prev) => ({ ...prev, age_months: undefined }));
  };

  // Generic field updater
  const update = <K extends keyof ChildInput>(field: K, value: ChildInput[K]) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: undefined }));
  };

  // Update region and reset district to the first one in that region
  const updateRegion = (region: ChildInput['region']) => {
    const firstDistrict = DISTRICTS_BY_REGION[region][0];
    setForm((prev) => ({ ...prev, region, district: firstDistrict }));
    setErrors((prev) => ({ ...prev, region: undefined, district: undefined }));
  };

  // Validate form fields against backend constraints
  const validate = (): boolean => {
    const newErrors: Partial<Record<keyof ChildInput, string>> = {};
    if (form.age_months < 0 || form.age_months > 60)
      newErrors.age_months = 'Age must be 0-5 years (0-60 months)';
    if (ageMonths < 0 || ageMonths > 11)
      newErrors.age_months = 'Months must be 0-11';
    if (form.weight_kg <= 0 || form.weight_kg > 30)
      newErrors.weight_kg = 'Weight must be 0-30 kg';
    if (form.height_cm <= 30 || form.height_cm > 130)
      newErrors.height_cm = 'Height must be 30-130 cm';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Form submit handler
  const handleSubmit = (e: { preventDefault: () => void }) => {
    e.preventDefault();
    if (validate()) onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-slate-200 p-4 sm:p-6">
      <h2 className="text-lg sm:text-xl font-semibold text-slate-900 mb-5 sm:mb-6">Child Assessment Form</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-5">
        {/* Anthropometric Data */}
        <div className="sm:col-span-2">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Anthropometric Data
          </h3>
        </div>

        {/* Age input as years and months */}
        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Age
          </label>
          <div className="grid grid-cols-2 gap-3">
            <div>
              <input
                type="number"
                min={0}
                max={5}
                value={ageYears}
                onChange={(e) => updateAge(parseInt(e.target.value) || 0, ageMonths)}
                placeholder="Years"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                  errors.age_months ? 'border-red-300' : 'border-slate-300'
                }`}
              />
              <p className="text-[10px] text-slate-400 mt-1">Years (0-5)</p>
            </div>
            <div>
              <input
                type="number"
                min={0}
                max={11}
                value={ageMonths}
                onChange={(e) => updateAge(ageYears, parseInt(e.target.value) || 0)}
                placeholder="Months"
                className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
                  errors.age_months ? 'border-red-300' : 'border-slate-300'
                }`}
              />
              <p className="text-[10px] text-slate-400 mt-1">Months (0-11)</p>
            </div>
          </div>
          <p className="text-xs text-slate-500 mt-1">
            Total: <span className="font-medium">{form.age_months} months</span>
          </p>
          {errors.age_months && (
            <p className="text-xs text-red-500 mt-1">{errors.age_months}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">Sex</label>
          <select
            value={form.sex}
            onChange={(e) => update('sex', e.target.value as ChildInput['sex'])}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="male">Male</option>
            <option value="female">Female</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Weight (kg)
          </label>
          <input
            type="number"
            step="0.1"
            min={0.1}
            max={30}
            value={form.weight_kg}
            onChange={(e) => update('weight_kg', parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
              errors.weight_kg ? 'border-red-300' : 'border-slate-300'
            }`}
          />
          {errors.weight_kg && (
            <p className="text-xs text-red-500 mt-1">{errors.weight_kg}</p>
          )}
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Height (cm)
          </label>
          <input
            type="number"
            step="0.1"
            min={30}
            max={130}
            value={form.height_cm}
            onChange={(e) => update('height_cm', parseFloat(e.target.value) || 0)}
            className={`w-full px-3 py-2 border rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none ${
              errors.height_cm ? 'border-red-300' : 'border-slate-300'
            }`}
          />
          {errors.height_cm && (
            <p className="text-xs text-red-500 mt-1">{errors.height_cm}</p>
          )}
        </div>

        {/* Demographic Data */}
        <div className="sm:col-span-2 mt-2">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Demographic Data
          </h3>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Wealth Index
          </label>
          <select
            value={form.wealth_index}
            onChange={(e) => update('wealth_index', e.target.value as ChildInput['wealth_index'])}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="poorest">Poorest</option>
            <option value="poorer">Poorer</option>
            <option value="middle">Middle</option>
            <option value="richer">Richer</option>
            <option value="richest">Richest</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Mother's Education
          </label>
          <select
            value={form.mothers_education}
            onChange={(e) => update('mothers_education', e.target.value as ChildInput['mothers_education'])}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="none">None</option>
            <option value="primary">Primary</option>
            <option value="secondary">Secondary</option>
            <option value="higher">Higher</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Residence Type
          </label>
          <select
            value={form.residence_type}
            onChange={(e) => update('residence_type', e.target.value as ChildInput['residence_type'])}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="urban">Urban</option>
            <option value="rural">Rural</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Region (Province)
          </label>
          <select
            value={form.region}
            onChange={(e) => updateRegion(e.target.value as ChildInput['region'])}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="kigali">Kigali</option>
            <option value="south">South</option>
            <option value="north">North</option>
            <option value="east">East</option>
            <option value="west">West</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            District
          </label>
          <select
            value={form.district}
            onChange={(e) => update('district', e.target.value as ChildInput['district'])}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            {/* Show only districts in the selected region */}
            {DISTRICTS_BY_REGION[form.region].map((d) => (
              <option key={d} value={d}>
                {d.charAt(0).toUpperCase() + d.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Sanitation Type
          </label>
          <select
            value={form.sanitation_type}
            onChange={(e) => update('sanitation_type', e.target.value as ChildInput['sanitation_type'])}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="improved">Improved</option>
            <option value="unimproved">Unimproved</option>
            <option value="open_defecation">Open Defecation</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Water Source
          </label>
          <select
            value={form.water_source}
            onChange={(e) => update('water_source', e.target.value as ChildInput['water_source'])}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="improved">Improved</option>
            <option value="unimproved">Unimproved</option>
          </select>
        </div>

        {/* Contextual / Feeding */}
        <div className="sm:col-span-2 mt-2">
          <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wide mb-3">
            Feeding Context
          </h3>
        </div>

        <div className="sm:col-span-2">
          <label className="block text-sm font-medium text-slate-700 mb-1">
            Currently Breastfeeding?
          </label>
          <select
            value={form.currently_breastfeeding}
            onChange={(e) => update('currently_breastfeeding', e.target.value as ChildInput['currently_breastfeeding'])}
            className="w-full px-3 py-2 border border-slate-300 rounded-lg text-sm focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none"
          >
            <option value="yes">Yes</option>
            <option value="no">No</option>
          </select>
        </div>
      </div>

      <div className="mt-6 flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="flex-1 bg-emerald-600 text-white py-3 px-6 rounded-lg font-medium text-sm hover:bg-emerald-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
              Analyzing...
            </span>
          ) : (
            'Run Assessment'
          )}
        </button>
        <button
          type="reset"
          onClick={() => setForm(initialForm)}
          className="px-6 py-3 border border-slate-300 text-slate-700 rounded-lg font-medium text-sm hover:bg-slate-50 transition-colors"
        >
          Reset
        </button>
      </div>
    </form>
  );
}
