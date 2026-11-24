import React, { useState } from 'react';
import { useDesignStore } from '../core/design_store';
import { CameraMode, TransformTool } from '../types';
import { ExportService } from '../core/export_service';

interface ToolbarProps {
  onOpenExport: () => void;
}

export const Toolbar: React.FC<ToolbarProps> = ({ onOpenExport }) => {
  const {
    design,
    cameraMode,
    activeTool,
    setCameraMode,
    setActiveTool,
    saveCurrentDesign,
    resetRoom,
  } = useDesignStore();

  const [saveToast, setSaveToast] = useState(false);

  const handleSave = () => {
    saveCurrentDesign();
    setSaveToast(true);
    setTimeout(() => setSaveToast(false), 2500);
  };

  const handleSnapshot = () => {
    const canvas = document.querySelector('canvas');
    if (canvas) {
      ExportService.downloadScreenshot(canvas, `${design.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_render.png`);
    }
  };

  return (
    <header className="h-14 bg-slate-900 border-b border-slate-800 px-4 flex items-center justify-between z-20 select-none">
      {/* Brand & Room Title */}
      <div className="flex items-center space-x-3">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-sky-500 to-indigo-600 flex items-center justify-center text-lg shadow-md shadow-sky-500/20">
          🏡
        </div>
        <div>
          <span className="font-extrabold text-sm tracking-tight bg-gradient-to-r from-sky-400 to-indigo-300 bg-clip-text text-transparent">
            ROOMCRAFT 3D
          </span>
          <span className="text-slate-500 text-xs ml-2 font-mono">v1.0.0</span>
        </div>
      </div>

      {/* Tool & Camera Selectors */}
      <div className="flex items-center space-x-4">
        {/* Transform Tools */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          {(['SELECT', 'MOVE', 'ROTATE'] as TransformTool[]).map((tool) => (
            <button
              key={tool}
              onClick={() => setActiveTool(tool)}
              className={`px-3 py-1 rounded font-medium transition-all ${
                activeTool === tool
                  ? 'bg-sky-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {tool === 'SELECT' ? '👆 Select' : tool === 'MOVE' ? '↔️ Move' : '🔄 Rotate'}
            </button>
          ))}
        </div>

        {/* Camera Modes */}
        <div className="flex items-center bg-slate-950 p-1 rounded-lg border border-slate-800 text-xs">
          {(['PERSPECTIVE', 'TOP_DOWN', 'ISOMETRIC'] as CameraMode[]).map((mode) => (
            <button
              key={mode}
              onClick={() => setCameraMode(mode)}
              className={`px-3 py-1 rounded font-medium transition-all ${
                cameraMode === mode
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800'
              }`}
            >
              {mode === 'PERSPECTIVE' ? '🌐 Orbit' : mode === 'TOP_DOWN' ? '📐 2D Top' : '📦 Iso'}
            </button>
          ))}
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center space-x-2">
        {saveToast && (
          <span className="text-xs text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded">
            Saved to Local Library!
          </span>
        )}

        <button
          onClick={handleSnapshot}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-sky-400 text-xs font-medium border border-slate-700 transition-all flex items-center space-x-1"
          title="Take 3D Snapshot"
        >
          <span>📸</span>
          <span className="hidden sm:inline">Render</span>
        </button>

        <button
          onClick={handleSave}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium border border-slate-700 transition-all flex items-center space-x-1"
        >
          <span>💾</span>
          <span className="hidden sm:inline">Save</span>
        </button>

        <button
          onClick={onOpenExport}
          className="px-3 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium shadow-md shadow-indigo-600/20 transition-all flex items-center space-x-1"
        >
          <span>📤</span>
          <span>Export</span>
        </button>

        <button
          onClick={resetRoom}
          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-slate-800 text-xs transition-colors"
          title="Reset Room"
        >
          🔄
        </button>
      </div>
    </header>
  );
};
