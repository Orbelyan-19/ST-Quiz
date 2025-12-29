import React, { useEffect, useRef, useState } from 'react';
import { Volume2, VolumeX } from 'lucide-react';

const BackgroundAudio = () => {
    const [isMuted, setIsMuted] = useState(true);
    const audioContextRef = useRef(null);
    const masterGainRef = useRef(null);

    // Scheduler Refs
    const nextNoteTimeRef = useRef(0);
    const timerIDRef = useRef(null);
    const current16thNoteRef = useRef(0);
    const isPlayingRef = useRef(false);

    // Drone/Pad Refs to stop them later
    const droneNodesRef = useRef([]);

    const BPM = 84;
    const LOOKAHEAD = 25.0; // ms
    const SCHEDULE_AHEAD_TIME = 0.1; // s

    // The Theme Spec
    const arpNotes = [
        130.81, // C3
        164.81, // E3
        196.00, // G3
        246.94, // B3
        261.63, // C4
        246.94, // B3
        196.00, // G3
        164.81  // E3
    ];

    const initAudio = () => {
        if (!audioContextRef.current) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            audioContextRef.current = new AudioContext();
            masterGainRef.current = audioContextRef.current.createGain();
            masterGainRef.current.gain.value = 0.3; // Master volume
            masterGainRef.current.connect(audioContextRef.current.destination);
        }
        if (audioContextRef.current.state === 'suspended') {
            audioContextRef.current.resume();
        }
    };

    // --- INSTRUMENTS ---

    const playArpNote = (time, freq) => {
        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const osc2 = ctx.createOscillator(); // Detuned layer
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc2.type = 'sawtooth';

        osc.frequency.value = freq;
        osc2.frequency.value = freq;
        osc2.detune.value = 8; // Classic analog spread

        // Filter Envelope (The "Opening" sound)
        // We modulate this over time globally usually, but here per note for definition
        filter.type = 'lowpass';
        filter.Q.value = 4;
        filter.frequency.setValueAtTime(400, time);
        filter.frequency.exponentialRampToValueAtTime(1200, time + 0.1);
        filter.frequency.exponentialRampToValueAtTime(400, time + 0.3);

        // Amp Envelope
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.15, time + 0.02);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.4);

        osc.connect(filter);
        osc2.connect(filter);
        filter.connect(gain);
        gain.connect(masterGainRef.current);

        osc.start(time);
        osc2.start(time);
        osc.stop(time + 0.5);
        osc2.stop(time + 0.5);
    };

    const playHeartbeat = (time) => {
        // The deep "BOOM... BOOM..."
        const ctx = audioContextRef.current;
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const filter = ctx.createBiquadFilter();

        osc.type = 'square';
        osc.frequency.value = 32.70; // C1 (Sub bass)

        filter.type = 'lowpass';
        filter.frequency.value = 120;
        filter.Q.value = 0;

        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.5, time + 0.05);
        gain.gain.exponentialRampToValueAtTime(0.01, time + 0.6);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(masterGainRef.current);

        osc.start(time);
        osc.stop(time + 0.7);
    };

    const startDrone = () => {
        // Atmospheric pad C2-G2
        const ctx = audioContextRef.current;
        const now = ctx.currentTime;

        const nodes = [];
        const freqs = [65.41, 98.00]; // C2, G2

        freqs.forEach(freq => {
            const osc = ctx.createOscillator();
            const gain = ctx.createGain();
            const filter = ctx.createBiquadFilter();

            osc.type = 'sawtooth';
            osc.frequency.value = freq;

            filter.type = 'lowpass';
            filter.frequency.value = 200; // Dark

            gain.gain.setValueAtTime(0, now);
            gain.gain.linearRampToValueAtTime(0.1, now + 2); // Slow fade in

            osc.connect(filter);
            filter.connect(gain);
            gain.connect(masterGainRef.current);

            osc.start(now);
            nodes.push({
                stop: (t) => {
                    gain.gain.cancelScheduledValues(t);
                    gain.gain.setValueAtTime(gain.gain.value, t);
                    gain.gain.linearRampToValueAtTime(0, t + 1);
                    osc.stop(t + 1.1);
                }
            });
        });

        droneNodesRef.current = nodes;
    };

    const stopDrone = () => {
        const now = audioContextRef.current?.currentTime || 0;
        droneNodesRef.current.forEach(n => n.stop(now));
        droneNodesRef.current = [];
    };

    // --- SCHEDULER ---

    const scheduleNote = (beatIndex, time) => {
        // 1. Arpeggio (Every 16th)
        const note = arpNotes[beatIndex % 8];
        playArpNote(time, note);

        // 2. Heartbeat Bass (Beat 1 and 3 of a 4/4 bar, or specific pulse)
        // Intro pulse is steady quarter notes usually
        if (beatIndex % 4 === 0) {
            playHeartbeat(time);
        }
    };

    const schedulerLoop = () => {
        if (!isPlayingRef.current) return;

        const ctx = audioContextRef.current;
        const secondsPerBeat = 60.0 / BPM;
        // 16th note duration = 0.25 * beat
        const noteDuration = 0.25 * secondsPerBeat;

        while (nextNoteTimeRef.current < ctx.currentTime + SCHEDULE_AHEAD_TIME) {
            scheduleNote(current16thNoteRef.current, nextNoteTimeRef.current);
            nextNoteTimeRef.current += noteDuration;
            current16thNoteRef.current++;
        }

        timerIDRef.current = window.setTimeout(schedulerLoop, LOOKAHEAD);
    };


    const toggleAudio = () => {
        if (isMuted) {
            initAudio();
            setIsMuted(false);
            isPlayingRef.current = true;
            nextNoteTimeRef.current = audioContextRef.current.currentTime + 0.1;
            current16thNoteRef.current = 0;

            startDrone();
            schedulerLoop();
        } else {
            setIsMuted(true);
            isPlayingRef.current = false;
            if (timerIDRef.current) clearTimeout(timerIDRef.current);
            stopDrone();

            // Suspend context to save CPU
            // audioContextRef.current.suspend(); 
            // Better to just mute/stop nodes, keeping context alive is safer for frequent toggles
        }
    };

    // Cleanup
    useEffect(() => {
        return () => {
            if (timerIDRef.current) clearTimeout(timerIDRef.current);
            stopDrone();
            if (audioContextRef.current) audioContextRef.current.close();
        };
    }, []);

    return (
        <button
            onClick={toggleAudio}
            className="fixed top-4 right-4 z-50 p-2 text-st-red bg-black/50 rounded-full border border-st-red hover:bg-st-red hover:text-white transition-all backdrop-blur-sm group"
            title={isMuted ? "Включить саундтрек" : "Выключить саундтрек"}
        >
            {isMuted ? (
                <VolumeX size={24} className="group-hover:scale-110 transition-transform" />
            ) : (
                <div className="relative">
                    <Volume2 size={24} className="group-hover:scale-110 transition-transform" />
                    <span className="absolute -top-1 -right-1 w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                </div>
            )}
        </button>
    );
};

export default BackgroundAudio;
