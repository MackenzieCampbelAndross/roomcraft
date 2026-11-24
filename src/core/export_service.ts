import { RoomDesign } from '../types';
import { RoomBuilder } from './room_builder';

export class ExportService {
  static exportDesignJSON(design: RoomDesign): string {
    return JSON.stringify(design, null, 2);
  }

  static parseDesignJSON(jsonString: string): RoomDesign {
    const parsed = JSON.parse(jsonString);
    if (!parsed.id || !parsed.dimensions || !parsed.items) {
      throw new Error('Invalid RoomCraft project format: missing essential properties.');
    }
    return parsed as RoomDesign;
  }

  static generateBillOfMaterials(design: RoomDesign): string {
    const metrics = RoomBuilder.calculateMetrics(design.dimensions, design.items);

    let doc = `# RoomCraft Specification & Bill of Materials\n\n`;
    doc += `**Project:** ${design.name}\n`;
    doc += `**Last Modified:** ${new Date(design.updatedAt).toLocaleDateString()}\n\n`;

    doc += `## 1. Spatial Dimensions\n`;
    doc += `- **Width (X):** ${design.dimensions.width} m\n`;
    doc += `- **Length (Z):** ${design.dimensions.length} m\n`;
    doc += `- **Ceiling Height (Y):** ${design.dimensions.height} m\n`;
    doc += `- **Total Floor Area:** ${metrics.floorAreaSqMeters} m²\n`;
    doc += `- **Gross Wall Surface:** ${metrics.wallSurfaceSqMeters} m²\n\n`;

    doc += `## 2. Finishes & Surfaces\n`;
    doc += `- **Floor Material:** ${design.floorMaterial.textureType} (${design.floorMaterial.color})\n`;
    doc += `- **Wall Finish:** ${design.wallMaterial.textureType} (${design.wallMaterial.color})\n`;
    doc += `- **Lighting Ambience:** ${design.lighting.preset}\n\n`;

    doc += `## 3. Placed Furniture Inventory (${metrics.totalItems} Items)\n\n`;
    doc += `| # | Item Name | Category | Model Type | Color | Position (X, Y, Z) |\n`;
    doc += `|---|-----------|----------|------------|-------|--------------------|\n`;

    design.items.forEach((item, idx) => {
      const posStr = `${item.position[0].toFixed(2)}, ${item.position[1].toFixed(2)}, ${item.position[2].toFixed(2)}`;
      doc += `| ${idx + 1} | ${item.name} | ${item.category} | ${item.modelType} | ${item.color} | ${posStr} |\n`;
    });

    return doc;
  }

  static downloadScreenshot(canvas: HTMLCanvasElement, filename = 'roomcraft_design.png'): string {
    const dataUrl = canvas.toDataURL('image/png');
    if (typeof window !== 'undefined') {
      const link = window.document.createElement('a');
      link.href = dataUrl;
      link.download = filename;
      window.document.body.appendChild(link);
      link.click();
      window.document.body.removeChild(link);
    }
    return dataUrl;
  }
}
