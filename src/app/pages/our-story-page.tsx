import { motion } from 'motion/react';
import { Calendar, MapPin, Star, Coffee } from 'lucide-react';

export function OurStoryPage() {
  const timeline = [
    {
      date: 'January 1, 2020',
      title: 'The Day We Met',
      description:
        'I still remember that day like it was yesterday. Your smile lit up the room, and I knew my life was about to change forever.',
      icon: Star,
      color: 'from-rose-500 to-pink-500',
    },
    {
      date: 'January 15, 2020',
      title: 'Our First Conversation',
      description:
        'We talked for hours, and time just disappeared. Every word you said made me want to know you more.',
      icon: Coffee,
      color: 'from-pink-500 to-red-500',
    },
    {
      date: 'February 14, 2020',
      title: 'The First Laugh We Shared',
      description:
        'Your laughter became my favorite sound. In that moment, I felt truly alive.',
      icon: Star,
      color: 'from-red-500 to-rose-500',
    },
    {
      date: 'March 10, 2020',
      title: 'You Became My Safe Place',
      description:
        'I realized that with you, I could be completely myself. You became my home, my comfort, my everything.',
      icon: MapPin,
      color: 'from-rose-500 to-pink-500',
    },
    {
      date: 'Today',
      title: 'Still Choosing You',
      description:
        'Every single day, I wake up and choose you. And I will keep choosing you, for all the days to come.',
      icon: Calendar,
      color: 'from-pink-500 to-red-500',
    },
  ];

  return (
    <div className="pt-24 pb-16 min-h-screen relative">
      <div className="container mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center mb-20"
        >
          <h1 className="text-5xl md:text-7xl mb-6">
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Our Love Story
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            A journey of two hearts becoming one
          </p>
        </motion.div>

        <div className="max-w-4xl mx-auto relative">
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-0.5 bg-gradient-to-b from-rose-500 via-pink-500 to-red-500 transform md:-translate-x-1/2" />

          {timeline.map((item, index) => {
            const Icon = item.icon;
            const isEven = index % 2 === 0;

            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
                className={`relative flex items-center mb-16 ${isEven ? 'md:flex-row' : 'md:flex-row-reverse'}`}
              >
                <div className="hidden md:block md:w-1/2" />

                <motion.div
                  whileHover={{ scale: 1.2, rotate: 360 }}
                  transition={{ type: 'spring', stiffness: 200 }}
                  className={`absolute left-8 md:left-1/2 transform md:-translate-x-1/2 w-16 h-16 rounded-full bg-gradient-to-br ${item.color} flex items-center justify-center shadow-lg z-10`}
                >
                  <Icon className="w-8 h-8 text-white" />
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02, x: isEven ? 10 : -10 }}
                  className={`ml-24 md:ml-0 md:w-1/2 ${isEven ? 'md:pr-16' : 'md:pl-16'}`}
                >
                  <div className="bg-white p-8 rounded-2xl shadow-lg border-l-4 border-rose-500">
                    <div className="flex items-center gap-2 mb-3 text-rose-600">
                      <Calendar className="w-5 h-5" />
                      <span className="font-semibold">{item.date}</span>
                    </div>
                    <h3 className="text-2xl md:text-3xl mb-4">{item.title}</h3>
                    <p className="text-gray-600 text-lg leading-relaxed">{item.description}</p>
                  </div>
                </motion.div>
              </motion.div>
            );
          })}
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileInView={{ opacity: 1, scale: 1 }}
          viewport={{ once: true }}
          className="mt-32 text-center bg-gradient-to-br from-rose-100 to-pink-100 p-12 rounded-3xl shadow-xl max-w-4xl mx-auto"
        >
          <h2 className="text-3xl md:text-4xl mb-6 font-serif">And this is just the beginning...</h2>
          <p className="text-xl text-gray-700 leading-relaxed max-w-2xl mx-auto">
            Our story continues to unfold with each passing day, each shared smile,
            each gentle touch. I can't wait to write the next chapter with you.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
