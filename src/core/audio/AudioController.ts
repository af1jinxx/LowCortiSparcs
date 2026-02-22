declare global {
    interface Window {
        webkitAudioContext: typeof AudioContext;
    }
}

class AudioController {
    private audioContext: AudioContext | null = null;
    private analyser: AnalyserNode | null = null;
    private source: MediaElementAudioSourceNode | null = null;
    private audioElement: HTMLAudioElement | null = null;
    private frequencyData: Uint8Array | null = null;

    // configuration
    private fftSize: number = 2048;
    private smoothingTimeConstant: number = 0.8;

    constructor() {
        this.initAudioContext();
    }

    private initAudioContext() {
        if (!this.audioContext) {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = this.fftSize;
            this.analyser.smoothingTimeConstant = this.smoothingTimeConstant;

            this.frequencyData = new Uint8Array(this.analyser.frequencyBinCount);
        }
    }

    // ensure context is resumed (browser autoplay policy)
    public async resumeContext() {
        if (this.audioContext?.state === 'suspended') {
            await this.audioContext.resume();
        }
    }

    public loadAudio(url: string) {
        if (this.audioElement) {
            this.audioElement.pause();
            this.audioElement.src = '';
        }

        this.audioElement = new Audio(url);
        this.audioElement.crossOrigin = "anonymous";

        // Connect to Web Audio Graph
        if (this.audioContext && this.analyser) {
            // Clean up previous source if exists (buffer)
            if (this.source) {
                this.source.disconnect();
            }

            this.source = this.audioContext.createMediaElementSource(this.audioElement);
            this.source.connect(this.analyser);
            this.analyser.connect(this.audioContext.destination);
        }

        return this.audioElement;
    }

    public play() {
        this.resumeContext();
        this.audioElement?.play();
    }

    public pause() {
        this.audioElement?.pause();
    }

    public getAudioData(): { frequencyData: Uint8Array, average: number } {
        if (this.analyser && this.frequencyData) {
            this.analyser.getByteFrequencyData(this.frequencyData);

            // Calculate average volume for simple reactivity
            let sum = 0;
            for (let i = 0; i < this.frequencyData.length; i++) {
                sum += this.frequencyData[i];
            }
            const average = sum / this.frequencyData.length;

            return {
                frequencyData: this.frequencyData,
                average: average
            };
        }

        return {
            frequencyData: new Uint8Array(0),
            average: 0
        };
    }
}

// Export singleton instance
export const audioController = new AudioController();
