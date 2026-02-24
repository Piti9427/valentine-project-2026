import { motion, AnimatePresence } from 'motion/react';
import { Lock, Heart, Eye, EyeOff } from 'lucide-react';
import { useMemo, useState } from 'react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useSupabaseAssets } from '../hooks/useSupabaseAssets';

// Captions from home-page.tsx
const predefinedCaptions = [
  'พาเธอไปทำเล็บแถวตลาดชัชวาล เป็นแรก ๆ เลยที่ได้ไปกินข้าวด้วยกันข้างนอก',
  'ตอนที่เราได้ไปเกาะล้านด้วยกัน ตอนนี้แฮปปี้มาก ๆ เลย',
  'ช่วงที่เริ่มมาบ้านเค้าแรก ๆ',
  'ได้เริ่มไปอยู่หอด้วยกัน เริ่มใช้ชีวิตด้วยกันจริง ๆ ',
  'แรก ๆ ที่ไปดูหนังกันในโรงต้องมีป๊อปคอร์นกับน้ำด้วยไม่งั้นไม่ยอมแนะ',
  'ได้มีตุ๊กตานอนกอดมีน้องฝันดีมานอนด้วย',
  'พาหนูไปกินสเต๊กลุงนวด พลอยชอบกินมากก',
  'เริ่มมาบ้าน มานอนด้วยกันบ่อย ๆ แฮปปี้แฮปปี้',
  'อยู่นอนเล่นด้วยกันทั้งวัน',
  'ลองให้เธอเป็นนินจาโคโนฮะครั้งแรก',
  'พากินไปซื้อของกินที่หลังโรงเรียน',
  'พากันไปเดินตลาดเนรมิต ตอนกลับฝนตกต้องรีบกลับไปกับอิคคิว 55555555',
  'พลอยเริ่มทำงานที่ยูนิโค่ เริ่มมาหากันบ่อย ๆ',
  'ไปงานรับปริญญาของพลอยย ตื่นเต้นมากเลยทำหน้าทำตัวไม่ถูกไปหมดเลย',
  'ได้พาเธอไปทำ workshop วาดเฟรมรูปแต่ก็มีเรื่องให้น้อยใจกันนิดหน่อย',
  'รูปที่ถ่ายเธอตั้งแต่โทรศัพท์เก่านู่นเลยย นั่งใต้อาคารด้วยกันบ่อย ๆ',
  'ตอนนั้นเริ่มรู้สึกเธอเปิดใจให้เยอะขึ้นเริ่มเล่นด้วยกันมากขึ้นมาก ๆ ',
  'ได้ไปเดตกันหอศิลป์อันนี้เพิ่งไปกันมาเลยแอบมาเพิ่มทีหลัง',
];

// Reasons from home-page.tsx
const reasons = [
  'ที่รักเป็นคนที่ทำให้เค้ามีความสุขมาก ๆ ',
  'ที่รักเป็นคนที่ทำให้เค้ายิ้มได้ไม่ว่ายังไง',
  'เธอทำวันธรรมดา ๆ ของเค้าพิเศษขึ้นมากนะ',
  'เค้าชอบเวลาที่ได้อยู่กับเธอมาก ๆ เค้าไม่ต้องการอะไรอีกเลย',
  'ทุกครั้งที่อยู่ด้วยกันอยากให้เวลามันเดินช้า ๆ',
  'อยากไปว่ายน้ำกับเธอด้วยกันอีกจังเลยครับ',
];

