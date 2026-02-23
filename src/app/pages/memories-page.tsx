import { motion } from 'motion/react';
import { Camera, Heart, Star } from 'lucide-react';
import { ImageWithFallback } from '../components/figma/ImageWithFallback';
import { useState } from 'react';

export function MemoriesPage() {
  const [selectedImage, setSelectedImage] = useState<number | null>(null);

  const memories = [
    {
      url: 'https://images.unsplash.com/photo-1658851866325-49fb8b7fbcb2?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGNvdXBsZSUyMHN1bnNldHxlbnwxfHx8fDE3Njc1NjQwMTF8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Sunset Dreams',
      description: 'The evening we watched the sun paint the sky, and I realized you paint my world with color.',
      date: 'Summer 2024',
    },
    {
      url: 'https://images.unsplash.com/photo-1506014299253-3725319c0f69?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBob2xkaW5nJTIwaGFuZHN8ZW58MXx8fHwxNzY3NTk5MTU5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Hand in Hand',
      description: 'Walking through life together, one step at a time, fingers intertwined, hearts connected.',
      date: 'Spring 2024',
    },
    {
      url: 'https://images.unsplash.com/photo-1615500025837-cf3a8716c83d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGRpbm5lciUyMGRhdGV8ZW58MXx8fHwxNzY3NTk5MTYwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Candlelit Moments',
      description: 'The night time stood still, and all that mattered was you and me.',
      date: 'Winter 2023',
    },
    {
      url: 'https://images.unsplash.com/photo-1766974888376-3697b53495f0?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBsYXVnaGluZyUyMHRvZ2V0aGVyfGVufDF8fHx8MTc2NzU1NTgzOXww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Laughter & Joy',
      description: 'Your laugh is the melody my heart dances to.',
      date: 'Fall 2024',
    },
    {
      url: 'https://images.unsplash.com/photo-1728011861432-3259e369ee5c?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBiZWFjaCUyMHdhbGt8ZW58MXx8fHwxNzY3NTk5MzA5fDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'By the Ocean',
      description: 'Waves crashing, hearts beating in sync, love flowing endlessly.',
      date: 'Summer 2023',
    },
    {
      url: 'https://images.unsplash.com/photo-1761569443180-9baa5be7a87f?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMHBpY25pY3xlbnwxfHx8fDE3Njc1ODA4Mjl8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Picnic Paradise',
      description: 'Simple moments, extraordinary love.',
      date: 'Spring 2023',
    },
    {
      url: 'https://images.unsplash.com/photo-1656887321137-65f0549ba02a?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBraXNzaW5nJTIwc3Vuc2V0fGVufDF8fHx8MTc2NzU5OTMwOXww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Golden Hour Kiss',
      description: 'The moment that felt like forever.',
      date: 'Fall 2023',
    },
    {
      url: 'https://images.unsplash.com/photo-1489924482931-41c82360d29d?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBjaXR5JTIwbmlnaHR8ZW58MXx8fHwxNzY3NTk5MTYxfDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'City Lights',
      description: 'Among millions, I only see you.',
      date: 'Winter 2024',
    },
    {
      url: 'https://images.unsplash.com/photo-1765390359028-956418296503?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxyb21hbnRpYyUyMGZsb3dlcnMlMjByb3Nlc3xlbnwxfHx8fDE3Njc1OTMxNzN8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Flowers & Love',
      description: 'Every petal a promise, every stem a story.',
      date: 'Spring 2024',
    },
    {
      url: 'https://images.unsplash.com/photo-1763713512972-58f361318408?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjBkYW5jaW5nJTIwdG9nZXRoZXJ8ZW58MXx8fHwxNzY3NTk5MzEwfDA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Dancing Together',
      description: 'Moving to the rhythm of our hearts.',
      date: 'Summer 2024',
    },
    {
      url: 'https://images.unsplash.com/photo-1731936757627-f2a1ea5893e6?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxjb3VwbGUlMjB3aW50ZXIlMjBjb3p5fGVufDF8fHx8MTc2NzU5OTMxMXww&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Winter Warmth',
      description: 'Cold outside, but warm in your embrace.',
      date: 'Winter 2023',
    },
    {
      url: 'https://images.unsplash.com/photo-1694503522904-50163a3e7141?crop=entropy&cs=tinysrgb&fit=max&fm=jpg&ixid=M3w3Nzg4Nzd8MHwxfHNlYXJjaHwxfHxsb3ZlJTIwaGVhcnQlMjBib2tlaHxlbnwxfHx8fDE3Njc1MzkyOTd8MA&ixlib=rb-4.1.0&q=80&w=1080',
      title: 'Love in Focus',
      description: 'Through all the blur of life, you remain crystal clear.',
      date: 'Fall 2024',
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
          <motion.div
            animate={{ rotate: [0, -10, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
          >
            <Camera className="w-20 h-20 mx-auto mb-6 text-rose-500" />
          </motion.div>
          <h1 className="text-5xl md:text-7xl mb-6">
            <span className="bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              Our Memories
            </span>
          </h1>
          <p className="text-xl md:text-2xl text-gray-600 max-w-3xl mx-auto">
            Every photo tells our story, every moment is a treasure
          </p>
        </motion.div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {memories.map((memory, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.05 }}
              whileHover={{ scale: 1.03 }}
              onClick={() => setSelectedImage(index)}
              className="break-inside-avoid cursor-pointer group"
            >
              <div className="bg-white rounded-2xl shadow-lg overflow-hidden hover:shadow-2xl transition-shadow">
                <div className="relative overflow-hidden">
                  <ImageWithFallback
                    src={memory.url}
                    alt={memory.title}
                    className="w-full h-auto transition-transform duration-500 group-hover:scale-110"
                  />
                  <motion.div
                    initial={{ opacity: 0 }}
                    whileHover={{ opacity: 1 }}
                    className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent flex flex-col justify-end p-6"
                  >
                    <div className="flex items-center gap-2 mb-2 text-rose-400">
                      <Star className="w-4 h-4 fill-current" />
                      <span className="text-sm">{memory.date}</span>
                    </div>
                    <h3 className="text-white text-xl mb-2">{memory.title}</h3>
                    <p className="text-white/90 text-sm">{memory.description}</p>
                  </motion.div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {selectedImage !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedImage(null)}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4 cursor-pointer"
          >
            <motion.div
              initial={{ scale: 0.8 }}
              animate={{ scale: 1 }}
              className="relative max-w-5xl w-full"
              onClick={(e) => e.stopPropagation()}
            >
              <ImageWithFallback
                src={memories[selectedImage].url}
                alt={memories[selectedImage].title}
                className="w-full h-auto rounded-2xl shadow-2xl"
              />
              <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-8 rounded-b-2xl">
                <div className="flex items-center gap-2 mb-2 text-rose-400">
                  <Star className="w-5 h-5 fill-current" />
                  <span>{memories[selectedImage].date}</span>
                </div>
                <h3 className="text-white text-3xl mb-3">{memories[selectedImage].title}</h3>
                <p className="text-white/90 text-lg">{memories[selectedImage].description}</p>
              </div>
              <button
                onClick={() => setSelectedImage(null)}
                className="absolute top-4 right-4 bg-white/20 hover:bg-white/30 backdrop-blur-sm rounded-full p-3 transition-colors"
              >
                <span className="text-white text-2xl">✕</span>
              </button>
            </motion.div>
          </motion.div>
        )}

        <motion.div
          initial={{ opacity: 0, y: 50 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-20 text-center bg-gradient-to-br from-rose-100 to-pink-100 p-12 rounded-3xl shadow-xl max-w-4xl mx-auto"
        >
          <Heart className="w-12 h-12 mx-auto mb-6 text-rose-500 fill-rose-500" />
          <p className="text-2xl md:text-3xl text-gray-700 italic font-serif">
            "A thousand photos couldn't capture how much I love you, but each one holds a piece of my heart."
          </p>
        </motion.div>
      </div>
    </div>
  );
}
