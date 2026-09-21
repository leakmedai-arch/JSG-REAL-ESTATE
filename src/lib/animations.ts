export const wpEase = [0.25, 0.1, 0.25, 1];

export const fadeDown = {
  hidden: { y: -80, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.8, ease: wpEase } 
  }
};

export const fadeUp = {
  hidden: { y: 80, opacity: 0 },
  visible: { 
    y: 0, 
    opacity: 1, 
    transition: { duration: 0.8, ease: wpEase } 
  }
};

export const fadeLeft = {
  hidden: { x: -80, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { duration: 0.8, ease: wpEase } 
  }
};

export const fadeRight = {
  hidden: { x: 80, opacity: 0 },
  visible: { 
    x: 0, 
    opacity: 1, 
    transition: { duration: 0.8, ease: wpEase } 
  }
};

export const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.1,
    }
  }
};

export const cardOneByOne = {
  hidden: { y: 50, opacity: 0, scale: 0.95 },
  visible: { 
    y: 0, 
    opacity: 1, 
    scale: 1, 
    transition: { duration: 0.6, ease: wpEase } 
  }
};

export const defaultViewport = { once: true, amount: 0.2 };
