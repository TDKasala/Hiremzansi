import { useState, useEffect, useRef } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { useTranslation } from "react-i18next";
import { Link } from "wouter";
import successImagePath from "@assets/file_00000000a38861f9b9d4d1c35ef723d3.png";

// Removing the outer section wrapper since we're embedding this in the DropdownFeaturesSection
export default function SuccessStoriesSection() {
  const { t } = useTranslation();
  const [isVisible, setIsVisible] = useState(false);
  const sectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.unobserve(entry.target);
        }
      },
      { threshold: 0.2 }
    );

    if (sectionRef.current) {
      observer.observe(sectionRef.current);
    }

    return () => {
      if (sectionRef.current) {
        observer.unobserve(sectionRef.current);
      }
    };
  }, []);

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1, 
      transition: { 
        staggerChildren: 0.3,
        duration: 0.5
      } 
    }
  };

  const itemVariants = {
    hidden: { y: 50, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1, 
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 12 
      } 
    }
  };

  const imageVariants = {
    hidden: { scale: 0.8, opacity: 0, rotateY: 30 },
    visible: { 
      scale: 1, 
      opacity: 1, 
      rotateY: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        duration: 0.8,
        delay: 0.3
      } 
    },
    hover: {
      scale: 1.05,
      boxShadow: "0px 0px 30px rgba(255, 202, 40, 0.6)",
      transition: { 
        type: "spring", 
        stiffness: 400, 
        damping: 10 
      }
    }
  };

  // Define the variants with proper typing
  const statsVariants = {
    hidden: { scale: 0.8, opacity: 0 },
    visible: (index: number) => ({
      scale: 1,
      opacity: 1,
      transition: {
        delay: 0.2 + (index * 0.1),
        duration: 0.4
      }
    })
  };

  const successStats = [
    { number: "4.5×", text: "Interview Rate Increase" },
    { number: "85%", text: "Success Within 3 Months" },
    { number: "93%", text: "ATS Pass Rate" }
  ];

  return (
    <section ref={sectionRef} className="py-12 md:py-16 lg:py-24 bg-gradient-to-r from-white to-amber-50">
      <div className="container mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate={isVisible ? "visible" : "hidden"}
          className="text-center mb-8 md:mb-12"
        >
          <motion.h2 variants={itemVariants} className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 text-secondary px-4">
            Success Stories That Inspire
          </motion.h2>
          <motion.p variants={itemVariants} className="text-base sm:text-lg text-gray-600 max-w-3xl mx-auto px-4">
            Real South Africans are landing their dream jobs with optimized CVs that stand out 
            from the competition and pass through ATS systems successfully.
          </motion.p>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
          <div className="flex flex-col space-y-6 order-2 lg:order-1">
            <motion.div 
              variants={itemVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              className="bg-white p-4 sm:p-6 rounded-xl shadow-lg border-l-4 border-primary mx-2 sm:mx-0"
            >
              <h3 className="font-bold text-lg sm:text-xl mb-2">From Frustration to Success</h3>
              <p className="text-gray-700 text-sm sm:text-base">
                "After months of sending applications with no responses, I was ready to give up. 
                Hire Mzansi helped me understand why my CV wasn't getting through. Within 2 weeks of 
                optimizing my CV, I landed three interviews and received my dream job offer!"
              </p>
              <p className="font-medium mt-3 text-secondary text-sm sm:text-base">— Thandi M., Cape Town</p>
            </motion.div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 sm:gap-4 px-2 sm:px-0">
              {successStats.map((stat, index) => (
                <motion.div
                  key={index}
                  custom={index}
                  variants={statsVariants}
                  initial="hidden"
                  animate={isVisible ? "visible" : "hidden"}
                  className="bg-white p-3 sm:p-4 rounded-lg shadow-md text-center border-t-2 border-amber-400"
                >
                  <div className="text-xl sm:text-2xl md:text-3xl font-bold text-primary">
                    {stat.number}
                  </div>
                  <div className="text-xs sm:text-sm text-gray-700 mt-1">
                    {stat.text}
                  </div>
                </motion.div>
              ))}
            </div>

            
          </div>

          <div className="flex justify-center order-1 lg:order-2 px-4 sm:px-0">
            <motion.div
              variants={imageVariants}
              initial="hidden"
              animate={isVisible ? "visible" : "hidden"}
              whileHover="hover"
              className="relative rounded-xl overflow-hidden shadow-2xl w-full max-w-sm sm:max-w-md lg:max-w-lg"
              style={{ 
                perspective: "1000px"
              }}
            >
              <img 
                src={successImagePath} 
                alt="Successful job seeker celebrating with CV" 
                className="w-full h-auto rounded-xl"
              />
              <motion.div
                initial={{ opacity: 0 }}
                animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
                transition={{ delay: 0.8, duration: 0.5 }}
                className="absolute inset-0 bg-gradient-to-t from-primary/20 to-transparent"
              />
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
                transition={{ delay: 1, duration: 0.5 }}
                className="absolute bottom-2 sm:bottom-4 right-2 sm:right-4 bg-primary/90 text-white px-2 sm:px-3 py-1 sm:py-2 rounded-full text-xs sm:text-sm font-bold"
              >
                Hire Mzansi Success
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}