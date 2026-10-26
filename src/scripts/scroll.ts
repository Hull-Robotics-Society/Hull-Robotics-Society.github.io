/**
 * Smooth-scroll to a page offset, jumping instead if the browser skipped the animation.
 *
 * Parameters:
 *     top: target scroll position in px
 */
export function scrollToY(top: number): void {
    const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;
    const start = scrollY;
    window.scrollTo({ top, behavior: reduce ? 'auto' : 'smooth' });
    setTimeout(() => {
        if (Math.abs(scrollY - start) < 2 && Math.abs(top - start) > 2) window.scrollTo({ top, behavior: 'instant' });
    }, 450);
}
