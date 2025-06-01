
import { useEffect, useState } from 'react';
import { Fireworks } from 'lucide-react';

const Confetti = () => {
  const [particles, setParticles] = useState<Array<{
    id: number;
    x: number;
    y: number;
    color: string;
    delay: number;
    type: 'confetti' | 'firework';
  }>>([]);

  useEffect(() => {
    const colors = ['#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7', '#FF69B4', '#00FF7F'];
    
    // Create confetti particles
    const confettiParticles = Array.from({ length: 40 }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: -10,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 2,
      type: 'confetti' as const
    }));

    // Create firework particles
    const fireworkParticles = Array.from({ length: 8 }, (_, i) => ({
      id: i + 40,
      x: 20 + (i * 10),
      y: Math.random() * 30 + 20,
      color: colors[Math.floor(Math.random() * colors.length)],
      delay: Math.random() * 1.5,
      type: 'firework' as const
    }));

    setParticles([...confettiParticles, ...fireworkParticles]);

    // Play firecracker sound
    const playFirecrackerSound = () => {
      // Create audio context for generating firecracker sound
      const audioContext = new (window.AudioContext || (window as any).webkitAudioContext)();
      
      const createFirecrackerBurst = (delay: number) => {
        setTimeout(() => {
          // Create a noise burst for firecracker effect
          const bufferSize = audioContext.sampleRate * 0.1; // 0.1 seconds
          const buffer = audioContext.createBuffer(1, bufferSize, audioContext.sampleRate);
          const output = buffer.getChannelData(0);
          
          for (let i = 0; i < bufferSize; i++) {
            output[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / bufferSize, 2);
          }
          
          const source = audioContext.createBufferSource();
          const gainNode = audioContext.createGain();
          
          source.buffer = buffer;
          source.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
          
          source.start(audioContext.currentTime);
        }, delay);
      };

      // Create multiple bursts for realistic firecracker effect
      createFirecrackerBurst(0);
      createFirecrackerBurst(300);
      createFirecrackerBurst(600);
      createFirecrackerBurst(900);
    };

    playFirecrackerSound();
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute ${
            particle.type === 'confetti' 
              ? 'w-3 h-3 animate-bounce' 
              : 'w-8 h-8 animate-pulse'
          }`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            backgroundColor: particle.type === 'confetti' ? particle.color : 'transparent',
            animationDelay: `${particle.delay}s`,
            animationDuration: particle.type === 'confetti' ? '3s' : '2s',
            transform: particle.type === 'confetti' ? 'translateY(100vh)' : 'scale(1.5)'
          }}
        >
          {particle.type === 'firework' && (
            <Fireworks 
              size={32} 
              style={{ color: particle.color }} 
              className="animate-spin"
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default Confetti;
