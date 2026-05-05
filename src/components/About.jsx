import { Code, BrainCircuit, Terminal, Rocket } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    name: 'Machine Learning',
    description: 'Dive deep into algorithms that allow computers to learn from data without being explicitly programmed.',
    icon: BrainCircuit,
  },
  {
    name: 'Deep Learning',
    description: 'Explore neural networks and advanced models for image recognition, NLP, and more.',
    icon: Code,
  },
  {
    name: 'Web Development',
    description: 'Build modern, responsive web applications to showcase AI models and real-world projects.',
    icon: Terminal,
  },
  {
    name: 'Real-world Projects',
    description: 'Apply your knowledge by building and deploying solutions that solve actual problems.',
    icon: Rocket,
  },
];

const About = () => {
  return (
    <section id="about" className="py-24 bg-brand-dark">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="lg:text-center"
        >
          <h2 className="text-base text-gray-400 font-semibold tracking-wide uppercase">About AIONAI</h2>
          <p className="mt-2 text-3xl leading-8 font-extrabold tracking-tight text-white sm:text-4xl">
            Innovation of Neural Intelligence
          </p>
          <p className="mt-4 max-w-2xl text-xl text-gray-400 lg:mx-auto">
            Aiml club at svyasa
          </p>
        </motion.div>

        <div className="mt-20">
          <motion.h3 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            className="text-2xl font-bold text-center text-white mb-12"
          >
            What We Teach
          </motion.h3>
          <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
            {features.map((feature, index) => (
              <motion.div 
                key={feature.name} 
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="pt-6"
              >
                <div className="flow-root bg-brand-accent rounded-lg px-6 pb-8 transform transition duration-500 hover:-translate-y-2 hover:bg-white/5 border border-white/5 h-full shadow-lg">
                  <div className="-mt-6">
                    <div>
                      <span className="inline-flex items-center justify-center p-3 bg-white rounded-md shadow-[0_0_15px_rgba(255,255,255,0.4)]">
                        <feature.icon className="h-6 w-6 text-black" aria-hidden="true" />
                      </span>
                    </div>
                    <h3 className="mt-8 text-lg font-medium text-white tracking-tight">{feature.name}</h3>
                    <p className="mt-5 text-base text-gray-400">
                      {feature.description}
                    </p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default About;
