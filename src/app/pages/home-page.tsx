import { motion, useScroll, useTransform } from "motion/react";
import { useState, useEffect, useRef } from "react";
import { Heart, Clock, Sparkles, Volume2, VolumeX } from "lucide-react";
import { ImageWithFallback } from "../components/figma/ImageWithFallback";
import { useSupabaseAssets } from "../hooks/useSupabaseAssets";
// import { checkSupabaseConnection } from "../lib/supabase";

const YOUTUBE_MUSIC_VIDEO_ID = "Z6EntwuX_Xs";
const YOUTUBE_MUSIC_EMBED_URL = `https://www.youtube.com/embed/${YOUTUBE_MUSIC_VIDEO_ID}?autoplay=1&loop=1&playlist=${YOUTUBE_MUSIC_VIDEO_ID}&controls=0&modestbranding=1&rel=0`;

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

  const [years, setYears] = useState(0);
  const [months, setMonths] = useState(0);
  const [days, setDays] = useState(0);
  const [showPromise, setShowPromise] = useState(false);
  const [isMusicEnabled, setIsMusicEnabled] = useState(true);
  // const [connectionState, setConnectionState] = useState<
  //   "checking" | "ok" | "error"
  // >("checking");
  // const [connectionMessage, setConnectionMessage] = useState(
  //   "Checking Supabase...",
  // );

  const heroRef = useRef<HTMLElement>(null);
  const videoSectionRef = useRef<HTMLElement>(null);
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
      const now = new Date();

      let yearsDiff = now.getFullYear() - startDate.getFullYear();
      let monthsDiff = now.getMonth() - startDate.getMonth();
      let daysDiff = now.getDate() - startDate.getDate();

      // Adjust for negative days
      if (daysDiff < 0) {
        monthsDiff -= 1;
        // Get the number of days in the previous month
        const prevMonth = new Date(now.getFullYear(), now.getMonth(), 0);
        daysDiff += prevMonth.getDate();
      }

      // Adjust for negative months
      if (monthsDiff < 0) {
        yearsDiff -= 1;
        monthsDiff += 12;
      }

      setYears(yearsDiff);
      setMonths(monthsDiff);
      setDays(daysDiff);
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

  // Intersection Observer for Video Section (Video Only)
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            // Play all videos muted
            videoRefs.current.forEach((video) => {
              if (video) {
                video.muted = true;
                video.play().catch(() => {});
              }
            });
          } else {
            // Pause videos when out of view
            videoRefs.current.forEach((video) => {
              if (video) video.pause();
            });
          }
        });
      },
      { threshold: 0.1 },
    );

    const videoSectionEl = videoSectionRef.current;
    if (videoSectionEl) observer.observe(videoSectionEl);

    return () => {
      if (videoSectionEl) observer.unobserve(videoSectionEl);
    };
  }, []);

  const toggleMusic = () => {
    setIsMusicEnabled((prev) => !prev);
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

  return (
    <div className="pt-16 relative">
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

      {/* Background Music (YouTube) */}
      {isMusicEnabled && (
        <iframe
          className="hidden"
          width="0"
          height="0"
          src={YOUTUBE_MUSIC_EMBED_URL}
          title="Background Music"
          allow="autoplay; encrypted-media"
        />
      )}

      {/* Floating Music Control */}
      <div className="fixed bottom-6 right-6 z-[9999] flex flex-col items-end gap-2">
        {!isMusicEnabled && (
          <span className="bg-white/90 text-xs px-2 py-1 rounded shadow text-rose-500 animate-pulse pointer-events-none">
            กดเพื่อเปิดเพลงคลอ 🎵
          </span>
        )}
        <button
          onClick={toggleMusic}
          className="p-4 bg-white/90 backdrop-blur-md rounded-full shadow-2xl hover:bg-white hover:scale-110 transition-all text-rose-500 border-2 border-rose-100 cursor-pointer"
          title={isMusicEnabled ? "ปิดเพลง" : "เปิดเพลง"}
          aria-label={isMusicEnabled ? "ปิดเพลง" : "เปิดเพลง"}
        >
          {isMusicEnabled ? (
            <Volume2 className="w-6 h-6" />
          ) : (
            <VolumeX className="w-6 h-6" />
          )}
        </button>
      </div>

      {/* Hero Section */}
      <motion.section
        ref={heroRef}
        style={{ opacity, scale }}
        className="relative min-h-screen flex items-center justify-center overflow-hidden"
      >
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-100 to-red-100 opacity-50" />

        <div className="relative z-10 container mx-auto px-4 text-center">
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
              <Heart className="w-24 h-24 mx-auto text-rose-500 fill-rose-500 drop-shadow-lg" />
            </motion.div>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="text-5xl md:text-7xl mb-6 font-serif"
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
            className="text-xl md:text-2xl text-gray-600 mb-12 max-w-2xl mx-auto"
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
            className="px-8 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full text-lg shadow-lg hover:shadow-xl transition-shadow"
          >
            กดเบา ๆ นะ 👌🏻
          </motion.button>
        </div>
      </motion.section>

      {/* Video Section */}
      <section
        id="video"
        ref={videoSectionRef}
        className="py-20 bg-black min-h-screen relative"
      >
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16 text-white"
          >
            <h2 className="text-4xl md:text-6xl font-bold font-serif mb-4 drop-shadow-lg">
              ความรักของเรา
            </h2>
            <p className="text-xl md:text-2xl text-gray-300 drop-shadow-md">
              ช่วงเวลาที่อยู่ในใจของเค้า
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-7xl mx-auto">
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
                  className="relative rounded-2xl overflow-hidden shadow-2xl bg-gray-900 aspect-[3/4] group"
                >
                  <video
                    ref={(el) => {
                      videoRefs.current[index] = el;
                    }}
                    className="w-full h-full object-cover rounded-2xl cursor-pointer"
                    src={videoSrc}
                    muted // Always muted for autoplay/music support
                    playsInline
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
      <section id="memories" className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl md:text-5xl mb-4">🎞️</h2>
            <p className="text-xl text-gray-600"></p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
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
                  className="group relative bg-white rounded-2xl shadow-lg overflow-hidden"
                >
                  <div className="aspect-[4/5] overflow-hidden">
                    <ImageWithFallback
                      src={photo.url}
                      alt={`Memory ${index + 1}`}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                    />
                  </div>
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent flex items-end p-6"
                  >
                    <p className="text-white text-lg">{photo.caption}</p>
                  </motion.div>
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
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center max-w-4xl mx-auto"
          >
            <Clock className="w-16 h-16 mx-auto mb-6 text-rose-500" />
            <h2 className="text-4xl md:text-5xl mb-4">
              ระยะเวลาที่เราได้รักกัน
            </h2>
            <p className="text-xl text-gray-600 mb-12"></p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
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
                  className="bg-gradient-to-br from-rose-100 to-pink-100 p-6 rounded-2xl shadow-lg"
                >
                  <motion.div
                    key={item.value}
                    initial={{ scale: 1.2, opacity: 0 }}
                    animate={{ scale: 1, opacity: 1 }}
                    className="text-4xl md:text-5xl font-bold text-rose-600 mb-2"
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
      <section className="py-20 bg-gradient-to-br from-pink-50 to-rose-50">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mb-16"
          >
            <Sparkles className="w-16 h-16 mx-auto mb-6 text-rose-500" />
            <h2 className="text-4xl md:text-5xl mb-4"></h2>
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
                className="flex items-center gap-4 bg-white p-6 rounded-lg shadow-md"
              >
                <Heart className="w-6 h-6 text-rose-500 fill-rose-500 flex-shrink-0" />
                <p className="text-lg text-gray-700">{reason}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* The Promise */}
      <section className="py-32 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-rose-100 via-pink-100 to-rose-200" />

        <div className="relative z-10 container mx-auto px-4 text-center">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="max-w-3xl mx-auto"
          >
            <h2 className="text-4xl md:text-6xl font-bold text-rose-800 mb-8 font-serif">
              ไม่ว่าเรื่องของเราจะเป็นยังไงต่อ แต่เค้าก็ยังอยากให้เธอมีความสุข
              ได้ยิ้ม ได้หัวเราะสุดเสียงอยู่เหมือนเดิมนะ
            </h2>

            {!showPromise ? (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setShowPromise(true)}
                className="px-12 py-4 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-full text-xl shadow-2xl hover:shadow-3xl transition-shadow flex items-center gap-3 mx-auto"
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
                  <Heart className="w-32 h-32 mx-auto text-rose-600 fill-rose-600" />
                </motion.div>
                <p className="text-3xl md:text-4xl text-rose-800 font-serif">
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
