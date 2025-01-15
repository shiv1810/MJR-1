import React, { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';

export function SupabaseTest() {
  const [status, setStatus] = useState<'checking' | 'connected' | 'error'>('checking');
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function checkConnection() {
      try {
        const { data, error } = await supabase
          .from('profiles')
          .select('count')
          .single();

        if (error) throw error;
        setStatus('connected');
      } catch (err: any) {
        setStatus('error');
        setError(err.message);
      }
    }

    checkConnection();
  }, []);

  return (
    <div className="fixed bottom-4 right-4 p-4 rounded-lg shadow-lg bg-white dark:bg-gray-800">
      <h3 className="text-lg font-semibold mb-2">Supabase Connection Status</h3>
      <div className="flex items-center gap-2">
        <div
          className={`w-3 h-3 rounded-full ${
            status === 'checking'
              ? 'bg-yellow-500'
              : status === 'connected'
              ? 'bg-green-500'
              : 'bg-red-500'
          }`}
        />
        <span className="text-sm">
          {status === 'checking'
            ? 'Checking connection...'
            : status === 'connected'
            ? 'Connected to Supabase'
            : 'Connection Error'}
        </span>
      </div>
      {error && <p className="text-sm text-red-500 mt-2">{error}</p>}
    </div>
  );
}