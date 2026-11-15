import { useEffect, useState, useRef, RefObject } from 'react';

interface ParallaxOptions {
  speed?: number;
  direction?: 'up' | 'down';
  scale?: boolean;
  scaleRange?: [number, number];
  opacity?: boolean;
  opacityRange?: [number, number];
  rotate?: boolean;
  rotateRange?: [number, number];
}

interface ParallaxResult {
  ref: RefObject<HTMLDivElement>;
  style: React.CSSProperties;
}

export const useParallax = ({
  speed = 0.5,
  direction = 'up',
  scale = false,
  scaleRange = [0.95, 1.05],
  opacity = false,
  opacityRange = [0.5, 1],
  rotate = false,
  rotateRange = [-5, 5],
}: ParallaxOptions = {}): ParallaxResult => {
  const ref = useRef<HTMLDivElement>(null);
  const [style, setStyle] = useState<React.CSSProperties>({});
  // Les plages arrivent souvent en tableaux littéraux (ou valeurs par défaut), recréés à chaque
  // rendu : on ne garde que leurs bornes, des nombres, dans les dépendances de l'effet.
  // Sinon l'effet se relançait après chaque rendu et appelait setStyle : boucle de rendus
  // infinie, qui empêchait aussi React de finir d'hydrater (bandeau cookies absent).
  const [scaleMin, scaleMax] = scaleRange;
  const [opacityMin, opacityMax] = opacityRange;
  const [rotateMin, rotateMax] = rotateRange;

  useEffect(() => {
    const handleScroll = () => {
      if (!ref.current) return;

      const rect = ref.current.getBoundingClientRect();
      const windowHeight = window.innerHeight;
      
      // Calculate how far the element is from the center of the viewport
      const elementCenter = rect.top + rect.height / 2;
      const viewportCenter = windowHeight / 2;
      const distanceFromCenter = elementCenter - viewportCenter;
      
      // Normalize the distance (-1 to 1 range, where 0 is center)
      const normalizedDistance = distanceFromCenter / windowHeight;
      
      // Calculate parallax offset
      const offset = normalizedDistance * speed * 100;
      const translateY = direction === 'up' ? -offset : offset;

      // Calculate scale if enabled
      let scaleValue = 1;
      if (scale) {
        const progress = 1 - Math.abs(normalizedDistance);
        scaleValue = scaleMin + (scaleMax - scaleMin) * progress;
      }

      // Calculate opacity if enabled
      let opacityValue = 1;
      if (opacity) {
        const progress = 1 - Math.abs(normalizedDistance);
        opacityValue = opacityMin + (opacityMax - opacityMin) * progress;
      }

      // Calculate rotation if enabled
      let rotateValue = 0;
      if (rotate) {
        rotateValue = rotateMin + (rotateMax - rotateMin) * (0.5 + normalizedDistance * 0.5);
      }

      const transform = `translateY(${translateY}px) scale(${scaleValue}) rotate(${rotateValue}deg)`;
      // Même rendu qu'avant : on garde l'objet existant, React n'a rien à redessiner.
      setStyle((avant) =>
        avant.transform === transform && avant.opacity === opacityValue
          ? avant
          : {
              transform,
              opacity: opacityValue,
              transition: 'transform 0.1s ease-out, opacity 0.1s ease-out',
            },
      );
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // Initial call

    return () => window.removeEventListener('scroll', handleScroll);
  }, [speed, direction, scale, scaleMin, scaleMax, opacity, opacityMin, opacityMax, rotate, rotateMin, rotateMax]);

  return { ref, style };
};

// Hook for layered parallax effect
export const useLayeredParallax = (layerCount: number = 3) => {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const handleScroll = () => {
      setScrollY(window.scrollY);
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const getLayerStyle = (layerIndex: number): React.CSSProperties => {
    const speed = (layerIndex + 1) / layerCount;
    return {
      transform: `translateY(${scrollY * speed * 0.1}px)`,
      transition: 'transform 0.05s linear',
    };
  };

  return { scrollY, getLayerStyle };
};
