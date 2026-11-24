import React, { useState } from 'react';
import { useDesignStore } from '../core/design_store';
import { ExportService } from '../core/export_service';

interface ExportModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ExportModal: React.FC<ExportModalProps> = ({ isOpen, onClose }) => {
  const { design, loadDesign } = useDesignStore();
  const [activeTab, setActiveTab] = useState<'BOM' | 'JSON' | 'RENDER'>('BOM');
  const [copied, setCopied] = useState(false);
  const [importJsonText, setImportJsonText] = useState('');
  const [importError, setImportError] = useState<string | null>(null);

  if (!isOpen) return null;

  const bomText = ExportService.generateBillOfMaterials(design);
  const jsonText = ExportService.exportDesignJSON(design);

  const handleDownloadJSON = () => {
    const blob = new Blob([jsonText], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${design.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}.roomcraft.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleDownloadBOM = () => {
    const blob = new Blob([bomText], { type: 'text/markdown' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${design.name.toLowerCase().replace(/[^a-z0-9]/g, '_')}_spec.md`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleCopyBOM = () => {
    navigator.clipboard.writeText(bomText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleImportJSON = () => {
    try {
      setImportError(null);
      const parsed = ExportService.parseDesignJSON(importJsonText);
      loadDesign(parsed);
      onClose();
    } catch (err: any) {
      setImportError(err.message || 'Invalid JSON format');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl w-full max-w-2xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-xl">📦</span>
            <h3 className="text-base font-bold text-slate-100">Project Export & Specification</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded text-slate-400 hover:text-white">
            ✕
          </button>
        </div>

        {/* Tab Switcher */}
        <div className="flex border-b border-slate-800 bg-slate-950 px-6 gap-4 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('BOM')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'BOM'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            📋 Bill of Materials
          </button>
          <button
            onClick={() => setActiveTab('JSON')}
            className={`py-3 border-b-2 transition-all ${
              activeTab === 'JSON'
                ? 'border-sky-500 text-sky-400'
                : 'border-transparent text-slate-400 hover:text-slate-200'
            }`}
          >
            💾 RoomCraft Project JSON
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6">
          {activeTab === 'BOM' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Formatted architectural summary and furniture schedule:
                </span>
                <div className="flex space-x-2">
                  <button
                    onClick={handleCopyBOM}
                    className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-300 font-medium"
                  >
                    {copied ? '✓ Copied' : 'Copy'}
                  </button>
                  <button
                    onClick={handleDownloadBOM}
                    className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs text-white font-medium shadow-sm"
                  >
                    Download .MD
                  </button>
                </div>
              </div>

              <pre className="bg-slate-950 border border-slate-800 p-4 rounded-xl text-xs font-mono text-slate-300 whitespace-pre-wrap max-h-80 overflow-y-auto">
                {bomText}
              </pre>
            </div>
          )}

          {activeTab === 'JSON' && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400">
                  Full serializable 3D layout state (.roomcraft.json):
                </span>
                <button
                  onClick={handleDownloadJSON}
                  className="px-3 py-1.5 rounded-lg bg-sky-600 hover:bg-sky-500 text-xs text-white font-medium shadow-sm"
                >
                  Download Project File
                </button>
              </div>

              <textarea
                readOnly
                value={jsonText}
                className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs font-mono text-slate-300 h-40 outline-none resize-none"
              />

              <div className="pt-4 border-t border-slate-800 space-y-2">
                <h4 className="text-xs font-semibold text-slate-200">Import Existing Project:</h4>
                <textarea
                  value={importJsonText}
                  onChange={(e) => setImportJsonText(e.target.value)}
                  placeholder="Paste RoomCraft JSON here..."
                  className="w-full bg-slate-950 border border-slate-800 p-3 rounded-xl text-xs font-mono text-slate-300 h-24 outline-none focus:border-sky-500"
                />
                {importError && (
                  <p className="text-xs text-rose-400 font-semibold">{importError}</p>
                )}
                <button
                  onClick={handleImportJSON}
                  disabled={!importJsonText.trim()}
                  className="px-4 py-2 rounded-lg bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-medium disabled:opacity-50"
                >
                  Load Project
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
