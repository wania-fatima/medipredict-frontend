import axios from 'axios';

const API_BASE = 'http://127.0.0.1:8000';

export const predictDiabetes = async (patientData) => {
  try {
    const response = await axios.post(`${API_BASE}/predict`, {
      pregnancies    : parseFloat(patientData.pregnancies),
      glucose        : parseFloat(patientData.glucose),
      blood_pressure : parseFloat(patientData.bloodPressure),
      skin_thickness : parseFloat(patientData.skinThickness),
      insulin        : parseFloat(patientData.insulin),
      bmi            : parseFloat(patientData.bmi),
      dpf            : parseFloat(patientData.dpf),
      age            : parseFloat(patientData.age),
    });
    return { data: response.data, error: null };
  } catch (error) {
    const msg = error.response?.data?.detail || error.message;
    return { data: null, error: msg };
  }
};

export const checkHealth = async () => {
  try {
    const response = await axios.get(`${API_BASE}/health`);
    return response.data;
  } catch {
    return null;
  }
};