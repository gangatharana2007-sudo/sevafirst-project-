import React, { useEffect, useRef } from 'react';

interface CyberBackgroundProps {
  attackerView: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  radius: number;
  pulsePhase: number;
}

interface PulsePacket {
  fromIndex: number;
  toIndex: number;
  progress: number;
  speed: number;
}

export const CyberBackground: React.FC<CyberBackgroundProps> = ({ attackerView }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let animationFrameId: number;
    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    // Resize listener
    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);

    // Generate balanced number of particles
    const particleCount = Math.min(48, Math.max(24, Math.floor(width / 32)));
    const particles: Particle[] = [];

    for (let i = 0; i < particleCount; i++) {
      particles.push({
        x: Math.random() * width,
        y: Math.random() * height,
        vx: (Math.random() - 0.5) * 0.45,
        vy: (Math.random() - 0.5) * 0.45,
        radius: Math.random() * 1.5 + 1,
        pulsePhase: Math.random() * Math.PI * 2,
      });
    }

    // Occasional data packet pulses moving between connected nodes
    const packets: PulsePacket[] = [];

    // Main Animation Loop
    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // Theme colors depending on Attacker View
      const nodeColor = attackerView ? '#f43f5e' : '#06b6d4';
      const lineColorRgb = attackerView ? '244, 63, 94' : '6, 182, 212';
      const packetColor = attackerView ? '#fda4af' : '#67e8f9';

      const maxDistance = 115;

      // 1. Update and Draw Particles
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i];

        // Move
        p.x += p.vx;
        p.y += p.vy;

        // Wrap around viewport edges smoothly
        if (p.x < -10) p.x = width + 10;
        else if (p.x > width + 10) p.x = -10;

        if (p.y < -10) p.y = height + 10;
        else if (p.y > height + 10) p.y = -10;

        p.pulsePhase += 0.03;
        const currentRadius = p.radius + Math.sin(p.pulsePhase) * 0.5;

        // Draw particle dot
        ctx.beginPath();
        ctx.arc(p.x, p.y, Math.max(0.5, currentRadius), 0, Math.PI * 2);
        ctx.fillStyle = nodeColor;
        ctx.globalAlpha = 0.5 + Math.sin(p.pulsePhase) * 0.2;
        ctx.fill();

        // 2. Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const p2 = particles[j];
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < maxDistance) {
            const alpha = (1 - dist / maxDistance) * (attackerView ? 0.2 : 0.14);
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = `rgba(${lineColorRgb}, ${alpha})`;
            ctx.lineWidth = 0.75;
            ctx.globalAlpha = 1;
            ctx.stroke();

            // Randomly spawn a data packet pulse along this edge
            if (packets.length < 6 && Math.random() < 0.0006) {
              packets.push({
                fromIndex: i,
                toIndex: j,
                progress: 0,
                speed: 0.015 + Math.random() * 0.015,
              });
            }
          }
        }
      }

      // 3. Update & Draw Packets
      for (let k = packets.length - 1; k >= 0; k--) {
        const pkt = packets[k];
        pkt.progress += pkt.speed;

        if (pkt.progress >= 1) {
          packets.splice(k, 1);
          continue;
        }

        const pFrom = particles[pkt.fromIndex];
        const pTo = particles[pkt.toIndex];
        if (!pFrom || !pTo) {
          packets.splice(k, 1);
          continue;
        }

        const pktX = pFrom.x + (pTo.x - pFrom.x) * pkt.progress;
        const pktY = pFrom.y + (pTo.y - pFrom.y) * pkt.progress;

        ctx.beginPath();
        ctx.arc(pktX, pktY, 1.8, 0, Math.PI * 2);
        ctx.fillStyle = packetColor;
        ctx.globalAlpha = 0.85;
        ctx.fill();
      }

      ctx.globalAlpha = 1;
      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [attackerView]);

  return (
    <div className="cyber-bg fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Large Ambient Dynamic Glowing Orbs */}
      <div
        className={`absolute -top-32 left-1/4 w-[600px] h-[500px] rounded-full blur-[140px] opacity-40 transition-colors duration-1000 animate-orb-1 ${
          attackerView ? 'bg-rose-600/20' : 'bg-cyan-500/15'
        }`}
      />
      <div
        className={`absolute top-1/3 -right-28 w-[550px] h-[550px] rounded-full blur-[150px] opacity-35 transition-colors duration-1000 animate-orb-2 ${
          attackerView ? 'bg-amber-600/15' : 'bg-blue-600/15'
        }`}
      />
      <div
        className={`absolute -bottom-24 left-1/3 w-[650px] h-[450px] rounded-full blur-[160px] opacity-30 transition-colors duration-1000 animate-pulse-slow ${
          attackerView ? 'bg-red-800/15' : 'bg-indigo-600/10'
        }`}
      />

      {/* 2. Cyber Matrix Dot Matrix Grid */}
      <div className="absolute inset-0 bg-[radial-gradient(#1e293b_1px,transparent_1px)] [background-size:32px_32px] opacity-25" />

      {/* 3. Horizontal Cyber Radar Scanline */}
      <div className="absolute inset-x-0 h-28 bg-gradient-to-b from-transparent via-cyan-500/5 to-transparent animate-scanline" />

      {/* 4. Canvas Particle Constellation Mesh */}
      <canvas ref={canvasRef} className="absolute inset-0 w-full h-full block" />

      {/* 5. Cyber SOC HUD Telemetry Perimeter Badges */}
      <div className="hidden lg:block absolute top-20 left-4 text-[9px] font-mono text-cyan-500/40 tracking-widest uppercase">
        <span className="inline-block w-1.5 h-1.5 rounded-full bg-cyan-500/50 animate-ping mr-1" />
        OSINT-GRID::ONLINE
      </div>

      <div className="hidden lg:block absolute top-20 right-4 text-[9px] font-mono text-cyan-500/40 tracking-widest uppercase">
        ENCRYPTION::DEFENSE-LAYER-01
      </div>

      <div className="hidden lg:block absolute bottom-4 left-4 text-[9px] font-mono text-slate-600 tracking-widest uppercase">
        CYBER-MIRROR::REALTIME-MAP-ACTIVE
      </div>

      <div className="hidden lg:block absolute bottom-4 right-4 text-[9px] font-mono text-slate-600 tracking-widest uppercase">
        {attackerView ? 'LENS::ATTACKER-COGNITIVE-MODE' : 'LENS::SOC-DEFENSIVE-POSTURE'}
      </div>
    </div>
  );
};
