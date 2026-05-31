/** ~2 kHz at 44.1 kHz sample rate with fftSize 2048 — screams sit above breath / room rumble. */
const HIGH_FREQ_BIN_START = 90;
/** Bins below this are treated as air / wind / low rumble and ignored for fill. */
const LOW_AIR_BIN_END = 18;

export type ScreamMicSession = {
  stream: MediaStream;
  audioContext: AudioContext;
  analyser: AnalyserNode;
  frequencyBuffer: Uint8Array<ArrayBuffer>;
};

export const startScreamMicrophone = async (): Promise<ScreamMicSession | null> => {
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
    const audioContext = new AudioContext();
    const source = audioContext.createMediaStreamSource(stream);
    const analyser = audioContext.createAnalyser();
    analyser.fftSize = 2048;
    analyser.smoothingTimeConstant = 0.55;
    analyser.minDecibels = -90;
    analyser.maxDecibels = -10;
    source.connect(analyser);

    return {
      stream,
      audioContext,
      analyser,
      frequencyBuffer: new Uint8Array(analyser.frequencyBinCount)
    };
  } catch {
    return null;
  }
};

export const stopScreamMicrophone = (session: ScreamMicSession | null): void => {
  if (!session) {
    return;
  }
  session.stream.getTracks().forEach((track) => track.stop());
  void session.audioContext.close();
};

/**
 * Returns 0–1 scream intensity using high-frequency energy only.
 * Low-frequency air, breath, and room hum are excluded so the tumbler fills on shouts/screams.
 */
export const readScreamHighFrequencyLevel = (session: ScreamMicSession): number => {
  const { analyser, frequencyBuffer } = session;
  analyser.getByteFrequencyData(frequencyBuffer);

  let highSum = 0;
  let airSum = 0;
  let highCount = 0;
  let airCount = 0;

  for (let i = 0; i < frequencyBuffer.length; i += 1) {
    const normalized = frequencyBuffer[i] / 255;
    const energy = normalized * normalized;

    if (i >= HIGH_FREQ_BIN_START) {
      highSum += energy;
      highCount += 1;
    } else if (i < LOW_AIR_BIN_END) {
      airSum += energy;
      airCount += 1;
    }
  }

  if (highCount === 0) {
    return 0;
  }

  const highRms = Math.sqrt(highSum / highCount);
  const airRms = airCount > 0 ? Math.sqrt(airSum / airCount) : 0;

  // Require high-band energy to clearly exceed low air/breath energy.
  const screamScore = Math.max(0, highRms - airRms * 0.5);
  const normalized = (screamScore - 0.06) / 0.38;

  return Math.min(1, Math.max(0, normalized));
};
