export type VisibilityCallback = (isVisible: boolean) => void;

export class CanvasLifecycleTracker {
  private observer: IntersectionObserver;
  private trackedElements = new Map<Element, { isIntersecting: boolean; onVisibilityChange: VisibilityCallback }>();
  private isDocumentVisible = !document.hidden;

  constructor() {
    this.observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          const item = this.trackedElements.get(entry.target);
          if (item) {
            item.isIntersecting = entry.isIntersecting;
            item.onVisibilityChange(this.isDocumentVisible && entry.isIntersecting);
          }
        }
      },
      { threshold: 0 },
    );

    document.addEventListener('visibilitychange', () => {
      this.isDocumentVisible = !document.hidden;
      for (const item of this.trackedElements.values()) {
        item.onVisibilityChange(this.isDocumentVisible && item.isIntersecting);
      }
    });
  }

  observe(element: Element, onVisibilityChange: VisibilityCallback): () => void {
    this.trackedElements.set(element, {
      isIntersecting: true,
      onVisibilityChange,
    });
    this.observer.observe(element);

    return () => {
      this.observer.unobserve(element);
      this.trackedElements.delete(element);
    };
  }
}
