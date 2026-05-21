import { createContext, useContext, useMemo, useState } from 'react';
import { Navigate, Route, Routes } from 'react-router-dom';
import Navbar from './components/Navbar.jsx';
import Dashboard from './pages/Dashboard.jsx';
import Auditoria from './pages/Auditoria.jsx';
import Recetas from './pages/Recetas.jsx';
import Configuracion from './pages/Configuracion.jsx';
import { recetas as initialRecipes } from './data/recetas.js';

const AuditConfigContext = createContext(null);

export function useAuditConfig() {
  return useContext(AuditConfigContext);
}

export function classifyVariation(variation, alertThreshold = 10) {
  if (variation > alertThreshold) return 'Alerta';
  if (variation >= 5 && variation <= alertThreshold) return 'Vigilar';
  if (variation < 0) return 'Oportunidad';
  return 'Normal';
}

export default function App() {
  const [alertThreshold, setAlertThreshold] = useState(10);
  const [targetMargin, setTargetMargin] = useState(65);
  const [reviewedAlerts, setReviewedAlerts] = useState([]);
  const [recipes, setRecipes] = useState(initialRecipes);

  const value = useMemo(
    () => ({
      alertThreshold,
      setAlertThreshold,
      targetMargin,
      setTargetMargin,
      recipes,
      createRecipe: (recipe) => setRecipes((current) => [recipe, ...current]),
      updateRecipe: (recipe) =>
        setRecipes((current) => current.map((item) => (item.id === recipe.id ? recipe : item))),
      deleteRecipe: (id) => setRecipes((current) => current.filter((item) => item.id !== id)),
      reviewedAlerts,
      markReviewed: (id) =>
        setReviewedAlerts((current) => (current.includes(id) ? current : [...current, id])),
      getStatus: (variation) => classifyVariation(variation, alertThreshold),
    }),
    [alertThreshold, targetMargin, reviewedAlerts, recipes],
  );

  return (
    <AuditConfigContext.Provider value={value}>
      <div className="min-h-screen bg-crema text-cacao">
        <Navbar />
        <main className="mx-auto max-w-7xl px-4 pb-10 pt-4 sm:px-6 lg:pl-72 lg:pr-8 lg:pt-8">
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/auditoria" element={<Auditoria />} />
            <Route path="/recetas" element={<Recetas />} />
            <Route path="/configuracion" element={<Configuracion />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>
      </div>
    </AuditConfigContext.Provider>
  );
}
