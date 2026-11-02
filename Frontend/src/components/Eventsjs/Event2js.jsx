import { motion } from "framer-motion";
import "./css.css";
import Park1 from "../../assets/API 1C.webp";
import Park2 from "../../assets/API 2C.webp";
import Park3 from "../../assets/API 3C.webp";
import Park4 from "../../assets/API 4C.webp";


const Event2js = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.15,
        delayChildren: 0.1,
      },
    },
  };

  const itemVariants = {
    hidden: {
      opacity: 0,
      y: 35,
      filter: "blur(6px)",
    },
    visible: {
      opacity: 1,
      y: 0,
      filter: "blur(0px)",
      transition: {
        duration: 0.7,
        ease: [0.22, 1, 0.36, 1],
      },
    },
  };

  return (
    <motion.section
      className="subEvents"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      {/* Background decoration */}
      <div className="event-glow event-glow-1" />
      <div className="event-glow event-glow-2" />

      {/* Header */}
      <motion.div className="event-header" variants={itemVariants}>

        <h1>
          Alumni Park
          <span> Inauguration</span>
        </h1>

        <div className="event-meta">
          <span className="calendar-icon">◷</span>
          <p>18th June 2025</p>
        </div>
      </motion.div>

      {/* Main Content */}
      <motion.div
        className="event-content"
        variants={containerVariants}
      >
        {/* Description */}

        <motion.article
          className="event-description"
          variants={itemVariants}
        >
          <div className="section-number">01</div>

          <h2>About the Event</h2>

          <div className="heading-line" />

          <p>

              The Alumni Park was successfully inaugurated by our Director and distinguished
              Alumni on 18th June 2025. The inauguration marked a memorable milestone for the
              institute, celebrating the enduring bond between the institution and its
              alumni. The park was envisioned as a dedicated space to honour the contributions
              and achievements of our alumni while providing students and visitors with a 
              place to connect, reflect, and interact. The event brought together members 
              of the institute, alumni, faculty, and students, making it a meaningful
              occasion that celebrated the shared history and continuing legacy of the institution.

          </p>

        </motion.article>


        {/* Image */}
        <motion.figure
          className="event-image w-full"
          variants={itemVariants}
          whileHover={{ y: -8 }}
          transition={{ duration: 0.3 }}
        >
          <div className="grid grid-cols-2 gap-4">
            {/* Main image */}
            <div className="col-span-2 overflow-hidden rounded-2xl border border-white/10 bg-black/10 shadow-xl">
              <img
                src={Park1}
                alt="Alumni Park Inauguration"
                className="block h-auto w-full transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>

            {/* Secondary images */}
            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/10 shadow-lg">
              <img
                src={Park2}
                alt="Alumni Park Inauguration"
                className="block h-auto w-full transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>

            <div className="overflow-hidden rounded-2xl border border-white/10 bg-black/10 shadow-lg">
              <img
                src={Park3}
                alt="Alumni Park Inauguration"
                className="block h-auto w-full transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>

            <div className="col-span-2 overflow-hidden rounded-2xl border border-white/10 bg-black/10 shadow-lg">
              <img
                src={Park4}
                alt="Alumni Park Inauguration"
                className="block h-auto w-full transition-transform duration-500 hover:scale-[1.02]"
              />
            </div>
          </div>

          <figcaption className="mt-5 text-center text-lg font-medium tracking-wide">
            Alumni Park Inauguration
          </figcaption>
        </motion.figure>

      </motion.div>
    </motion.section>
  );
};

export default Event2js;
