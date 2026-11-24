import { describe, it, expect } from 'vitest';
import { ExportService } from '../src/core/export_service';
import { createInitialDesign } from '../src/core/design_store';

describe('ExportService', () => {
  const design = createInitialDesign('Penthouse Suite');

  it('serializes and parses RoomCraft project JSON', () => {
    const jsonStr = ExportService.exportDesignJSON(design);
    expect(jsonStr).toContain('Penthouse Suite');
    expect(jsonStr).toContain('dimensions');

    const parsed = ExportService.parseDesignJSON(jsonStr);
    expect(parsed.id).toBe(design.id);
    expect(parsed.name).toBe('Penthouse Suite');
    expect(parsed.items.length).toBe(design.items.length);
  });

  it('throws error when parsing corrupted or non-roomcraft JSON', () => {
    expect(() => ExportService.parseDesignJSON('{}')).toThrow();
    expect(() => ExportService.parseDesignJSON('{"name":"bad"}')).toThrow();
  });

  it('generates structured Markdown bill of materials with spatial calculations', () => {
    const bom = ExportService.generateBillOfMaterials(design);
    expect(bom).toContain('# RoomCraft Specification & Bill of Materials');
    expect(bom).toContain('**Project:** Penthouse Suite');
    expect(bom).toContain('Total Floor Area:');
    expect(bom).toContain('| # | Item Name | Category |');
    expect(bom).toContain('Modern 3-Seater Sofa');
  });
});
