import React from 'react';
import {
  AbsoluteFill,
  useCurrentFrame,
  useVideoConfig,
  spring,
  interpolate,
  Easing,
} from 'remotion';

const COLORS = {
  red: '#D62828',
  blue: '#023E8A',
  yellow: '#FFD60A',
  black: '#0E0E0E',
  white: '#FAFAFA',
};

export const ForgeReveal = () => {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();

  // ── Phase 1: Geometric Intro (0-30) ─────────────────────────────────────
  const circleScale = spring({
    frame,
    fps,
    from: 0,
    to: 1,
    config: { damping: 14, stiffness: 120, mass: 0.6 },
  });

  const rectX = interpolate(frame, [0, 30], [-600, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const triangleOpacity = interpolate(frame, [5, 30], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const triangleY = interpolate(frame, [5, 30], [200, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // ── Phase 2: Title reveal (30-60) ────────────────────────────────────────
  const titleOpacity = interpolate(frame, [30, 55], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const titleY = interpolate(frame, [30, 55], [60, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  // Shapes settle — shrink + reposition
  const shapesSettle = interpolate(frame, [30, 60], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.inOut(Easing.quad),
  });

  const circleSettledScale = interpolate(shapesSettle, [0, 1], [1, 0.55]);
  const circleSettledY = interpolate(shapesSettle, [0, 1], [-340, -500]);
  const circleSettledX = interpolate(shapesSettle, [0, 1], [0, 280]);

  const rectSettledX = interpolate(shapesSettle, [0, 1], [rectX, -360]);
  const rectSettledY = interpolate(shapesSettle, [0, 1], [0, 200]);
  const rectSettledScale = interpolate(shapesSettle, [0, 1], [1, 0.45]);

  const triangleSettledY = interpolate(shapesSettle, [0, 1], [triangleY + 400, 580]);
  const triangleSettledX = interpolate(shapesSettle, [0, 1], [0, -320]);
  const triangleSettledScale = interpolate(shapesSettle, [0, 1], [1, 0.5]);

  // ── Phase 3: Value props (60-120) ─────────────────────────────────────────
  const subTextOpacity = interpolate(frame, [70, 95], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  const subTextY = interpolate(frame, [70, 95], [30, 0], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
    easing: Easing.out(Easing.cubic),
  });

  const priceScale = spring({
    frame: frame - 90,
    fps,
    from: 0,
    to: 1,
    config: { damping: 8, stiffness: 200, mass: 0.5 },
  });

  const categoryOpacity = interpolate(frame, [105, 120], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // ── Phase 4: CTA (120-150) ────────────────────────────────────────────────
  const ctaOpacity = interpolate(frame, [120, 135], [0, 1], {
    extrapolateLeft: 'clamp',
    extrapolateRight: 'clamp',
  });

  // Pulse: oscillate between 1 and 1.04
  const ctaPulse = 1 + 0.04 * Math.sin(((frame - 120) / fps) * 2 * Math.PI * 1.5);

  // ── Final composite positions ─────────────────────────────────────────────
  const finalCircleX = frame < 30 ? 0 : circleSettledX;
  const finalCircleY = frame < 30 ? -340 : circleSettledY;
  const finalCircleScale = frame < 30 ? circleScale : circleSettledScale;

  const finalRectX = frame < 30 ? rectX : rectSettledX;
  const finalRectY = frame < 30 ? 0 : rectSettledY;
  const finalRectScale = frame < 30 ? 1 : rectSettledScale;

  const finalTriangleY = frame < 30 ? triangleY + 400 : triangleSettledY;
  const finalTriangleX = frame < 30 ? 0 : triangleSettledX;
  const finalTriangleScale = frame < 30 ? 1 : triangleSettledScale;

  return (
    <AbsoluteFill
      style={{
        background: COLORS.black,
        fontFamily: "'Inter', 'Helvetica Neue', Arial, sans-serif",
        overflow: 'hidden',
      }}
    >
      {/* ── Red Circle ─────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 480,
          height: 480,
          borderRadius: '50%',
          background: COLORS.red,
          transform: `translate(calc(-50% + ${finalCircleX}px), calc(-50% + ${finalCircleY}px)) scale(${finalCircleScale})`,
          opacity: triangleOpacity,
        }}
      />

      {/* ── Blue Rectangle ─────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 320,
          height: 200,
          background: COLORS.blue,
          transform: `translate(calc(-50% + ${finalRectX}px), calc(-50% + ${finalRectY}px)) scale(${finalRectScale})`,
          opacity: triangleOpacity,
        }}
      />

      {/* ── Yellow Triangle ────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          width: 0,
          height: 0,
          borderLeft: '200px solid transparent',
          borderRight: '200px solid transparent',
          borderBottom: `346px solid ${COLORS.yellow}`,
          transform: `translate(calc(-50% + ${finalTriangleX}px), calc(-50% + ${finalTriangleY}px)) scale(${finalTriangleScale})`,
          opacity: triangleOpacity,
        }}
      />

      {/* ── FOR/GE Title ───────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, calc(-50% + ${titleY}px))`,
          opacity: titleOpacity,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 148,
            fontWeight: 900,
            letterSpacing: '-4px',
            color: COLORS.white,
            lineHeight: 1,
          }}
        >
          FOR
          <span style={{ color: COLORS.red }}>/</span>
          GE
        </div>
      </div>

      {/* ── Subtext ────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: `translate(-50%, calc(80px + ${subTextY}px))`,
          opacity: subTextOpacity,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 36,
            fontWeight: 400,
            color: COLORS.white,
            opacity: 0.75,
            letterSpacing: '0.5px',
          }}
        >
          Your workspace. Your argument.
        </div>
      </div>

      {/* ── Price ──────────────────────────────────────────────────── */}
      {frame >= 90 && (
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: `translate(-50%, calc(200px)) scale(${priceScale})`,
            textAlign: 'center',
            zIndex: 10,
          }}
        >
          <div
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: COLORS.yellow,
              letterSpacing: '-2px',
            }}
          >
            $59
          </div>
        </div>
      )}

      {/* ── Category ───────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, 320px)',
          opacity: categoryOpacity,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 22,
            fontWeight: 500,
            color: COLORS.white,
            opacity: 0.5,
            letterSpacing: '3px',
            textTransform: 'uppercase',
          }}
        >
          Notion Workspace · OS
        </div>
      </div>

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <div
        style={{
          position: 'absolute',
          bottom: 180,
          left: '50%',
          transform: `translateX(-50%) scale(${ctaPulse})`,
          opacity: ctaOpacity,
          textAlign: 'center',
          zIndex: 10,
        }}
      >
        <div
          style={{
            fontSize: 28,
            fontWeight: 600,
            color: COLORS.white,
            background: COLORS.red,
            padding: '18px 48px',
            borderRadius: 4,
            letterSpacing: '0.5px',
          }}
        >
          forcrypto.market
        </div>
        <div
          style={{
            marginTop: 16,
            fontSize: 20,
            fontWeight: 400,
            color: COLORS.white,
            opacity: 0.5,
          }}
        >
          Available now
        </div>
      </div>
    </AbsoluteFill>
  );
};
