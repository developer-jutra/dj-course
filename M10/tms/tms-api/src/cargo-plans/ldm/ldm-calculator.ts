import { PalletUnit } from '../pallets/pallet-unit';
import type { PalletLoadableTrailerSpec } from '../trailers';

/**
 * Domain Service for calculating LDM.
 */
export class LdmCalculator {
  public static calculate(units: PalletUnit[], trailer: PalletLoadableTrailerSpec): number {
    if (units.length === 0) return 0;

    const sortedUnits = [...units].sort((a, b) => b.spec.length - a.spec.length);
    const rows: PalletUnit[][] = [[]];

    for (const unit of sortedUnits) {
      let placed = false;
      for (const row of rows) {
        const rowWidth = row.reduce((sum, u) => sum + u.spec.width, 0);
        if (rowWidth + unit.spec.width <= trailer.widthMm) {
          row.push(unit);
          placed = true;
          break;
        }
      }
      if (!placed) rows.push([unit]);
    }

    const totalLdmMm = rows.reduce((acc, row) => {
      if (row.length === 0) return acc;
      const maxDepthInRow = Math.max(...row.map(u => u.spec.length));
      return acc + maxDepthInRow;
    }, 0);

    return Number((totalLdmMm / 1000).toFixed(2));
  }
}
