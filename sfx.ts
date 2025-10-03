// sfx.ts

export type SoundType = 
  | 'bet'
  | 'start'
  | 'tick'
  | 'win'
  | 'jackpot'
  | 'lose'
  | 'collect'
  | 'clear'
  | 'betAll'
  | 'onceMore'
  | 'error'
  | 'gambleTick'
  | 'gambleWin'
  | 'gambleLose';

export class SoundEffects {
  private audioContext: AudioContext;

  constructor(context: AudioContext) {
    this.audioContext = context;
  }

  private playNote(
    frequency: number,
    startTime: number,
    duration: number,
    type: OscillatorType = 'sine',
    volume: number = 0.5
  ) {
    if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }

    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    oscillator.connect(gainNode);
    gainNode.connect(this.audioContext.destination);

    oscillator.type = type;
    oscillator.frequency.value = frequency;
    
    gainNode.gain.setValueAtTime(0, startTime);
    gainNode.gain.linearRampToValueAtTime(volume, startTime + 0.01);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, startTime + duration);

    oscillator.start(startTime);
    oscillator.stop(startTime + duration);
  }

  private playNoise(duration: number, volume: number = 0.2) {
     if (this.audioContext.state === 'suspended') {
      this.audioContext.resume();
    }
    const bufferSize = this.audioContext.sampleRate * duration;
    const buffer = this.audioContext.createBuffer(1, bufferSize, this.audioContext.sampleRate);
    const output = buffer.getChannelData(0);

    for (let i = 0; i < bufferSize; i++) {
        output[i] = Math.random() * 2 - 1;
    }

    const noiseSource = this.audioContext.createBufferSource();
    noiseSource.buffer = buffer;
    
    const gainNode = this.audioContext.createGain();
    gainNode.gain.setValueAtTime(volume, this.audioContext.currentTime);
    gainNode.gain.exponentialRampToValueAtTime(0.0001, this.audioContext.currentTime + duration);

    noiseSource.connect(gainNode);
    gainNode.connect(this.audioContext.destination);
    noiseSource.start();
  }

  public play(sound: SoundType) {
    const now = this.audioContext.currentTime;
    switch (sound) {
      case 'bet':
        this.playNote(880, now, 0.1, 'triangle', 0.3);
        break;
      case 'betAll':
        this.playNote(523, now, 0.1, 'square', 0.4);
        this.playNote(659, now + 0.1, 0.1, 'square', 0.4);
        break;
      case 'start':
        this.playNote(261, now, 0.1, 'square', 0.4);
        this.playNote(329, now + 0.1, 0.1, 'square', 0.4);
        this.playNote(392, now + 0.2, 0.1, 'square', 0.4);
        break;
      case 'tick':
        this.playNote(440 + Math.random() * 50, now, 0.05, 'square', 0.15);
        break;
      case 'win':
        this.playNote(523, now, 0.1, 'sine', 0.5);
        this.playNote(659, now + 0.1, 0.1, 'sine', 0.5);
        this.playNote(783, now + 0.2, 0.1, 'sine', 0.5);
        this.playNote(1046, now + 0.3, 0.2, 'sine', 0.5);
        break;
       case 'jackpot':
            for (let i = 0; i < 16; i++) {
                this.playNote(440 + i * 50, now + i * 0.05, 0.05, 'sawtooth', 0.4);
            }
            const chordTime = now + (16 * 0.05);
            this.playNote(880, chordTime, 0.4, 'sine');
            this.playNote(1108, chordTime, 0.4, 'sine');
            this.playNote(1318, chordTime, 0.4, 'sine');
            break;
      case 'lose':
        this.playNote(220, now, 0.5, 'sawtooth', 0.4);
        break;
      case 'collect':
        this.playNote(1046, now, 0.1, 'sine', 0.6);
        this.playNote(1318, now + 0.1, 0.15, 'sine', 0.6);
        break;
      case 'clear':
        this.playNoise(0.3, 0.1);
        break;
      case 'onceMore':
        this.playNote(392, now, 0.1, 'triangle', 0.5);
        this.playNote(523, now + 0.15, 0.2, 'triangle', 0.5);
        break;
      case 'error':
        this.playNote(110, now, 0.2, 'sawtooth', 0.4);
        break;
      case 'gambleTick':
        this.playNote(1200 + Math.random() * 200, now, 0.05, 'square', 0.2);
        break;
      case 'gambleWin':
        this.playNote(783, now, 0.1, 'triangle', 0.5);
        this.playNote(1046, now + 0.1, 0.1, 'triangle', 0.5);
        this.playNote(1318, now + 0.2, 0.2, 'triangle', 0.5);
        break;
      case 'gambleLose':
        this.playNote(220, now, 0.2, 'sawtooth', 0.4);
        this.playNote(164, now + 0.2, 0.3, 'sawtooth', 0.4);
        break;
    }
  }
}