const hashString = (value: string) => {
  let hash = 0;
  for (let i = 0; i < value.length; i += 1) {
    hash = (hash << 5) - hash + value.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
};

const createSeededRandom = (seed: number) => {
  let state = seed % 2147483647;
  if (state <= 0) state += 2147483646;
  return () => {
    state = (state * 16807) % 2147483647;
    return state / 2147483647;
  };
};

export function PrivateGalleryPage() {
  const { items: allImages, loading: imagesLoading, error: imagesError } =
    useSupabaseAssets('images', ['jpeg', 'jpg', 'png', 'webp', 'avif']);
  const [password, setPassword] = useState('');
  const [isUnlocked, setIsUnlocked] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState(false);

  const SECRET_PASSWORD = 'ใต้อาคาร';

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === SECRET_PASSWORD) {
      setIsUnlocked(true);
      setError(false);
    } else {
      setError(true);
      setTimeout(() => setError(false), 2000);
    }
  };

  const privatePhotos = useMemo(
    () =>
      allImages.map((url, index) => {
        const rng = createSeededRandom(hashString(url) + index);
        return {
          url,
          note: predefinedCaptions[index % predefinedCaptions.length] || '',
          rotate: (rng() - 0.5) * 15,
          x: (index % 3) * 30 + 5 + rng() * 5,
          y: Math.floor(index / 3) * 400 + rng() * 40,
        };
      }),
    [allImages],
  );

  // Map reasons with stable random values and pixel-based Y
  const privateNotes = useMemo(
    () =>
      reasons.map((text, index) => ({
        text,
        color: ['from-rose-200 to-pink-200', 'from-pink-200 to-red-200', 'from-red-200 to-rose-200'][index % 3],
        rotate: (Math.random() - 0.5) * 10,
        x: (index % 2) * 45 + 10 + Math.random() * 5,
        y: Math.floor(index / 2) * 250 + Math.random() * 30,
      })),
    [],
  );

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-rose-900 via-pink-900 to-red-900 relative overflow-x-hidden">
      <div className="container mx-auto px-4">
        <AnimatePresence mode="wait">
          {!isUnlocked ? (
            <motion.div
              key="lock"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="min-h-[80vh] flex items-center justify-center"
            >
              <motion.div
                initial={{ scale: 0.8, y: 50 }}
                animate={{ scale: 1, y: 0 }}
                className="bg-white rounded-3xl shadow-2xl p-12 max-w-md w-full"
              >
                <motion.div
                  animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
                  transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
                >
                  <Lock className="w-20 h-20 mx-auto mb-6 text-rose-500" />
                </motion.div>

                <h1 className="text-3xl md:text-4xl text-center mb-4 font-serif">
                  <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
                    พื้นที่ลับของเรา
                  </span>
                </h1>
                <p className="text-center text-gray-600 mb-8">
                  ใส่รหัสผ่านเพื่อปลดล็อคความทรงจำที่มีแค่เราที่รู้
                </p>

                <form onSubmit={handleUnlock} className="space-y-6">
                  <div className="relative">
                    <input
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      placeholder="รหัสผ่านคือ..."
                      className={`w-full px-4 py-3 rounded-lg border-2 transition-colors ${
                        error
                          ? 'border-red-500 focus:border-red-600'
                          : 'border-rose-200 focus:border-rose-500'
                      } outline-none`}
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>

                  {error && (
                    <motion.p
                      initial={{ opacity: 0, y: -10 }}
                      animate={{ opacity: 1, y: 0 }}
                      className="text-red-500 text-center text-sm"
                    >
                      รหัสผ่านไม่ถูกต้อง ลองใหม่นะที่รัก! ❤️
                    </motion.p>
                  )}

                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    type="submit"
                    className="w-full px-6 py-3 bg-gradient-to-r from-rose-500 to-pink-600 text-white rounded-lg shadow-lg hover:shadow-xl transition-shadow"
                  >
                    เปิดดูความทรงจำ
                  </motion.button>
                </form>

                <p className="text-center text-gray-500 text-sm mt-6">
                  💡 คำใบ้: ตอนเรียนที่ สว เราชอบไปนั่งกันที่ไหนตอนเลิกเรียน
                </p>
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="gallery"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-center mb-20"
              >
                <Heart className="w-20 h-20 mx-auto mb-6 text-rose-200 fill-rose-200" />
                <h1 className="text-5xl md:text-7xl mb-6 text-white font-serif">กล่องเก็บความทรงจำ</h1>
                <p className="text-xl md:text-2xl text-rose-200 max-w-3xl mx-auto italic">
                  "ทุกช่วงเวลาที่ผ่านมา มันมีค่าสำหรับเค้าเสมอ"
                </p>
              </motion.div>

              {/* Draggable Photos Section - Adjusted min-h for pixel-based children */}
              <div className="relative min-h-[2500px] mb-20">
                {imagesLoading ? (
                  <p className="text-center text-rose-200">กำลังโหลดรูปภาพ...</p>
                ) : imagesError ? (
                  <p className="text-center text-red-200">โหลดรูปไม่สำเร็จ: {imagesError}</p>
                ) : privatePhotos.length > 0 ? (
                  privatePhotos.map((photo, index) => (
                    <motion.div
                      key={index}
                      initial={{ opacity: 0, scale: 0, rotate: 0 }}
                      animate={{ opacity: 1, scale: 1, rotate: photo.rotate }}
                      transition={{ delay: (index % 10) * 0.1 }}
                      whileHover={{ scale: 1.1, rotate: 0, zIndex: 100 }}
                      drag
                      dragConstraints={{ top: -200, bottom: 2500, left: -200, right: 1200 }}
                      className="absolute cursor-move"
                      style={{ left: `${photo.x}%`, top: `${photo.y}px`, width: '280px' }}
                    >
                      <div className="bg-white p-3 pb-8 rounded shadow-2xl transform transition-transform">
                        <ImageWithFallback
                          src={photo.url}
                          alt={`Memory ${index + 1}`}
                          className="w-full h-64 object-cover rounded-sm pointer-events-none"
                        />
                        <p className="text-center mt-4 text-sm text-gray-700 italic font-serif px-2">
                          {photo.note}
                        </p>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <p className="text-center text-rose-200">ไม่มีรูปภาพที่จะแสดง</p>
                )}
              </div>

              {/* Draggable Notes Section */}
              <div className="relative min-h-[800px] mt-32">
                <h2 className="text-3xl text-white text-center mb-12 font-serif">โน้ตเล็ก ๆ ถึงเธอ</h2>
                {privateNotes.map((note, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, scale: 0, rotate: 0 }}
                    animate={{ opacity: 1, scale: 1, rotate: note.rotate }}
                    transition={{ delay: index * 0.15 + 1 }}
                    whileHover={{ scale: 1.1, rotate: 0, zIndex: 100 }}
                    drag
                    dragConstraints={{ top: -100, bottom: 800, left: -200, right: 1000 }}
                    className="absolute cursor-move"
                    style={{ left: `${note.x}%`, top: `${note.y}px`, width: '240px' }}
                  >
                    <div className={`bg-gradient-to-br ${note.color} p-6 rounded-lg shadow-2xl`}>
                      <p className="text-gray-800 text-lg font-serif italic text-center">"{note.text}"</p>
                      <Heart className="w-6 h-6 mx-auto mt-3 text-rose-600 fill-rose-600" />
                    </div>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 50 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 2 }}
                className="mt-32 text-center bg-white/10 backdrop-blur-sm p-12 rounded-3xl max-w-4xl mx-auto"
              >
                <p className="text-3xl text-white italic font-serif leading-relaxed">
                  "ไม่ว่าเรื่องของเราจะเป็นยังไงต่อ แต่เค้าก็ยังอยากให้เธอมีความสุข<br/>
                  ได้ยิ้ม ได้หัวเราะสุดเสียงอยู่เหมือนเดิมนะ"
                </p>
                <div className="mt-8 flex justify-center gap-4">
                   <Heart className="w-8 h-8 text-rose-400 fill-rose-400 animate-pulse" />
                   <Heart className="w-8 h-8 text-pink-400 fill-pink-400 animate-pulse delay-75" />
                   <Heart className="w-8 h-8 text-rose-400 fill-rose-400 animate-pulse delay-150" />
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
