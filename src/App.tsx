import React, { useState } from 'react';
import { Toolbar } from './components/Toolbar';
import { Sidebar } from './components/Sidebar';
import { Viewport3D } from './components/Viewport3D';
import { PropertiesPanel } from './components/PropertiesPanel';
import { ExportModal } from './components/ExportModal';

export const App: React.FC = () => {
  const [isExportOpen, setIsExportOpen] = useState(false);

  return (
    <div className="flex flex-col h-screen w-screen overflow-hidden bg-slate-950 text-slate-100 font-sans select-none">
      <Toolbar onOpenExport={() => setIsExportOpen(true)} />

      <div className="flex-1 flex overflow-hidden relative">
        <Sidebar />

        <main className="flex-1 relative overflow-hidden bg-slate-950">
          <Viewport3D />
          <PropertiesPanel />
        </main>
      </div>

      <ExportModal
        isOpen={isExportOpen}
        onClose={() => setIsExportOpen(false)}
      />
    </div>
  );
};

export default App;
