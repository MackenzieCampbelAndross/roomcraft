import React, { useState } from 'react';
import { useDesignStore } from '../core/design_store';
import { FURNITURE_CATALOG, CatalogTemplate } from '../core/catalog';
import { MaterialType, LightPreset } from '../types';
import { RoomBuilder } from '../core/room_builder';

export const Sidebar: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'CATALOG' | 'DIMENSIONS' | 'SURFACES' | 'LIGHTING'>('CATALOG');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');

  const {
    design,
    setDimensions,
    setWallMaterial,
    setFloorMaterial,
    setLightingPreset,
    addItem,
  } = useDesignStore();

  const metrics = RoomBuilder.calculateMetrics(design.dimensions, design.items);

  const filteredCatalog = selectedCategory === 'ALL'
    ? FURNITURE_CATALOG
    : FURNITURE_CATALOG.filter((item) => item.category === selectedCategory);

  const materialsList: MaterialType[] = [
    'HARDWOOD',
    'MARBLE',
    'CONCRETE',
    'TILES',
    'CARPET',
    'PLASTER',
    'BRICK',
    'GLASS',
  ];

  const presetsList: Array<{ id: LightPreset; label: string; icon: string }> = [
    { id: 'DAYLIGHT', label: 'Crisp Daylight', icon: '☀️' },
    { id: 'WARM_SUNSET', label: 'Golden Sunset', icon: '🌅' },
    { id: 'STUDIO', label: 'Clean Studio', icon: '💡' },
    { id: 'CYBER_NEON', label: 'Cyberpunk Neon', icon: '🔮' },
    { id: 'COZY_NIGHT', label: 'Cozy Evening', icon: '🌙' },
  ];

  return (
    <aside className="w-80 bg-slate-900 border-r border-slate-800 flex flex-col h-[calc(100vh-56px)] select-none z-10">
      {/* Tab Switcher */}
      <div className="grid grid-cols-4 border-b border-slate-800 bg-slate-950 p-1 gap-1 text-[11px] font-semibold text-slate-400">
        <button
          onClick={() => setActiveTab('CATALOG')}
          className={`py-2 rounded-lg text-center transition-all ${
            activeTab === 'CATALOG' ? 'bg-slate-800 text-sky-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          🛋️ Items
        </button>
        <button
          onClick={() => setActiveTab('DIMENSIONS')}
          className={`py-2 rounded-lg text-center transition-all ${
            activeTab === 'DIMENSIONS' ? 'bg-slate-800 text-sky-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          📐 Size
        </button>
        <button
          onClick={() => setActiveTab('SURFACES')}
          className={`py-2 rounded-lg text-center transition-all ${
            activeTab === 'SURFACES' ? 'bg-slate-800 text-sky-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          🎨 Walls
        </button>
        <button
          onClick={() => setActiveTab('LIGHTING')}
          className={`py-2 rounded-lg text-center transition-all ${
            activeTab === 'LIGHTING' ? 'bg-slate-800 text-sky-400 font-bold' : 'hover:text-slate-200'
          }`}
        >
          💡 Light
        </button>
      </div>

      {/* Tab Content */}
      <div className="flex-1 overflow-y-auto p-4">
        {activeTab === 'CATALOG' && (
          <div className="space-y-4">
            {/* Category Filter */}
            <div className="flex flex-wrap gap-1">
              {['ALL', 'SEATING', 'TABLES', 'BEDS', 'STORAGE', 'LIGHTING', 'DECOR'].map((cat) => (
                <button
                  key={cat}
                  onClick={() => setSelectedCategory(cat)}
                  className={`px-2 py-1 rounded text-[10px] font-medium transition-all ${
                    selectedCategory === cat
                      ? 'bg-sky-600 text-white'
                      : 'bg-slate-800/80 text-slate-400 hover:text-slate-200'
                  }`}
                >
                  {cat}
                </button>
              ))}
            </div>

            {/* Catalog Items */}
            <div className="grid grid-cols-1 gap-2.5">
              {filteredCatalog.map((item: CatalogTemplate) => (
                <div
                  key={item.name}
                  onClick={() => addItem(item)}
                  className="p-3 rounded-xl bg-slate-950/60 border border-slate-800 hover:border-sky-500/50 hover:bg-slate-800/40 cursor-pointer transition-all flex items-center justify-between group"
                >
                  <div>
                    <h4 className="text-xs font-semibold text-slate-200 group-hover:text-sky-400 transition-colors">
                      {item.name}
                    </h4>
                    <p className="text-[10px] text-slate-400">
                      {item.dimensions.width}m × {item.dimensions.depth}m • {item.defaultMaterial}
                    </p>
                  </div>
                  <span className="w-6 h-6 rounded-lg bg-slate-800 group-hover:bg-sky-600 text-slate-300 group-hover:text-white flex items-center justify-center text-xs transition-colors">
                    +
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'DIMENSIONS' && (
          <div className="space-y-5">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                Room Dimensions
              </h3>
              <p className="text-[11px] text-slate-400">
                Adjust the spatial boundary and perimeter walls of the room.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Width (X-Axis)</span>
                  <span className="font-mono text-sky-400">{design.dimensions.width} m</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="14.0"
                  step="0.5"
                  value={design.dimensions.width}
                  onChange={(e) => setDimensions({ width: parseFloat(e.target.value) })}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Length (Z-Axis)</span>
                  <span className="font-mono text-sky-400">{design.dimensions.length} m</span>
                </div>
                <input
                  type="range"
                  min="3.0"
                  max="14.0"
                  step="0.5"
                  value={design.dimensions.length}
                  onChange={(e) => setDimensions({ length: parseFloat(e.target.value) })}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>

              <div>
                <div className="flex justify-between text-xs font-medium text-slate-300 mb-1">
                  <span>Ceiling Height (Y-Axis)</span>
                  <span className="font-mono text-sky-400">{design.dimensions.height} m</span>
                </div>
                <input
                  type="range"
                  min="2.2"
                  max="4.5"
                  step="0.1"
                  value={design.dimensions.height}
                  onChange={(e) => setDimensions({ height: parseFloat(e.target.value) })}
                  className="w-full accent-sky-500 cursor-pointer"
                />
              </div>
            </div>

            {/* Metrics card */}
            <div className="p-3.5 bg-slate-950 border border-slate-800 rounded-xl space-y-2">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Spatial Computations
              </span>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Floor Surface Area:</span>
                <span className="font-mono font-bold text-sky-400">{metrics.floorAreaSqMeters} m²</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Gross Wall Surface:</span>
                <span className="font-mono font-bold text-sky-400">{metrics.wallSurfaceSqMeters} m²</span>
              </div>
              <div className="flex justify-between text-xs text-slate-300">
                <span>Total Items:</span>
                <span className="font-mono font-bold text-sky-400">{metrics.totalItems}</span>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'SURFACES' && (
          <div className="space-y-6">
            {/* Floor Surface */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Floor Finish & Material
              </h4>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={design.floorMaterial.color}
                  onChange={(e) => setFloorMaterial({ color: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-slate-300">{design.floorMaterial.color}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {materialsList.map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setFloorMaterial({ textureType: mat })}
                    className={`p-2 rounded-lg text-[11px] font-medium border text-left transition-all ${
                      design.floorMaterial.textureType === mat
                        ? 'bg-sky-600/20 border-sky-500 text-sky-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>

            {/* Wall Surface */}
            <div className="space-y-3 pt-4 border-t border-slate-800">
              <h4 className="text-xs font-bold text-slate-200 uppercase tracking-wider">
                Wall Finish & Material
              </h4>
              <div className="flex items-center space-x-3">
                <input
                  type="color"
                  value={design.wallMaterial.color}
                  onChange={(e) => setWallMaterial({ color: e.target.value })}
                  className="w-10 h-10 rounded-lg cursor-pointer bg-transparent border-0"
                />
                <span className="text-xs font-mono text-slate-300">{design.wallMaterial.color}</span>
              </div>
              <div className="grid grid-cols-2 gap-1.5">
                {materialsList.map((mat) => (
                  <button
                    key={mat}
                    onClick={() => setWallMaterial({ textureType: mat })}
                    className={`p-2 rounded-lg text-[11px] font-medium border text-left transition-all ${
                      design.wallMaterial.textureType === mat
                        ? 'bg-sky-600/20 border-sky-500 text-sky-300'
                        : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    {mat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'LIGHTING' && (
          <div className="space-y-4">
            <div>
              <h3 className="text-xs font-bold text-slate-200 uppercase tracking-wider mb-1">
                Lighting & Ambiance
              </h3>
              <p className="text-[11px] text-slate-400">
                Preset environmental atmospheres and directional solar shadows.
              </p>
            </div>

            <div className="space-y-2">
              {presetsList.map((preset) => (
                <div
                  key={preset.id}
                  onClick={() => setLightingPreset(preset.id)}
                  className={`p-3 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                    design.lighting.preset === preset.id
                      ? 'bg-indigo-600/20 border-indigo-500 text-indigo-200'
                      : 'bg-slate-950/60 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                  }`}
                >
                  <div className="flex items-center space-x-3">
                    <span className="text-lg">{preset.icon}</span>
                    <span className="text-xs font-semibold">{preset.label}</span>
                  </div>
                  {design.lighting.preset === preset.id && (
                    <span className="text-xs text-indigo-400 font-bold">✓ Active</span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </aside>
  );
};
