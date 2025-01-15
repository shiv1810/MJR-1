import React, { useState, useEffect } from 'react';
import { PitchesHeader } from './PitchesHeader';
import { PitchesGrid } from './PitchesGrid';
import { PitchEditor } from './PitchEditor';
import { PitchModal } from './PitchModal';
import { Pitch } from '../../types/pitch';
import { PitchService } from '../../lib/services/PitchService';
import { useAuth } from '../../contexts/AuthContext';
import { LoadingSpinner } from '../common/LoadingSpinner';

export function PitchesPage() {
  const [pitches, setPitches] = useState<Pitch[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPitch, setSelectedPitch] = useState<Pitch | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();

  useEffect(() => {
    loadPitches();
  }, []);

  const loadPitches = async () => {
    try {
      const { pitches: fetchedPitches, error } = await PitchService.getPitches();
      if (error) throw error;
      setPitches(fetchedPitches || []);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePitch = async (pitchData: {
    title: string;
    description: string;
    media: { type: 'image' | 'video'; url: string };
    tags: string[];
  }) => {
    if (!user) return;

    try {
      const newPitch = {
        ...pitchData,
        author: {
          id: user.id,
          name: user.user_metadata?.full_name || 'Anonymous',
          avatar: user.user_metadata?.avatar_url || 'https://via.placeholder.com/150',
          role: 'Entrepreneur'
        }
      };

      const { pitch, error } = await PitchService.createPitch(newPitch);
      if (error) throw error;

      if (pitch) {
        setPitches([pitch as unknown as Pitch, ...pitches]);
      }
      setIsEditing(false);
    } catch (err: any) {
      setError(err.message);
    }
  };

  const handleLikePitch = async (pitchId: string) => {
    if (!user) return;

    try {
      const { error } = await PitchService.likePitch(pitchId, user.id);
      if (error) throw error;
      await loadPitches(); // Reload pitches to get updated like count
    } catch (err: any) {
      setError(err.message);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return (
      <div className="p-8 text-center">
        <p className="text-red-500">Error: {error}</p>
        <button
          onClick={loadPitches}
          className="mt-4 px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="p-8">
      <PitchesHeader onCreatePitch={() => setIsEditing(true)} />
      <PitchesGrid pitches={pitches} onViewPitch={setSelectedPitch} />

      {isEditing && (
        <PitchEditor
          onSave={handleSavePitch}
          onClose={() => setIsEditing(false)}
        />
      )}

      {selectedPitch && (
        <PitchModal
          pitch={selectedPitch}
          onClose={() => setSelectedPitch(null)}
          onLike={() => handleLikePitch(selectedPitch.id)}
        />
      )}
    </div>
  );
}