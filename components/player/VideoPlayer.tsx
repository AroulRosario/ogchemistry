import { supabase } from '@/constants/supabase';
import { COLORS, SHADOWS } from '@/constants/theme';
import { useAuth } from '@/contexts/AuthContext';
import { ResizeMode, Video } from 'expo-av';
import { FastForward, Loader2, Maximize, Pause, Play } from 'lucide-react-native';
import { useEffect, useRef, useState } from 'react';
import { Animated, Platform, Pressable, StyleSheet, Text, View } from 'react-native';

interface VideoPlayerProps {
    url: string;
    contentItemId: string;
}

export function VideoPlayer({ url, contentItemId }: VideoPlayerProps) {
    const isYouTube = url?.includes('youtube.com') || url?.includes('youtu.be');

    const getYouTubeId = (url: string) => {
        const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
        const match = url.match(regExp);
        return (match && match[2].length === 11) ? match[2] : null;
    };
    const videoRef = useRef<Video>(null);
    const { user } = useAuth();

    const [status, setStatus] = useState<any>({});
    const [speedIndex, setSpeedIndex] = useState(0);
    const [controlsVisible, setControlsVisible] = useState(true);
    const [loading, setLoading] = useState(true);

    const SPEEDS = [1.0, 1.25, 1.5, 2.0];
    const fadeAnim = useRef(new Animated.Value(1)).current;

    // Load initial progress
    useEffect(() => {
        if (!user || !contentItemId) return;
        const loadProgress = async () => {
            const { data } = await supabase
                .from('video_progress')
                .select('watched_seconds')
                .eq('user_id', user.id)
                .eq('content_item_id', contentItemId)
                .single();

            if (data?.watched_seconds && videoRef.current) {
                videoRef.current.setPositionAsync(data.watched_seconds * 1000);
            }
        };
        loadProgress();
    }, [user, contentItemId]);

    // Save progress periodically
    useEffect(() => {
        if (!user || !contentItemId || !status.isPlaying) return;

        const saveInterval = setInterval(async () => {
            if (status.positionMillis) {
                await supabase.from('video_progress').upsert({
                    user_id: user.id,
                    content_item_id: contentItemId,
                    watched_seconds: Math.floor(status.positionMillis / 1000),
                    duration: Math.floor(status.durationMillis / 1000) || 0,
                    is_completed: status.positionMillis >= (status.durationMillis - 2000),
                    updated_at: new Date().toISOString()
                }, { onConflict: 'user_id,content_item_id' });
            }
        }, 10000); // Save every 10 seconds

        return () => clearInterval(saveInterval);
    }, [status.isPlaying, status.positionMillis]);

    const togglePlay = () => {
        if (!videoRef.current) return;
        if (status.isPlaying) videoRef.current.pauseAsync();
        else videoRef.current.playAsync();
        showControlsTemporarily();
    };

    const cycleSpeed = async () => {
        if (!videoRef.current) return;
        const nextIndex = (speedIndex + 1) % SPEEDS.length;
        setSpeedIndex(nextIndex);
        await videoRef.current.setRateAsync(SPEEDS[nextIndex], true);
        showControlsTemporarily();
    };

    const skipForward = async () => {
        if (!videoRef.current || !status.positionMillis) return;
        await videoRef.current.setPositionAsync(status.positionMillis + 10000);
        showControlsTemporarily();
    };
    
    const toggleFullscreen = async () => {
        if (!videoRef.current) return;
        if (Platform.OS === 'web') {
            const videoElement = document.querySelector('video');
            if (videoElement) {
                if (!document.fullscreenElement) videoElement.requestFullscreen();
                else document.exitFullscreen();
            }
        } else {
            videoRef.current.presentFullscreenPlayer();
        }
    };

    const showControlsTemporarily = () => {
        setControlsVisible(true);
        Animated.timing(fadeAnim, { toValue: 1, duration: 200, useNativeDriver: true }).start();

        // Auto hide after 3 seconds
        setTimeout(() => {
            if (status.isPlaying) {
                Animated.timing(fadeAnim, { toValue: 0, duration: 500, useNativeDriver: true }).start(() => setControlsVisible(false));
            }
        }, 3000);
    };

    const formatTime = (millis: number) => {
        if (!millis || isNaN(millis)) return "0:00";
        const totalSeconds = Math.floor(millis / 1000);
        const minutes = Math.floor(totalSeconds / 60);
        const seconds = totalSeconds % 60;
        return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
    };

    if (isYouTube) {
        const videoId = getYouTubeId(url);
        return (
            <View style={styles.container}>
                {Platform.OS === 'web' ? (
                    <iframe
                        width="100%"
                        height="100%"
                        src={`https://www.youtube.com/embed/${videoId}?autoplay=0&rel=0&modestbranding=1`}
                        frameBorder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        style={{ borderRadius: 18 }}
                    />
                ) : (
                    <Text style={{ color: 'white', padding: 20 }}>YouTube playback requires the web version or a dedicated library on mobile.</Text>
                )}
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <Pressable style={styles.videoWrapper} onPress={showControlsTemporarily}>
                <Video
                    ref={videoRef}
                    source={{ uri: url, headers: { 'User-Agent': 'EliteApp/1.0' } }}
                    style={styles.video}
                    videoStyle={Platform.OS === 'web' ? { objectFit: 'contain' } as any : undefined}
                    resizeMode={ResizeMode.CONTAIN}
                    isLooping={false}
                    onPlaybackStatusUpdate={status => {
                        setStatus(() => status);
                        if (status.isLoaded && loading) { setLoading(false); showControlsTemporarily(); }
                    }}
                />

                {loading && (
                    <View style={styles.loaderOverlay}>
                        <Loader2 color={COLORS.orange} size={40} style={styles.spinning} />
                        <Text style={styles.loaderText}>BUFFERING</Text>
                    </View>
                )}

                {/* Custom Overlay Controls */}
                {controlsVisible && !loading && (
                    <Animated.View style={[styles.controlsOverlay, { opacity: fadeAnim }]}>
                        {/* Top Bar: Speed & Status */}
                        <View style={styles.topControls}>
                            <Pressable style={styles.speedBtn} onPress={cycleSpeed}>
                                <Text style={styles.speedText}>{SPEEDS[speedIndex]}x</Text>
                            </Pressable>
                        </View>

                        {/* Center Play/Pause */}
                        <View style={styles.centerControls}>
                            <Pressable style={styles.controlCircle} onPress={togglePlay}>
                                {status.isPlaying ? <Pause color="#FFF" size={32} /> : <Play color="#FFF" size={32} style={{ marginLeft: 4 }} />}
                            </Pressable>
                            <Pressable style={styles.controlCircleSmall} onPress={skipForward}>
                                <FastForward color="#FFF" size={24} />
                            </Pressable>
                        </View>

                        {/* Bottom Bar: Progress Vector */}
                        <View style={styles.bottomControls}>
                            <Text style={styles.timeText}>{formatTime(status.positionMillis)}</Text>
                            <View style={styles.progressTrackWrapper}>
                                <View style={styles.progressTrack}>
                                    <View style={[styles.progressFill, { width: `${status.durationMillis ? (status.positionMillis / status.durationMillis) * 100 : 0}%` }]} />
                                </View>
                            </View>
                            <Text style={styles.timeText}>{formatTime(status.durationMillis)}</Text>
                            <Pressable style={styles.fullscreenBtn} onPress={toggleFullscreen}>
                                <Maximize color="#FFF" size={20} />
                            </Pressable>
                        </View>
                    </Animated.View>
                )}
            </Pressable>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        width: '100%',
        aspectRatio: 16 / 9,
        backgroundColor: '#0F172A',
        borderRadius: 24,
        overflow: 'hidden',
        borderWidth: 1,
        borderColor: '#1E293B',
        marginBottom: 24,
        ...SHADOWS.lg,
    },
    videoWrapper: {
        flex: 1,
        position: 'relative',
    },
    video: {
        width: '100%',
        height: '100%',
    },
    loaderOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.7)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    spinning: {
        // rotation animation skipped for brevity, using lucide static
    },
    loaderText: {
        color: COLORS.orange,
        fontFamily: 'System',
        fontWeight: '900',
        fontSize: 20,
        marginTop: 10,
        letterSpacing: 1,
    },
    controlsOverlay: {
        ...StyleSheet.absoluteFillObject,
        backgroundColor: 'rgba(0,0,0,0.4)',
        justifyContent: 'space-between',
        padding: 16,
    },
    topControls: {
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    speedBtn: {
        backgroundColor: 'rgba(255,255,255,0.2)',
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255,255,255,0.4)',
    },
    speedText: {
        color: '#FFF',
        fontFamily: 'System',
        fontWeight: '800',
        fontSize: 14,
    },
    centerControls: {
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        gap: 24,
    },
    controlCircle: {
        width: 72,
        height: 72,
        borderRadius: 36,
        backgroundColor: 'rgba(59, 130, 246, 0.8)', // Primary blue
        justifyContent: 'center',
        alignItems: 'center',
        borderWidth: 2,
        borderColor: 'rgba(255,255,255,0.5)',
    },
    controlCircleSmall: {
        width: 48,
        height: 48,
        borderRadius: 24,
        backgroundColor: 'rgba(255, 255, 255, 0.2)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    bottomControls: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
        marginBottom: 8,
    },
    timeText: {
        color: '#FFF',
        fontFamily: 'System',
        fontWeight: '700',
        fontSize: 12,
        width: 36,
        textAlign: 'center',
    },
    progressTrackWrapper: {
        flex: 1,
        height: 20,
        justifyContent: 'center',
    },
    progressTrack: {
        height: 6,
        backgroundColor: 'rgba(255,255,255,0.3)',
        borderRadius: 3,
        overflow: 'hidden',
    },
    progressFill: {
        height: '100%',
        backgroundColor: COLORS.blue, // Standard professional blue
    },
    fullscreenBtn: {
        marginLeft: 8,
        padding: 4,
    }
});
