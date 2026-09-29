import { motion, type Variants } from "motion/react";
import siteData from "@/data/site.json";

const containerVariants: Variants = {
  hidden: {},
  visible: {
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.15,
    },
  },
};

const itemVariants: Variants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.22, 1, 0.36, 1], // Exact same smooth ease from in-view
    },
  },
};

/**
 * About section - concise paragraphs in Uday Kiran's writing style,
 * placed directly below the Hero with a section header banner bar.
 */
export function About() {
  return (
    <section id="about" className="w-full">
      <div className="h-px w-full bg-border" />
      <div className="px-4 pt-4 pb-6 md:px-6 md:pt-5 md:pb-8">
        <motion.div
          initial="hidden"
          animate="visible"
          variants={containerVariants}
          className="space-y-2.5"
        >
          {siteData.about.paragraphs.map((paragraph, index) => (
            <motion.div key={index} variants={itemVariants}>
              <p className="text-base text-foreground/90 font-sans leading-relaxed text-justify sm:text-left">
                {paragraph}
              </p>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
