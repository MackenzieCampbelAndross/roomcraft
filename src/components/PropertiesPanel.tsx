import React from 'react';
import { useDesignStore } from '../core/design_store';
import { MaterialType } from '../types';

export const PropertiesPanel: React.FC = () => {
  const {
    design,
    selectedItemId,
    selectItem,
    updateItem,
    removeItem,
    duplicateItem,
  } = useDesignStore();

  const selectedItem = design.items.find((it) => it.id === selectedItemId);

  if (!selectedItem) {
    return null;
  }

  const materialsList: MaterialType[] = [
    'HARDWOOD',
    'MARBLE',
    'CONCRETE',
    'TILES',
    'CARPET',
    'PLASTER',
    'GLASS',
  ];

  const rotationDegrees = Math.round((selectedItem.rotation[1] * 180) / Math.PI);

  return (
    <div className="absolute right-4 top-16 w-72 bg-slate-900/90 backdrop-blur-md border border-slate-800 rounded-2xl p-4 shadow-2xl z-20 text-slate-200 select-none space-y-4">
      {/* Title & Deselect */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-2">
        <div>
          <span className="text-[10px] uppercase font-bold text-sky-400 tracking-wider">
            {selectedItem.category}
          </span>
          <h3 className="text-sm font-bold text-slate-100 truncate max-w-[170px]">
            {selectedItem.name}
          </h3>
        </div>
        <button
          onClick={() => selectItem(null)}
          className="p-1 rounded text-slate-400 hover:text-white text-xs"
          title="Deselect"
        >
          ✕
        </button>
      </div>

      {/* Position Controls */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Position (Meters)
        </label>
        <div className="grid grid-cols-2 gap-2">
          <div>
            <span className="text-[10px] text-slate-500 font-mono">X Axis:</span>
            <input
              type="number"
              step="0.1"
              value={parseFloat(selectedItem.position[0].toFixed(2))}
              onChange={(e) =>
                updateItem(selectedItem.id, {
                  position: [parseFloat(e.target.value) || 0, selectedItem.position[1], selectedItem.position[2]],
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-200"
            />
          </div>
          <div>
            <span className="text-[10px] text-slate-500 font-mono">Z Axis:</span>
            <input
              type="number"
              step="0.1"
              value={parseFloat(selectedItem.position[2].toFixed(2))}
              onChange={(e) =>
                updateItem(selectedItem.id, {
                  position: [selectedItem.position[0], selectedItem.position[1], parseFloat(e.target.value) || 0],
                })
              }
              className="w-full bg-slate-950 border border-slate-800 rounded px-2 py-1 text-xs font-mono text-slate-200"
            />
          </div>
        </div>
      </div>

      {/* Rotation Control */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Rotation (Y)
          </span>
          <span className="font-mono text-sky-400 text-xs">{rotationDegrees}°</span>
        </div>
        <input
          type="range"
          min="0"
          max="360"
          step="5"
          value={rotationDegrees < 0 ? rotationDegrees + 360 : rotationDegrees}
          onChange={(e) => {
            const rad = (parseFloat(e.target.value) * Math.PI) / 180;
            updateItem(selectedItem.id, { rotation: [0, rad, 0] });
          }}
          className="w-full accent-sky-500 cursor-pointer"
        />
      </div>

      {/* Scale Control */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs">
          <span className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
            Scale Multiplier
          </span>
          <span className="font-mono text-sky-400 text-xs">{selectedItem.scale[0].toFixed(2)}x</span>
        </div>
        <input
          type="range"
          min="0.5"
          max="2.5"
          step="0.05"
          value={selectedItem.scale[0]}
          onChange={(e) => {
            const s = parseFloat(e.target.value);
            updateItem(selectedItem.id, { scale: [s, s, s] });
          }}
          className="w-full accent-sky-500 cursor-pointer"
        />
      </div>

      {/* Material and Color */}
      <div className="space-y-2">
        <label className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider">
          Color & Material Finish
        </label>
        <div className="flex items-center space-x-2">
          <input
            type="color"
            value={selectedItem.color}
            onChange={(e) => updateItem(selectedItem.id, { color: e.target.value })}
            className="w-8 h-8 rounded-lg cursor-pointer bg-transparent border-0"
          />
          <select
            value={selectedItem.material}
            onChange={(e) => updateItem(selectedItem.id, { material: e.target.value as MaterialType })}
            className="flex-1 bg-slate-950 border border-slate-800 rounded px-2 py-1.5 text-xs text-slate-200"
          >
            {materialsList.map((m) => (
              <option key={m} value={m}>
                {m}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Actions: Duplicate, Delete */}
      <div className="flex items-center space-x-2 pt-2 border-t border-slate-800">
        <button
          onClick={() => duplicateItem(selectedItem.id)}
          className="flex-1 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-all"
        >
          📋 Duplicate
        </button>
        <button
          onClick={() => removeItem(selectedItem.id)}
          className="py-1.5 px-3 rounded-lg bg-rose-600/20 hover:bg-rose-600/30 text-rose-400 border border-rose-500/30 text-xs font-medium transition-all"
        >
          🗑️ Delete
        </button>
      </div>
    </div>
  );
};
