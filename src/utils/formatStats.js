export const WORKOUT_CONFIG = {
  strength: {
    stats: ['durationSeconds', 'activeCalories', 'totalCalories', 'avgHeartRate'],
  },
  cycling_indoor: {
    stats: ['durationSeconds', 'activeCalories', 'totalCalories', 'avgHeartRate'],
  },
  elliptical: {
    stats: ['durationSeconds', 'activeCalories', 'totalCalories', 'avgHeartRate'],
  },
  running: {
    stats: ['durationSeconds', 'totalDistanceMiles', 'activeCalories', 'totalCalories', 'avgHeartRate', 'avgPace'],
  },
  walking: {
    stats: ['durationSeconds', 'totalDistanceMiles', 'activeCalories', 'totalCalories', 'elevationGainFt', 'avgPace', 'avgHeartRate'],
  },
};

// "4650" → "1:17:30"
export function formatDuration(totalSeconds) {
  const h = Math.floor(totalSeconds / 3600);
  const m = Math.floor((totalSeconds % 3600) / 60);
  const s = totalSeconds % 60;
  const mm = String(m).padStart(2, '0');
  const ss = String(s).padStart(2, '0');
  return h > 0 ? `${h}:${mm}:${ss}` : `${m}:${ss}`;
}

// minsPerMile (float) → "9'34\"/MI"
export function formatPace(minsPerMile) {
  const mins = Math.floor(minsPerMile);
  const secs = Math.round((minsPerMile - mins) * 60);
  return `${mins}'${String(secs).padStart(2, '0')}"`;
}

export function getStats(workout) {
  const config = WORKOUT_CONFIG[workout.workoutTypeKey] || {
    stats: ['durationSeconds', 'activeCalories', 'totalCalories', 'avgHeartRate'],
  };

  const statMap = {
    durationSeconds: workout.durationSeconds
      ? { value: formatDuration(workout.durationSeconds), unit: '', label: 'Workout Time', color: '#FFD60A' }
      : null,
    activeCalories: workout.activeCalories
      ? { value: workout.activeCalories, unit: 'CAL', label: 'Active Calories', color: '#FF375F' }
      : null,
    totalCalories: workout.totalCalories
      ? { value: workout.totalCalories, unit: 'CAL', label: 'Total Calories', color: '#FF375F' }
      : null,
    avgHeartRate: workout.avgHeartRate
      ? { value: workout.avgHeartRate, unit: 'BPM', label: 'Avg. Heart Rate', color: '#FF9F0A' }
      : null,
    totalDistanceMiles: workout.totalDistanceMiles > 0
      ? { value: workout.totalDistanceMiles.toFixed(2), unit: 'MI', label: 'Distance', color: '#30D158' }
      : null,
    stepCount: workout.stepCount
      ? { value: workout.stepCount.toLocaleString(), unit: '', label: 'Steps', color: '#30D158' }
      : null,
    elevationGainFt: workout.elevationGainFt
      ? { value: workout.elevationGainFt, unit: 'FT', label: 'Elevation Gain', color: '#30D158' }
      : null,
    avgPace: workout.avgPaceMinsPerMile
      ? { value: formatPace(workout.avgPaceMinsPerMile), unit: '/MI', label: 'Avg. Pace', color: '#64D2FF' }
      : null,
  };

  return config.stats.map((key) => statMap[key]).filter(Boolean);
}

export function formatTimeRange(startISO, endISO) {
  const fmt = (iso) =>
    new Date(iso).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    });
  return `${fmt(startISO)} – ${fmt(endISO)}`;
}

export function formatDate(isoString) {
  return new Date(isoString).toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
  });
}
