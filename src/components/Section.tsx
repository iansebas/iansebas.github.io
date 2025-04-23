'use client';

import { motion } from 'framer-motion';

interface SectionProps {
  title: string;
  bgImages?: string[]; // Now optional since backgrounds are handled by layout
  children: React.ReactNode;
}

const Section = ({ title, children }: SectionProps) => {
  return (
    <motion.section
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="relative min-h-screen py-8"
    >
      {/* Content */}
      <div className="section-content">
        <h2 className="section-heading">{title}</h2>
        {children}
      </div>
    </motion.section>
  );
};

export default Section;