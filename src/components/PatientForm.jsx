import { useState } from 'react';

const fields = [
  { key: 'pregnancies',   label: 'Pregnancies',       unit: 'count',   min: 0, max: 17,  step: 1,    normal: '0–4',       hint: 'Number of times pregnant' },
  { key: 'glucose',       label: 'Glucose',           unit: 'mg/dL',   min: 0, max: 200, step: 1,    normal: '70–100',    hint: 'Fasting plasma glucose' },
  { key: 'bloodPressure', label: 'Blood Pressure',    unit: 'mmHg',    min: 0, max: 122, step: 1,    normal: '60–80',     hint: 'Diastolic blood pressure' },
  { key: 'skinThickness', label: 'Skin Thickness',    unit: 'mm',      min: 0, max: 99,  step: 1,    normal: '10–40',     hint: 'Triceps skinfold thickness' },
  { key: 'insulin',       label: 'Insulin',           unit: 'mu U/ml', min: 0, max: 846, step: 1,    normal: '16–166',    hint: '2-hour serum insulin' },
  { key: 'bmi',           label: 'BMI',               unit: 'kg/m²',   min: 0, max: 70,  step: 0.1,  normal: '18.5–24.9', hint: 'Body mass index' },
  { key: 'dpf',           label: 'Diabetes Pedigree', unit: 'score',   min: 0, max: 2.5, step: 0.01, normal: '0.0–0.6',   hint: 'Family history function' },
  { key: 'age',           label: 'Age',               unit: 'years',   min: 1, max: 120, step: 1,    normal: '21–40',     hint: 'Age in years' },
];

export default function PatientForm({ onSubmit, loading }) {
  const [values, setValues] = useState({
    pregnancies: '', glucose: '', bloodPressure: '',
    skinThickness: '', insulin: '', bmi: '', dpf: '', age: '',
  });
  const [errors, setErrors] = useState({});

  const validate = () => {
    const newErrors = {};
    fields.forEach(f => {
      const val = parseFloat(values[f.key]);
      if (values[f.key] === '')       newErrors[f.key] = 'Required';
      else if (isNaN(val))            newErrors[f.key] = 'Must be a number';
      else if (val < f.min || val > f.max) newErrors[f.key] = `Must be ${f.min}–${f.max}`;
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (validate()) onSubmit(values);
  };

  const handleChange = (key, value) => {
    setValues(prev => ({ ...prev, [key]: value }));
    if (errors[key]) setErrors(prev => ({ ...prev, [key]: null }));
  };

  return (
    <div style={{ width: '100%' }}>
      <div style={{
        display: 'grid', gridTemplateColumns: '1fr 1fr',
        gap: '16px', marginBottom: '24px',
      }}>
        {fields.map(f => (
          <div key={f.key}>
            <div style={{
              display: 'flex', justifyContent: 'space-between',
              alignItems: 'center', marginBottom: '6px',
            }}>
              <label style={{
                fontSize: '13px', fontWeight: '600', color: '#94a3b8',
                textTransform: 'uppercase', letterSpacing: '0.5px',
              }}>{f.label}</label>
              <span style={{ fontSize: '11px', color: '#334155', fontFamily: 'monospace' }}>
                Normal: {f.normal}
              </span>
            </div>
            <div style={{ position: 'relative' }}>
              <input
                type="number"
                min={f.min} max={f.max} step={f.step}
                value={values[f.key]}
                onChange={e => handleChange(f.key, e.target.value)}
                placeholder={f.hint}
                style={{
                  width: '100%', padding: '10px 52px 10px 14px',
                  background: errors[f.key] ? '#2d1515' : '#0f1e35',
                  border: `1px solid ${errors[f.key] ? '#ef4444' : '#1e3a5f'}`,
                  borderRadius: '8px', color: '#e2e8f0',
                  fontSize: '14px', outline: 'none',
                }}
              />
              <span style={{
                position: 'absolute', right: '12px', top: '50%',
                transform: 'translateY(-50%)',
                fontSize: '11px', color: '#334155',
                fontFamily: 'monospace', pointerEvents: 'none',
              }}>{f.unit}</span>
            </div>
            {errors[f.key] && (
              <p style={{ margin: '4px 0 0', fontSize: '11px', color: '#ef4444' }}>
                ⚠ {errors[f.key]}
              </p>
            )}
          </div>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        disabled={loading}
        style={{
          width: '100%', padding: '14px',
          background: loading
            ? '#1e3a5f'
            : 'linear-gradient(135deg, #2563eb, #1d4ed8)',
          color: '#fff', border: 'none', borderRadius: '10px',
          fontSize: '15px', fontWeight: '700',
          cursor: loading ? 'not-allowed' : 'pointer',
          letterSpacing: '0.5px',
        }}
      >
        {loading ? '⏳ Analysing...' : '🔬 Assess Diabetes Risk'}
      </button>
    </div>
  );
}