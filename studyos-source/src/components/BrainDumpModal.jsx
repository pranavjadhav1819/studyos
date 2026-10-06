import { useState, useEffect } from 'react';
import { localDB } from '../lib/dataStore';

export default function BrainDumpModal({ isOpen, onClose }) {
  const [items, setItems] = useState([]);
  const [text, setText] = useState('');

  useEffect(() => {
    if (isOpen) {
      setItems(localDB.getBrainDumps());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  function handleAdd(e) {
    e.preventDefault();
    if (!text.trim()) return;
    const newItem = {
      id: `bd-${Date.now()}`,
      text: text.trim(),
      created_at: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      done: false,
    };
    const updated = [newItem, ...items];
    setItems(updated);
    localDB.saveBrainDumps(updated);
    localDB.addXP(5);
    setText('');
  }

  function handleToggle(id) {
    const updated = items.map((i) => (i.id === id ? { ...i, done: !i.done } : i));
    setItems(updated);
    localDB.saveBrainDumps(updated);
  }

  function handleRemove(id) {
    const updated = items.filter((i) => i.id !== id);
    setItems(updated);
    localDB.saveBrainDumps(updated);
  }

  return (
    <div className="adhd-modal-backdrop" onClick={onClose}>
      <div className="adhd-modal" onClick={(e) => e.stopPropagation()}>
        <div className="adhd-modal-header">
          <div className="adhd-badge-pill">🧠 Distraction Parking Lot</div>
          <h2>ADHD Mind Dump</h2>
          <p className="adhd-modal-sub">
            Got an intrusive thought, sudden chore, or random rabbit hole? <strong>Park it here</strong> so your brain lets it go, then get straight back to your study sprint.
          </p>
        </div>

        <form onSubmit={handleAdd} style={{ marginBottom: 16 }}>
          <div style={{ display: 'flex', gap: 8 }}>
            <input
              type="text"
              autoFocus
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="e.g. Look up movie tickets, reply to Rahul, check laundry..."
              style={{ flex: 1 }}
            />
            <button type="submit" className="btn btn-primary-adhd" disabled={!text.trim()}>
              Park Thought
            </button>
          </div>
        </form>

        <div className="adhd-braindump-list">
          {items.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '24px 0', color: 'var(--paper-faint)', fontSize: 13 }}>
              Your parking lot is clear. If a distraction pops into your head, write it down here so you don't lose focus!
            </div>
          ) : (
            items.map((item) => (
              <div key={item.id} className={`adhd-dump-item ${item.done ? 'done' : ''}`}>
                <input
                  type="checkbox"
                  checked={item.done}
                  onChange={() => handleToggle(item.id)}
                  style={{ accentColor: 'var(--amber)', cursor: 'pointer' }}
                />
                <span className="adhd-dump-text">{item.text}</span>
                <span className="adhd-dump-time">{item.created_at}</span>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="btn btn-ghost btn-sm"
                  style={{ padding: '2px 6px', fontSize: 11 }}
                >
                  ✕
                </button>
              </div>
            ))
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: 16, borderTop: '1px solid var(--rule)', paddingTop: 12 }}>
          <span style={{ fontSize: 11, color: 'var(--paper-faint)' }}>
            +5 XP per parked thought · Safe to inspect after your study block!
          </span>
          <button className="btn" onClick={onClose}>
            Back to Studying
          </button>
        </div>
      </div>
    </div>
  );
}
