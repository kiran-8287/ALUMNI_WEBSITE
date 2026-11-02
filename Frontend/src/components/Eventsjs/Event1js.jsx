import { motion } from "framer-motion";
import "./css.css";
import AR1 from "../../assets/Alumni Reunion/AR 1C.webp";
import AR2 from "../../assets/Alumni Reunion/AR 2C.webp";
import AR3 from "../../assets/Alumni Reunion/AR 3C.webp";
import AR4 from "../../assets/Alumni Reunion/AR 4C.webp";
import AR5 from "../../assets/Alumni Reunion/AR 5C.webp";
import AR6 from "../../assets/Alumni Reunion/AR 6C.webp";

const Event1js = () => {
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
          First Alumni
          <span> Reunion</span>
        </h1>

        <div className="event-meta">
          <span className="calendar-icon">◷</span>
          <p>6th & 7th December 2025</p>
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
    The First Alumni Reunion marked an important milestone in
    strengthening the relationship between the institution and its
    alumni community. The event brought together alumni from different
    batches, providing an opportunity to reconnect with the institute,
    revisit cherished memories, and build new relationships.
  </p>

  <p>
    The Alumni Relations (AR) team began planning the reunion well in
    advance, working closely with alumni to coordinate participation,
    manage logistics, and ensure effective communication throughout
    the process.
  </p>

  <p>
    Through the collective efforts of the team, the reunion was
    successfully organized as a memorable occasion that celebrated the
    institute’s growing alumni network and fostered stronger
    connections between alumni, students, faculty, and the institution.
  </p>

  <div className="event-highlight">
    <p>
      Building lasting connections between our institution and its
      alumni community.
    </p>
  </div>
</motion.article>


        {/* Image */}
<motion.figure
  className="event-image w-full"
  variants={itemVariants}
  whileHover={{ y: -8 }}
  transition={{ duration: 0.3 }}
>
  <div className="space-y-4 flex-col">

    {/* Featured image */}
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-black/10 shadow-xl">
      <img
        src={AR1}
        alt="SAC Alumni Meet"
        className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02] "
      />
    </div>

    {/* 2 × 2 gallery */}
    <div className="grid grid-cols-2 gap-4">
      {[AR2, AR3, AR4, AR6].map((image, index) => (
        <div
          key={index}
          className="group overflow-hidden rounded-2xl border border-white/10 bg-black/10 shadow-lg"
        >
          <img
            src={image}
            alt={`SAC Alumni Meet - Photo ${index + 2}`}
            className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.03]"
          />
        </div>
      ))}
    </div>

    {/* Final wide image */}
    <div className="group overflow-hidden rounded-3xl border border-white/10 bg-black/10 shadow-xl">
      <img
        src={AR5}
        alt="SAC Alumni Meet"
        className="block h-auto w-full transition-transform duration-500 group-hover:scale-[1.02]"
      />
    </div>

  </div>

  <figcaption className="mt-6 text-center text-lg font-medium tracking-wide">
    First Alumni Reunion
  </figcaption>
</motion.figure>

      </motion.div>
    </motion.section>
  );
};

export default Event1js;
