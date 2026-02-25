import { motion, useScroll, useTransform } from "motion/react";
import { useState, useEffect, useRef, useMemo } from "react";
import { Heart, Clock, Sparkles, Volume2, VolumeX } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useSupabaseAssets } from "../hooks/useSupabaseAssets";
import { calculateRelationshipDuration } from "./home-page.utils";
// import { checkSupabaseConnection } from "../lib/supabase";

const MUSIC_BUCKET = import.meta.env.VITE_MUSIC_BUCKET || "musics";
const PREFERRED_MUSIC_KEYWORD = "mean if you lost official audio";
const decodeUrlForMatch = (url: string) => {
  try {
    return decodeURIComponent(url).toLowerCase();
  } catch {
    return url.toLowerCase();
  }
};

// Define captions for images
const predefinedCaptions = [
  "พาเธอไปทำเล็บแถวตลาดชัชวาล เป็นแรก ๆ เลยที่ได้ไปกินข้าวด้วยกันข้างนอก",
  "ตอนที่เราได้ไปเกาะล้านด้วยกัน ตอนนี้แฮปปี้มาก ๆ เลย",
  "ช่วงที่เริ่มมาบ้านเค้าแรก ๆ",
  "ได้เริ่มไปอยู่หอด้วยกัน เริ่มใช้ชีวิตด้วยกันจริง ๆ ",
  "แรก ๆ ที่ไปดูหนังกันในโรงต้องมีป๊อปคอร์นกับน้ำด้วยไม่งั้นไม่ยอมแนะ",
  "ได้มีตุ๊กตานอนกอดมีน้องฝันดีมานอนด้วย",
  "พาหนูไปกินสเต๊กลุงนวด พลอยชอบกินมากก",
  "เริ่มมาบ้าน มานอนด้วยกันบ่อย ๆ แฮปปี้แฮปปี้",
  "อยู่นอนเล่นด้วยกันทั้งวัน",
  "ลองให้เธอเป็นนินจาโคโนฮะครั้งแรก",
  "พากินไปซื้อของกินที่หลังโรงเรียน",
  "พากันไปเดินตลาดเนรมิต ตอนกลับฝนตกต้องรีบกลับไปกับอิคคิว 55555555",
  "พลอยเริ่มทำงานที่ยูนิโค่ เริ่มมาหากันบ่อย ๆ",
  "ไปงานรับปริญญาของพลอยย ตื่นเต้นมากเลยทำหน้าทำตัวไม่ถูกไปหมดเลย",
  "ได้พาเธอไปทำ workshop วาดเฟรมรูปแต่ก็มีเรื่องให้น้อยใจกันนิดหน่อย",
  "รูปที่ถ่ายเธอตั้งแต่โทรศัพท์เก่านู่นเลยย นั่งใต้อาคารด้วยกันบ่อย ๆ",
  "ตอนนั้นเริ่มรู้สึกเธอเปิดใจให้เยอะขึ้นเริ่มเล่นด้วยกันมากขึ้นมาก ๆ ",
  "ได้ไปเดตกันหอศิลป์อันนี้เพิ่งไปกันมาเลยแอบมาเพิ่มทีหลัง",
];

