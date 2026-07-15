'use client';

import { useCallback, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { cn } from '@/lib/utils';

const DEFAULT_COLORS = ['#d8eef2', '#a9dce5', '#69c4d3', '#28aec3', '#167fab', '#084299'];

function hexToRgb(hex) {
  const value = hex.replace('#', '');
  return [
    Number.parseInt(value.slice(0, 2), 16),
    Number.parseInt(value.slice(2, 4), 16),
    Number.parseInt(value.slice(4, 6), 16),
  ];
}

function useBlinkingSquares(canvasRef, config) {
  const squaresRef = useRef([]);
  const frameRef = useRef(null);
  const visibleRef = useRef(true);
  const configRef = useRef(config);

  useEffect(() => {
    configRef.current = config;
  }, [config]);

  const build = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const {
      direction,
      fadeStart,
      fadeEnd,
      falloff,
      gridSize,
      minBrightness,
      squareColors,
    } = configRef.current;
    const width = canvas._cssWidth || canvas.offsetWidth || 800;
    const height = canvas._cssHeight || canvas.offsetHeight || 450;
    const columns = Math.ceil(width / gridSize) + 1;
    const rows = Math.ceil(height / gridSize) + 1;
    const palette = squareColors.map(hexToRgb);
    const squares = [];

    for (let row = 0; row < rows; row += 1) {
      for (let column = 0; column < columns; column += 1) {
        const normalizedX = columns > 1 ? column / (columns - 1) : 0;
        const normalizedY = rows > 1 ? row / (rows - 1) : 0;
        const progress =
          direction === 'right'
            ? normalizedX
            : direction === 'left'
              ? 1 - normalizedX
              : direction === 'bottom'
                ? normalizedY
                : 1 - normalizedY;
        const rawDensity = (progress - fadeStart) / Math.max(fadeEnd - fadeStart, 0.001);
        const density = Math.pow(Math.max(0, Math.min(1, rawDensity)), falloff);

        if (Math.random() > density) continue;

        const level = Math.min(palette.length - 1, Math.floor(Math.random() * palette.length));
        squares.push({
          x: column * gridSize,
          y: row * gridSize,
          brightness: minBrightness + Math.random() * (1 - minBrightness),
          phase: Math.random() * Math.PI * 2,
          rgb: palette[level],
        });
      }
    }

    squaresRef.current = squares;
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const applySize = () => {
      const ratio = Math.min(window.devicePixelRatio || 1, configRef.current.dpr);
      const width = canvas.offsetWidth || 800;
      const height = canvas.offsetHeight || 450;
      canvas.width = Math.round(width * ratio);
      canvas.height = Math.round(height * ratio);
      canvas._cssWidth = width;
      canvas._cssHeight = height;
      canvas.getContext('2d', { alpha: true }).setTransform(ratio, 0, 0, ratio, 0, 0);
      build();
    };

    applySize();
    const resizeObserver = new ResizeObserver(applySize);
    resizeObserver.observe(canvas);
    return () => resizeObserver.disconnect();
  }, [build, canvasRef]);

  useEffect(() => {
    build();
  }, [build, config.direction, config.fadeEnd, config.fadeStart, config.falloff, config.gridSize, config.minBrightness, config.squareColors]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const observer = new IntersectionObserver(([entry]) => {
      visibleRef.current = entry.isIntersecting;
    });
    observer.observe(canvas);

    return () => observer.disconnect();
  }, [canvasRef]);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return undefined;

    const context = canvas.getContext('2d', { alpha: true });
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    let lastFrame = 0;

    const draw = (timestamp) => {
      frameRef.current = requestAnimationFrame(draw);
      if (!visibleRef.current || (!reduceMotion && timestamp - lastFrame < 33)) return;
      if (reduceMotion && lastFrame > 0) return;

      lastFrame = timestamp;
      const current = configRef.current;
      const time = timestamp * 0.001;
      const width = canvas._cssWidth || canvas.offsetWidth || 800;
      const height = canvas._cssHeight || canvas.offsetHeight || 450;
      const pixelSize = current.gridSize * current.squareSize;
      const offset = (current.gridSize - pixelSize) / 2;

      context.clearRect(0, 0, width, height);

      for (const square of squaresRef.current) {
        const oscillation = Math.sin(square.phase + time * current.twinkleSpeed * Math.PI * 2);
        const twinkle = 1 - current.twinkleStrength * (0.5 - oscillation * 0.5);
        const alpha = Math.min(1, square.brightness * twinkle * current.intensity * current.opacity);
        const [red, green, blue] = square.rgb;
        context.fillStyle = `rgba(${red}, ${green}, ${blue}, ${alpha.toFixed(3)})`;
        context.fillRect(square.x + offset, square.y + offset, pixelSize, pixelSize);
      }
    };

    frameRef.current = requestAnimationFrame(draw);
    return () => {
      if (frameRef.current) cancelAnimationFrame(frameRef.current);
    };
  }, [canvasRef]);
}

export default function BlinkingSquares({
  direction = 'right',
  gridSize = 8,
  squareSize = 0.34,
  fadeStart = 0.08,
  fadeEnd = 1,
  falloff = 0.8,
  minBrightness = 0.45,
  twinkleSpeed = 0.2,
  twinkleStrength = 0.72,
  intensity = 1,
  opacity = 1,
  squareColors = DEFAULT_COLORS,
  dpr = 1.5,
  className = '',
}) {
  const canvasRef = useRef(null);

  useBlinkingSquares(canvasRef, {
    direction,
    gridSize,
    squareSize,
    fadeStart,
    fadeEnd,
    falloff,
    minBrightness,
    twinkleSpeed,
    twinkleStrength,
    intensity,
    opacity,
    squareColors,
    dpr,
  });

  return (
    <div className={cn('relative h-full w-full overflow-hidden', className)} aria-hidden="true">
      <canvas ref={canvasRef} className="absolute inset-0 block h-full w-full" />
    </div>
  );
}

BlinkingSquares.propTypes = {
  direction: PropTypes.oneOf(['right', 'left', 'top', 'bottom']),
  gridSize: PropTypes.number,
  squareSize: PropTypes.number,
  fadeStart: PropTypes.number,
  fadeEnd: PropTypes.number,
  falloff: PropTypes.number,
  minBrightness: PropTypes.number,
  twinkleSpeed: PropTypes.number,
  twinkleStrength: PropTypes.number,
  intensity: PropTypes.number,
  opacity: PropTypes.number,
  squareColors: PropTypes.arrayOf(PropTypes.string),
  dpr: PropTypes.number,
  className: PropTypes.string,
};
