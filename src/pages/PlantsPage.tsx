import { useEffect, useMemo, useState } from 'react';
import { Plus, Search, Sprout } from 'lucide-react';
import { useStore } from '../context/AppContext';
import { PlantCard } from '../components/plants/PlantCard';
import { Button, Input, Select, EmptyState, PageHeader, Badge } from '../components/ui/primitives';
import { Modal } from '../components/ui/Modal';
import { PLANT_TYPES } from '../data/mockPlants';
import type { Plant } from '../lib/types';

export function PlantFormModal({
  open,
  onClose,
  editing,
}: {
  open: boolean;
  onClose: () => void;
  editing?: Plant | null;
}) {
  const { addPlant, updatePlant, plants } = useStore();
  const [name, setName] = useState('');
  const [type, setType] = useState(PLANT_TYPES[0]);

  useEffect(() => {
    if (open) {
      setName(editing?.name ?? '');
      setType(editing?.type ?? PLANT_TYPES[0]);
    }
  }, [open, editing]);

  const submit = () => {
    if (!name.trim()) return;
    if (editing) updatePlant(editing.id, { name: name.trim(), type });
    else addPlant(name.trim(), type);
    setName('');
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose} title={editing ? 'Edit plant' : 'Add plant'}>
      <div className="space-y-3.5">
        <div>
          <label className="mb-1 block text-[13px] font-medium text-[var(--text2)]" htmlFor="plant-name">
            Name
          </label>
          <Input
            id="plant-name"
            placeholder="e.g. Living room monstera"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={60}
          />
        </div>
        <div>
          <label className="mb-1 block text-[13px] font-medium text-[var(--text2)]" htmlFor="plant-type">
            Type
          </label>
          <Select id="plant-type" value={type} onChange={(e) => setType(e.target.value)}>
            {PLANT_TYPES.map((t) => (
              <option key={t} value={t}>{t}</option>
            ))}
          </Select>
        </div>
        <p className="text-xs text-[var(--muted)]">
          {plants.length >= 50 ? 'Storage limit reached (50 plants max).' : `${plants.length}/50 plants in local storage.`}
        </p>
        <div className="flex justify-end gap-2 pt-1">
          <Button variant="ghost" onClick={onClose}>Cancel</Button>
          <Button onClick={submit} disabled={!name.trim()}>{editing ? 'Save changes' : 'Add plant'}</Button>
        </div>
      </div>
    </Modal>
  );
}

type StatusFilter = 'all' | 'healthy' | 'moderate' | 'critical' | 'nodata';

export function PlantsPage() {
  const { plants, healthFor, waterPlant, deletePlant } = useStore();
  const [showAdd, setShowAdd] = useState(false);
  const [editing, setEditing] = useState<Plant | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<Plant | null>(null);
  const [query, setQuery] = useState('');
  const [filter, setFilter] = useState<StatusFilter>('all');

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return plants.filter((p) => {
      const score = healthFor(p.id);
      const status = score == null ? 'nodata' : score >= 80 ? 'healthy' : score >= 60 ? 'moderate' : 'critical';
      if (filter !== 'all' && status !== filter) return false;
      if (!q) return true;
      return p.name.toLowerCase().includes(q) || p.type.toLowerCase().includes(q);
    });
  }, [plants, query, filter, healthFor]);

  const counts = useMemo(() => {
    const c: Record<StatusFilter, number> = { all: plants.length, healthy: 0, moderate: 0, critical: 0, nodata: 0 };
    plants.forEach((p) => {
      const s = healthFor(p.id);
      if (s == null) c.nodata++;
      else if (s >= 80) c.healthy++;
      else if (s >= 60) c.moderate++;
      else c.critical++;
    });
    return c;
  }, [plants, healthFor]);

  const filters: { id: StatusFilter; label: string }[] = [
    { id: 'all', label: `All · ${counts.all}` },
    { id: 'healthy', label: `Healthy · ${counts.healthy}` },
    { id: 'moderate', label: `Moderate · ${counts.moderate}` },
    { id: 'critical', label: `Attention · ${counts.critical}` },
    { id: 'nodata', label: `No data · ${counts.nodata}` },
  ];

  return (
    <div className="space-y-4">
      <PageHeader
        title="Plants"
        description="Your monitored collection. Health updates while the simulation runs."
        meta={<Badge tone="neutral">{plants.length}/50 plants</Badge>}
        actions={
          <Button onClick={() => setShowAdd(true)} disabled={plants.length >= 50}>
            <Plus className="h-4 w-4" /> Add plant
          </Button>
        }
      />

      {plants.length > 0 && (
        <div className="flex flex-col gap-2.5 sm:flex-row sm:items-center">
          <label className="relative block flex-1">
            <Search className="pointer-events-none absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-[var(--muted)]" />
            <Input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search by name or type…"
              className="pl-9"
              aria-label="Search plants"
            />
          </label>
          <div className="flex flex-wrap gap-1.5" role="group" aria-label="Filter by health status">
            {filters.map((f) => (
              <button
                key={f.id}
                onClick={() => setFilter(f.id)}
                aria-pressed={filter === f.id}
                className={`rounded-md border px-2.5 py-1.5 text-xs font-medium transition-colors ${
                  filter === f.id
                    ? 'border-[var(--accent)]/40 bg-[var(--accent)]/10 text-[var(--text)]'
                    : 'border-[var(--border)] bg-[var(--panel)] text-[var(--muted)] hover:border-[var(--border-strong)] hover:text-[var(--text)]'
                }`}
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>
      )}

      {plants.length === 0 ? (
        <EmptyState
          icon={<span className="mx-auto mb-3 flex h-9 w-9 items-center justify-center rounded-md border border-[var(--border)] bg-[var(--elev)] text-[var(--muted)]"><Sprout className="h-4 w-4" /></span>}
          title="No plants in your collection"
          hint="Add your first plant, then start the simulation to see live health scores."
          action={<Button onClick={() => setShowAdd(true)}>Add your first plant</Button>}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title="No plants match"
          hint="Try a different search term or clear the status filter."
          action={<Button variant="secondary" onClick={() => { setQuery(''); setFilter('all'); }}>Clear filters</Button>}
        />
      ) : (
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 xl:grid-cols-3">
          {filtered.map((p) => (
            <PlantCard
              key={p.id}
              plant={p}
              health={healthFor(p.id)}
              onWater={waterPlant}
              onEdit={setEditing}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      <PlantFormModal open={showAdd} onClose={() => setShowAdd(false)} />
      <PlantFormModal open={editing != null} onClose={() => setEditing(null)} editing={editing} />

      <Modal open={deleteTarget != null} onClose={() => setDeleteTarget(null)} title="Delete plant">
        <p className="text-sm leading-6 text-[var(--text2)]">
          Delete <span className="font-medium text-[var(--text)]">{deleteTarget?.name}</span>? Its readings,
          alerts and watering history will be removed from this browser.
        </p>
        <div className="mt-4 flex justify-end gap-2">
          <Button variant="ghost" onClick={() => setDeleteTarget(null)}>Cancel</Button>
          <Button
            variant="danger"
            onClick={() => {
              if (deleteTarget) deletePlant(deleteTarget.id);
              setDeleteTarget(null);
            }}
          >
            Delete plant
          </Button>
        </div>
      </Modal>
    </div>
  );
}
