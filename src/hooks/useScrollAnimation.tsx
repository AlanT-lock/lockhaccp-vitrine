import { useEffect, useRef, useState } from "react";

interface UseScrollAnimationOptions {
  threshold?: number;
  rootMargin?: string;
  triggerOnce?: boolean;
}

/**
 * Fait apparaître un bloc quand il entre à l'écran.
 * Visible par défaut (HTML pré-généré, robots, premier affichage) : seuls les blocs
 * situés SOUS l'écran au chargement sont masqués puis animés à leur arrivée. Le haut
 * de page n'attend donc jamais le JavaScript pour s'afficher (meilleur LCP).
 */
export const useScrollAnimation = (options: UseScrollAnimationOptions = {}) => {
  const { threshold = 0.1, rootMargin = "0px", triggerOnce = true } = options;
  const ref = useRef<HTMLDivElement>(null);
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    const element = ref.current;
    if (!element) return;

    const dejaALEcran = element.getBoundingClientRect().top < window.innerHeight;
    if (dejaALEcran && triggerOnce) return;
    if (!dejaALEcran) setIsVisible(false);

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          if (triggerOnce) {
            observer.unobserve(element);
          }
        } else if (!triggerOnce) {
          setIsVisible(false);
        }
      },
      { threshold, rootMargin }
    );

    observer.observe(element);

    return () => observer.disconnect();
  }, [threshold, rootMargin, triggerOnce]);

  return { ref, isVisible };
};

export default useScrollAnimation;
