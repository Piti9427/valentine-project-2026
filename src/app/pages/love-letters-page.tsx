import { motion } from 'motion/react';
import { Heart, Mail } from 'lucide-react';
import { useState } from 'react';

export function LoveLettersPage() {
  const [openLetter, setOpenLetter] = useState<number | null>(null);

  const letters = [
    {
      title: 'To My Forever Love',
      date: 'January 5, 2026',
      preview: 'My Dearest Love, As I sit here thinking of you...',
      content: `My Dearest Love,

As I sit here thinking of you, my heart overflows with emotions I can barely put into words. You've become the light in my darkest moments, the warmth on my coldest days, and the peace in my most chaotic times.

Every morning I wake up grateful that you exist, that our paths crossed, and that you chose to walk this journey with me. You've shown me what unconditional love truly means.

With all my heart,
Forever Yours`,
    },
    {
      title: 'A Promise to Keep',
      date: 'December 25, 2025',
      preview: 'I promise to love you in the quiet moments...',
      content: `My Beautiful Soul,

I promise to love you in the quiet moments and the loud celebrations. I promise to hold your hand through every storm and dance with you under every rainbow.

I promise to be your safe haven, your biggest cheerleader, and your partner in all of life's adventures. No matter what tomorrow brings, I will choose you, again and again.

This isn't just a promise—it's my oath, my commitment, my everything.

Eternally Yours`,
    },
    {
      title: 'Why I Love You',
      date: 'October 14, 2025',
      preview: 'Let me count the ways...',
      content: `My Darling,

Let me count the ways I love you, though numbers could never capture the depth of my feelings.

I love the way your eyes light up when you talk about your passions. I love your gentle kindness that touches everyone around you. I love how you make me laugh even when I don't want to smile.

But most of all, I love how you make me want to be a better person every single day.

All My Love,
Always`,
    },
    {
      title: 'In Every Lifetime',
      date: 'September 1, 2025',
      preview: 'If I could choose, I would choose you...',
      content: `My One True Love,

If I could choose, I would choose you in every lifetime, in every universe, in every possible reality. There's something about us that transcends time and space—a connection so deep, it feels like our souls have known each other for eternities.

You are my past, my present, and my future. You are my everything.

Through All Time,
Your Soulmate`,
    },
    {
      title: 'The Little Things',
      date: 'July 20, 2025',
      preview: 'The small moments that mean the most...',
      content: `My Sweet Love,

The small moments mean the most to me. The way you reach for my hand without thinking. The soft smile you give me from across the room. The way you know exactly what I need before I even say it.

These little things aren't little at all—they're everything. They're the threads that weave our beautiful tapestry of love.

Thank you for every small, perfect moment.

With Endless Gratitude,
Yours`,
    },
    {
      title: 'My Heart is Yours',
      date: 'May 8, 2025',
      preview: 'From the moment I met you...',
      content: `My Beloved,

From the moment I met you, something shifted in my universe. Colors seemed brighter, music sounded sweeter, and life felt more meaningful. You didn't just enter my life—you became my life.

My heart belongs to you, completely and irrevocably. It beats your name with every rhythm, whispers your essence with every breath.

You are my home, my heart, my everything.

Forever and Always,
Your Love`,
    },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen bg-gradient-to-br from-rose-50 via-pink-50 to-red-50 relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <motion.div
            animate={{ scale: [1, 1.1, 1], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Mail className="w-20 h-20 mx-auto mb-6 text-rose-500" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl mb-6">
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Love Letters
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Words from my heart to yours
          </p>
        </motion.div>

        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {letters.map((letter, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group"
            >
              <motion.div
                whileHover={{ y: -8, scale: 1.02 }}
                onClick={() => setOpenLetter(openLetter === index ? null : index)}
                className="bg-white rounded-2xl shadow-lg overflow-hidden cursor-pointer border-2 border-transparent hover:border-rose-300 transition-all"
              >
                <div className="p-8 bg-gradient-to-br from-rose-100 to-pink-100">
                  <div className="flex items-center justify-between mb-4">
                    <Heart className="w-8 h-8 text-rose-500 fill-rose-500" />
                    <span className="text-sm text-gray-600">{letter.date}</span>
                  </div>
                  <h3 className="text-2xl mb-3">{letter.title}</h3>
                  <p className="text-gray-600 italic">"{letter.preview}"</p>
                </div>

                <motion.div
                  initial={false}
                  animate={{
                    height: openLetter === index ? 'auto' : 0,
                    opacity: openLetter === index ? 1 : 0,
                  }}
                  className="overflow-hidden"
                >
                  <div className="p-8 bg-white border-t border-rose-100">
                    <div className="whitespace-pre-line text-gray-700 leading-relaxed font-serif text-lg">
                      {letter.content}
                    </div>
                  </div>
                </motion.div>

                <div className="p-4 bg-rose-50 text-center">
                  <span className="text-sm text-rose-600">
                    {openLetter === index ? 'Click to close' : 'Click to read'}
                  </span>
                </div>
              </motion.div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center bg-white p-12 rounded-3xl shadow-xl max-w-3xl mx-auto"
        >
          <p className="text-2xl text-gray-700 italic font-serif">
            "Every word I write is a piece of my heart, and every piece belongs to you."
          </p>
        </motion.div>
      </div>
    </div>
  );
}
