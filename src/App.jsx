import { useState, useEffect } from 'react';
import PatientForm from './components/PatientForm';
import ResultCard  from './components/ResultCard';
import { predictDiabetes, checkHealth } from './api';

export default function App() {
  const [result,    setResult]    = useState(null);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState(null);
  const [apiStatus, setApiStatus] = useState('checking');

  useEffect(() => {
    checkHealth().then(data => {
      setApiStatus(data ? 'online' : 'offline');
    });
  }, []);

  const handleSubmit = async (patientData) => {
    setLoading(true);
    setError(null);
    setResult(null);
    const { data, error: apiError } = await predictDiabetes(patientData);
    if (apiError) setError(apiError);
    else setResult(data);
    setLoading(false);
  };

  const handleReset = () => {
    setResult(null);
    setError(null);
  };

  return (
    <div style={{ minHeight: '100vh', background: '#0b1120' }}>

      {/* Header */}
      <header style={{
        background: 'linear-gradient(135deg, #0d1e35 0%, #0b1120 100%)',
        borderBottom: '1px solid #1e3a5f',
        padding: '20px 32px',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
      }}>
        <div>
          <h1 style={{
            margin: 0, fontSize: '22px', fontWeight: '800', color: '#fff',
          }}>🩺 MediPredict</h1>
          <p style={{ margin: 0, color: '#475569', fontSize: '13px' }}>
            Diabetes Risk Assessment
          </p>
        </div>

        {/* API status indicator */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '8px',
          background: apiStatus === 'online' ? '#0f2d1a' : '#2d0f0f',
          border: `1px solid ${apiStatus === 'online' ? '#22c55e44' : '#ef444444'}`,
          borderRadius: '20px', padding: '6px 14px',
        }}>
          <div style={{
            width: '8px', height: '8px', borderRadius: '50%',
            background: apiStatus === 'online' ? '#22c55e' : '#ef4444',
            boxShadow: apiStatus === 'online' ? '0 0 6px #22c55e' : '0 0 6px #ef4444',
          }} />
          <span style={{
            fontSize: '12px', fontFamily: 'monospace',
            color: apiStatus === 'online' ? '#22c55e' : '#ef4444',
          }}>
            {apiStatus === 'checking' ? 'Connecting...' :
             apiStatus === 'online'   ? 'API Online'    : 'API Offline'}
          </span>
        </div>
      </header>

      {/* Main */}
      <main style={{ maxWidth: '900px', margin: '0 auto', padding: '32px 24px' }}>

        {/* Hero */}
        <div style={{ textAlign: 'center', marginBottom: '36px' }}>
          <h2 style={{
            fontSize: '32px', fontWeight: '800', color: '#f1f5f9',
            margin: '0 0 12px', letterSpacing: '-1px',
          }}>Diabetes Risk Assessment</h2>
          <p style={{ color: '#64748b', fontSize: '16px', maxWidth: '520px', margin: '0 auto' }}>
            Enter patient clinical values below to get an instant AI-powered
            diabetes risk prediction with clinical recommendations.
          </p>
        </div>

        {/* API offline warning */}
        {apiStatus === 'offline' && (
          <div style={{
            background: '#2d0f0f', border: '1px solid #ef444444',
            borderRadius: '10px', padding: '14px 18px', marginBottom: '24px',
          }}>
            <p style={{ margin: 0, color: '#ef4444', fontSize: '13px' }}>
              ⚠️ Cannot connect to backend. Make sure uvicorn is running:
              <code style={{
                background: '#1a0a0a', padding: '2px 8px',
                borderRadius: '4px', marginLeft: '8px', fontFamily: 'monospace',
              }}>
                uvicorn main:app --reload
              </code>
            </p>
          </div>
        )}

        {/* Form or Result */}
        <div style={{
          background: '#0d1e35', border: '1px solid #1e3a5f',
          borderRadius: '16px', padding: '32px', marginBottom: '24px',
        }}>
          {!result ? (
            <>
              <h3 style={{
                margin: '0 0 24px', fontSize: '16px', color: '#94a3b8',
                fontWeight: '600', textTransform: 'uppercase', letterSpacing: '1px',
              }}>Patient Clinical Values</h3>
              <PatientForm onSubmit={handleSubmit} loading={loading} />
            </>
          ) : (
            <>
              <ResultCard result={result} />
              <button onClick={handleReset} style={{
                width: '100%', marginTop: '16px', padding: '12px',
                background: 'transparent', border: '1px solid #1e3a5f',
                borderRadius: '10px', color: '#64748b',
                fontSize: '14px', cursor: 'pointer',
              }}>
                ← Assess Another Patient
              </button>
            </>
          )}
        </div>

        {/* Error */}
        {error && (
          <div style={{
            background: '#2d0f0f', border: '1px solid #ef444444',
            borderRadius: '10px', padding: '14px 18px',
          }}>
            <p style={{ margin: 0, color: '#ef4444', fontSize: '13px' }}>
              ❌ Error: {error}
            </p>
          </div>
        )}

        {/* Footer */}
        <p style={{
          textAlign: 'center', color: '#1e3a5f', fontSize: '12px',
          marginTop: '32px', fontFamily: 'monospace',
        }}>
          MediPredict v1.0 · FastAPI + React · Pima Indians Diabetes Dataset
        </p>
      </main>
    </div>
  );
}