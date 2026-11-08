/**
 * Cached Intl.NumberFormat instances to avoid repeated instantiation overhead.
 *
 * In V8/JavaScript runtimes, Number.prototype.toLocaleString() creates an internal
 * Intl.NumberFormat object on every invocation. In React render loops, lists, and server routes,
 * caching formatter instances at module scope eliminates constructor allocations and GC churn.
 */

const esArNumberFormatter = new Intl.NumberFormat("es-AR");

/**
 * Format a number using Argentine Spanish locale conventions ("es-AR").
 */
export function formatNumber(val: number): string {
  return esArNumberFormatter.format(val);
}