export function HomePage() {
  const {
    items: allImages,
    loading: imagesLoading,
    error: imagesError,
  } = useSupabaseAssets("images", ["jpeg", "jpg", "png", "webp", "avif"]);
  const {
    items: allVideos,
    loading: videosLoading,
    error: videosError,
  } = useSupabaseAssets("videos", ["mp4", "webm", "mov"]);
  const {
    items: allMusic,
    loading: musicLoading,
    error: musicError,
  } = useSupabaseAssets(MUSIC_BUCKET, ["mp3", "m4a", "aac", "wav", "ogg"]);

  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [days, setDays] = useState(0);
  const [showPromise, setShowPromise] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  const [hasUserInteracted, setHasUserInteracted] = useState(false);
  const [isMusicStarted, setIsMusicStarted] = useState(false);
  const [currentMusicIndex, setCurrentMusicIndex] = useState(0);
  // const [connectionState, setConnectionState] = useState<
  //   "checking" | "ok" | "error"
  // >("checking");
  // const [connectionMessage, setConnectionMessage] = useState(
  //   "Checking Supabase...",
  // );

  const heroRef = useRef<HTMLElement>(null);
  const musicAudioRef = useRef<HTMLAudioElement | null>(null);
  const videoRefs = useRef<(HTMLVideoElement | null)[]>([]);

  const { scrollYProgress } = useScroll({
    target: heroRef,
    offset: ["start start", "end start"],
  });

  const opacity = useTransform(scrollYProgress, [0, 1], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 0.8]);

  // Timer logic
  useEffect(() => {
    const startDate = new Date("2019-05-07");
    const updateCounter = () => {
      const duration = calculateRelationshipDuration(startDate, new Date());
      setYears(duration.years);
      setMonths(duration.months);
      setDays(duration.days);
    };
    updateCounter();
    const interval = setInterval(updateCounter, 1000 * 60 * 60); // Update every hour is enough for Y/M/D
    return () => clearInterval(interval);
  }, []);

  // useEffect(() => {
  //   let cancelled = false;
  //
  //   const runHealthCheck = async () => {
  //     setConnectionState("checking");
  //     setConnectionMessage("Checking Supabase...");
  //
  //     const result = await checkSupabaseConnection("images");
  //     if (cancelled) return;
  //
  //     if (result.ok) {
  //       setConnectionState("ok");
  //       setConnectionMessage(result.message);
  //       return;
  //     }
  //
  //     setConnectionState("error");
  //     setConnectionMessage(result.message);
  //   };
  //
  //   void runHealthCheck();
  //
  //   return () => {
  //     cancelled = true;
  //   };
  // }, []);

  const orderedMusicTracks = useMemo(() => {
    if (allMusic.length === 0) return [];
    const preferredTrack = allMusic.find((trackUrl) =>
      decodeUrlForMatch(trackUrl).includes(PREFERRED_MUSIC_KEYWORD),
    );
    if (!preferredTrack) return allMusic;
    return [
      preferredTrack,
      ...allMusic.filter((trackUrl) => trackUrl !== preferredTrack),
    ];
  }, [allMusic]);

  const activeMusicSrc =
    orderedMusicTracks[currentMusicIndex] ?? orderedMusicTracks[0] ?? null;

  useEffect(() => {
    const audio = musicAudioRef.current;
    if (!audio) return;

    const handlePlay = () => setIsMusicStarted(true);
    const handlePause = () => setIsMusicStarted(false);
    const handleEnded = () => setIsMusicStarted(false);
    const handleError = () => {
      setIsMusicStarted(false);
      setCurrentMusicIndex((prev) => {
        if (orderedMusicTracks.length <= 1) return prev;
        return (prev + 1) % orderedMusicTracks.length;
      });
    };

    audio.addEventListener("play", handlePlay);
    audio.addEventListener("pause", handlePause);
    audio.addEventListener("ended", handleEnded);
    audio.addEventListener("error", handleError);

    return () => {
      audio.removeEventListener("play", handlePlay);
      audio.removeEventListener("pause", handlePause);
      audio.removeEventListener("ended", handleEnded);
      audio.removeEventListener("error", handleError);
    };
  }, [orderedMusicTracks.length]);

  useEffect(() => {
    const audio = musicAudioRef.current;
    if (!audio || !activeMusicSrc) return;

    if (audio.src !== activeMusicSrc) {
      audio.src = activeMusicSrc;
    }

    audio.loop = true;
    audio.preload = "auto";
    audio.muted = !hasUserInteracted;

    if (!isMusicEnabled) {
      audio.pause();
      return;
    }

    void audio.play().catch(() => {});
  }, [activeMusicSrc, hasUserInteracted, isMusicEnabled]);

  // Intersection Observer for each video (play only visible cards on mobile/iOS)
  useEffect(() => {
    const threshold = window.matchMedia("(max-width: 768px)").matches
      ? 0.35
      : 0.6;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          const video = entry.target as HTMLVideoElement;
          if (entry.isIntersecting) {
            video.muted = true;
            video.play().catch(() => {});
          } else {
            video.pause();
          }
        });
      },
      { threshold },
    );

    const videos = videoRefs.current.filter(
      (video): video is HTMLVideoElement => video !== null,
    );
    videos.forEach((video) => observer.observe(video));

    return () => {
      observer.disconnect();
    };
  }, [allVideos]);

  useEffect(() => {
    const markInteracted = () => {
      setHasUserInteracted(true);
    };

    window.addEventListener("pointerdown", markInteracted, { once: true });
    window.addEventListener("touchstart", markInteracted, {
      once: true,
      passive: true,
    });
    window.addEventListener("keydown", markInteracted, { once: true });

    return () => {
      window.removeEventListener("pointerdown", markInteracted);
      window.removeEventListener("touchstart", markInteracted);
      window.removeEventListener("keydown", markInteracted);
    };
  }, []);

  const toggleMusic = () => {
    const audio = musicAudioRef.current;
    const next = !isMusicEnabled;
    setHasUserInteracted(true);
    setIsMusicEnabled(next);

    if (!audio) return;

    if (!next) {
      audio.pause();
      return;
    }

    if (activeMusicSrc && audio.src !== activeMusicSrc) {
      audio.src = activeMusicSrc;
    }
    audio.muted = false;
    void audio.play().catch(() => {});
  };

  const photos = allImages.map((imageUrl, index) => ({
    url: imageUrl,
    caption: predefinedCaptions[index % predefinedCaptions.length],
  }));

  // const loveNotes = [
  //   'ที่รักเป็นคนที่ทำให้เค้ามีความสุขมาก ๆ ',
  //   'ที่รักเป็นคนที่ทำให้เค้ายิ้มได้ไม่ว่ายังไง',
  //   'เธอทำวันธรรมดา ๆ ของเค้าพิเศษขึ้นมากนะ',
  //   'เค้าชอบเวลาที่ได้อยู่กับเธอมาก ๆ เค้าไม่ต้องการอะไรอีกเลย',
  //   'ทุกครั้งที่อยู่ด้วยกันอยากให้เวลามันเดินช้า ๆ',
  //   'อยากไปว่ายน้ำกับเธอด้วยกันอีกจังเลยครับ',
  // ];

  const reasons = [
    "ที่รักเป็นคนที่ทำให้เค้ามีความสุขมาก ๆ ",
    "ที่รักเป็นคนที่ทำให้เค้ายิ้มได้ไม่ว่ายังไง",
    "เธอทำวันธรรมดา ๆ ของเค้าพิเศษขึ้นมากนะ",
    "เค้าชอบเวลาที่ได้อยู่กับเธอมาก ๆ เค้าไม่ต้องการอะไรอีกเลย",
    "ทุกครั้งที่อยู่ด้วยกันอยากให้เวลามันเดินช้า ๆ",
    "อยากไปว่ายน้ำกับเธอด้วยกันอีกจังเลยครับ",
  ];

  const showMusicHint =
    isMusicEnabled &&
    (musicLoading ||
      !!musicError ||
      !activeMusicSrc ||
      !isMusicStarted ||
      !hasUserInteracted);
  const musicHintText = musicLoading
    ? "กำลังโหลดเพลงจาก Supabase..."
    : musicError
      ? `โหลดเพลงไม่สำเร็จ: ${musicError}`
      : !activeMusicSrc
        ? `ไม่พบเพลงใน bucket "${MUSIC_BUCKET}"`
        : hasUserInteracted
          ? "ถ้าไม่ได้ยินเพลง ลองแตะปุ่มอีกครั้ง"
          : "iPhone/iPad ต้องแตะหนึ่งครั้งเพื่อเปิดเสียงเพลง";

  return (
    <div
      className="relative overflow-x-clip"
      style={{
        paddingTop: "calc(4rem + env(safe-area-inset-top))",
        paddingBottom: "max(0.75rem, env(safe-area-inset-bottom))",
      }}
    >
      {/* Supabase health badge (debug) */}
      {/*
      <div
        className={`fixed top-4 left-4 z-[9999] max-w-[420px] px-3 py-2 rounded-lg text-xs shadow border ${
          connectionState === "ok"
            ? "bg-emerald-50 text-emerald-700 border-emerald-200"
            : connectionState === "error"
              ? "bg-red-50 text-red-700 border-red-200"
              : "bg-amber-50 text-amber-700 border-amber-200"
        }`}
      >
        <div className="font-semibold">
          {connectionState === "ok"
            ? "Supabase: Connected"
            : connectionState === "error"
              ? "Supabase: Failed"
              : "Supabase: Checking..."}
        </div>
        {connectionState === "error" && (
          <div className="mt-1 break-words opacity-90">{connectionMessage}</div>
        )}
      </div>
      */}

      {/* Background Music (Supabase Storage) */}
      <audio
        ref={musicAudioRef}
        className="fixed w-px h-px opacity-0 pointer-events-none -left-[9999px] -top-[9999px]"
        src={activeMusicSrc ?? undefined}
        preload="auto"
        playsInline
      />

      {/* Floating Music Control */}
      <div
        className="fixed z-[9999] flex flex-col items-end gap-2"
        style={{
          right: "max(1rem, env(safe-area-inset-right))",
          bottom: "max(1rem, env(safe-area-inset-bottom))",
        }}
      >
        {showMusicHint && (
          <span className="max-w-[13rem] text-center bg-white/90 text-[11px] sm:text-xs px-2 py-1 rounded shadow text-rose-500 animate-pulse pointer-events-none">
            {musicHintText}
          </span>
        )}
        <button
          onClick={toggleMusic}
          className="p-3 sm:p-4 bg-white/90 backdrop-blur-md rounded-full shadow-2xl hover:bg-white active:scale-95 sm:hover:scale-110 transition-all text-rose-500 border-2 border-rose-100 cursor-pointer"
          title={isMusicEnabled ? "ปิดเพลง" : "เปิดเพลง"}
          aria-label={isMusicEnabled ? "ปิดเพลง" : "เปิดเพลง"}
        >
          {isMusicEnabled ? (
            <Volume2 className="w-5 h-5 sm:w-6 sm:h-6" />
          ) : (
            <VolumeX className="w-5 h-5 sm:w-6 sm:h-6" />
          )}
        </button>
      </div>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity, scale }}
        className="relative min-h-[100svh] flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-100 to-red-100 opacity-50" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 100 }}
            className="mb-8"
          >
            <motion.div
              animate={{ scale: [1, 1.1, 1] }}
              transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            >
              <Heart className="w-16 h-16 sm:w-20 sm:h-20 md:w-24 md:h-24 mx-auto text-rose-500 fill-rose-500 drop-shadow-lg" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-3xl sm:text-4xl md:text-6xl lg:text-7xl leading-tight mb-6 font-serif"
          >
            <span className="bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
              เค้าทำเสร็จไว้สักพักนึงแล้ว แต่ยังไม่ได้เอาให้ดู
            </span>
            <br />
            <span className="bg-gradient-to-r from-red-600 via-rose-600 to-pink-600 bg-clip-text text-transparent">
              รักเธอนะครับ ดอกไม้ของเค้า
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-lg sm:text-xl md:text-2xl text-gray-600 mb-10 sm:mb-12 max-w-2xl mx-auto"
          >
            ----- 💌 -----
          </motion.p>

          <motion.button
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.7 }}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => {
              document
                .getElementById("video")
                ?.scrollIntoView({ behavior: "smooth" });
            }}
            className="px-6 sm:px-8 py-3 sm:py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full text-base sm:text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            กดเบา ๆ นะ 👌🏻
          </motion.button>
        </div>
      </motion.section>

      {/* Video Section */}
      <section
        id="video"
        className="py-14 sm:py-20 bg-black min-h-[100svh] relative"
      >
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16 text-white"
          >
            <h2 className="text-3xl sm:text-4xl md:text-6xl font-bold font-serif mb-4 drop-shadow-lg">
              ความรักของเรา
            </h2>
            <p className="text-base sm:text-xl md:text-2xl text-gray-300 drop-shadow-md">
              ช่วงเวลาที่อยู่ในใจของเค้า
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8 max-w-7xl mx-auto">
            {videosLoading ? (
              <p className="text-center text-gray-400 col-span-full">
                กำลังโหลดวิดีโอ...
              </p>
            ) : videosError ? (
              <p className="text-center text-red-400 col-span-full">
                โหลดวิดีโอไม่สำเร็จ: {videosError}
              </p>
            ) : allVideos.length > 0 ? (
              allVideos.map((videoSrc, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="relative rounded-xl sm:rounded-2xl overflow-hidden shadow-2xl bg-gray-900 aspect-[3/4] group"
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    className="w-full h-full object-cover rounded-xl sm:rounded-2xl cursor-pointer"
                    src={videoSrc}
                    muted // Always muted for autoplay/music support
                    playsInline
                    preload="metadata"
                    loop
                    controls
                  >
                    เบราว์เซอร์ของคุณไม่รองรับการเล่นวิดีโอ
                  </video>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                ไม่มีวิดีโอที่จะแสดง
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Photo Memories */}
      <section id="memories" className="py-14 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4">🎞️</h2>
            <p className="text-xl text-gray-600"></p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
            {imagesLoading ? (
              <p className="text-center text-gray-500 col-span-full">
                กำลังโหลดรูปภาพ...
              </p>
            ) : imagesError ? (
              <p className="text-center text-red-500 col-span-full">
                โหลดรูปไม่สำเร็จ: {imagesError}
              </p>
            ) : photos.length > 0 ? (
              photos.map((photo, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -10, scale: 1.02 }}
                  className="group relative bg-white rounded-xl sm:rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <ImageWithFallback
                      src={photo.url}
                      alt={`Memory ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 md:group-hover:scale-110"
                    />
                  </div>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-4 sm:p-6 opacity-100 md:opacity-0 md:transition-opacity md:duration-300 md:group-hover:opacity-100">
                    <p className="text-white text-sm sm:text-base md:text-lg leading-relaxed">
                      {photo.caption}
                    </p>
                  </div>
                </motion.div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full">
                ไม่มีรูปภาพที่จะแสดง
              </p>
            )}
          </div>
        </div>
      </section>

      {/* Love Notes */}
      {/* <section className="py-20 bg-gradient-to-br from-rose-50 to-pink-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4">บันทึกรักจากใจของฉัน</h2>
            <p className="text-xl text-gray-600">ถ้อยคำที่บรรจุความรู้สึกไว้ทั้งจักรวาล</p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-6xl mx-auto">
            {loveNotes.map((note, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                whileInView={{ opacity: 1, scale: 1, rotate: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.15, type: 'spring', stiffness: 100 }}
                whileHover={{ scale: 1.05, rotate: 2 }}
                className="bg-white p-8 rounded-lg shadow-md border-l-4 border-rose-500"
              >
                <p className="text-lg text-gray-700 italic font-serif">"{note}"</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section> */}

      {/* Love Counter */}
      <section className="py-14 sm:py-20 bg-white">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <Clock className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-6 text-rose-500" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4">
              ระยะเวลาที่เราได้รักกัน
            </h2>
            <p className="text-xl text-gray-600 mb-12"></p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 sm:gap-6 max-w-3xl mx-auto">
              {[
                { value: years, label: "ปี" },
                { value: months, label: "เดือน" },
                { value: days, label: "วัน" },
              ].map((item, index) => (
                <motion.div
                  key={item.label}
                  initial={{ opacity: 0, scale: 0 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-gradient-to-br from-rose-100 to-pink-100 p-5 sm:p-6 rounded-xl sm:rounded-2xl shadow-lg"
                >
                  <motion.div
                    key={item.value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-3xl sm:text-4xl md:text-5xl font-bold text-rose-600 mb-2"
                  >
                    {item.value}
                  </motion.div>
                  <div className="text-gray-600">{item.label}</div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      {/* Reasons I Love You */}
      <section className="py-14 sm:py-20 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="container mx-auto px-4 sm:px-6">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-10 sm:mb-16"
          >
            <Sparkles className="w-12 h-12 sm:w-16 sm:h-16 mx-auto mb-6 text-rose-500" />
            <h2 className="text-3xl sm:text-4xl md:text-5xl mb-4"></h2>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-4">
            {reasons.map((reason, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 10, scale: 1.02 }}
                className="flex items-start sm:items-center gap-3 sm:gap-4 bg-white p-4 sm:p-6 rounded-lg shadow-md"
              >
                <Heart className="w-5 h-5 sm:w-6 sm:h-6 text-rose-500 fill-rose-500 flex-shrink-0 mt-1 sm:mt-0" />
                <p className="text-base sm:text-lg text-gray-700">{reason}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Promise */}
      <section className="py-20 sm:py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-100 to-rose-200" />

        <div className="relative z-10 container mx-auto px-4 sm:px-6 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-2xl sm:text-3xl md:text-5xl lg:text-6xl leading-tight font-bold text-rose-800 mb-8 font-serif">
              ไม่ว่าเรื่องของเราจะเป็นยังไงต่อ แต่เค้าก็ยังอยากให้เธอมีความสุข
              ได้ยิ้ม ได้หัวเราะสุดเสียงอยู่เหมือนเดิมนะ
            </h2>

            {!showPromise ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPromise(true)}
                className="px-8 sm:px-12 py-3 sm:py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full text-lg sm:text-xl shadow-2xl hover:shadow-3xl transition-shadow flex items-center gap-3 mx-auto"
              >
                ลองแอบกดดูสิ
                <Heart className="w-6 h-6 fill-current" />
              </motion.button>
            ) : (
              <motion.div
                initial={{ opacity: 0, scale: 0 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ type: "spring", stiffness: 100 }}
                className="space-y-8"
              >
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 1, repeat: Infinity }}
                >
                  <Heart className="w-24 h-24 sm:w-32 sm:h-32 mx-auto text-rose-600 fill-rose-600" />
                </motion.div>
                <p className="text-2xl sm:text-3xl md:text-4xl text-rose-800 font-serif">
                  I Love You To The Moon And Back
                </p>
              </motion.div>
            )}
          </motion.div>
        </div>
      </section>
    </div>
  );
}
