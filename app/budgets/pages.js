// app/budgets/page.js
'use client';

import { useState, useEffect } from 'react';
import { firestore } from '../lib/firebase';
import { collection, getDocs } from 'firebase/firestore';

export default function BudgetList() {
  const [budgets, setBudgets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchBudgets = async () => {
      try {
        const querySnapshot = await getDocs(collection(firestore, 'budgets'));
        const budgetList = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        setBudgets(budgetList);
        setLoading(false);
      } catch (err) {
        console.error('Erro ao buscar orçamentos:', err);
        setError('Erro ao buscar orçamentos.');
        setLoading(false);
      }
    };

    fetchBudgets();
  }, []);

  if (loading) {
    return <div className="container mx-auto p-4">Carregando orçamentos...</div>;
  }

  if (error) {
    return <div className="container mx-auto p-4 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Lista de Orçamentos</h1>
      {budgets.length === 0 ? (
        <p>Nenhum orçamento cadastrado ainda.</p>
      ) : (
        <ul>
          {budgets.map(budget => (
            <li key={budget.id} className="mb-2 border p-2 rounded shadow-sm">
              <strong>ID:</strong> {budget.id}
              <pre className="text-sm mt-1">{JSON.stringify(budget.data, null, 2)}</pre>
              {budget.imageUrls && Object.keys(budget.imageUrls).map(key => (
                <div key={key} className="mt-2">
                  <p className="text-gray-700 text-sm">Imagem ({key}):</p>
                  <img src={budget.imageUrls[key]} alt={key} className="max-w-xs h-auto" />
                </div>
              ))}
              <p className="text-gray-500 text-xs mt-1">Criado em: {budget.createdAt?.toDate().toLocaleDateString()}</p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}