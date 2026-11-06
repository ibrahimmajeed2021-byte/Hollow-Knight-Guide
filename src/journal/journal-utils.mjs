// Protect a saved per-game journal against partially written or older
// versions. Do not discard valid completed flags, notes or photos.
const asRecord = (value) =>
  value && typeof value === "object" && !Array.isArray(value) ? value : {};

export function normaliseJournal(saved) {
  const data = asRecord(saved);
  return {
    photos: Array.isArray(data.photos) ? data.photos : [],
    defeated: asRecord(data.defeated),
    collected: asRecord(data.collected),
    notes: asRecord(data.notes),
  };
}
