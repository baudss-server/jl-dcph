document.addEventListener('DOMContentLoaded', () => {
  // IMPORTANT: Walang hamburger/menu code dito. Nasa testimonial.js lahat.
  if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
    gsap.registerPlugin(ScrollTrigger);

    gsap.from(".dcp-hero-section .dcp-card", {
      opacity:0, y:16, duration:0.8, stagger:0.2,
      scrollTrigger:{ trigger:".dcp-hero-section", start:"top center+=20%", toggleActions:"play none play reverse" }
    });

    gsap.from(".dcp-how-it-works-section .dcp-step-card", {
      opacity:0, y:16, duration:0.8, stagger:0.2,
      scrollTrigger:{ trigger:".dcp-how-it-works-section", start:"top center+=20%", toggleActions:"play none play reverse" }
    });

    gsap.from(".dcp-about-us-section .about-big-card", {
      opacity:0, y:16, duration:0.8,
      scrollTrigger:{ trigger:".dcp-about-us-section", start:"top center+=20%", toggleActions:"play none play reverse" }
    });

    gsap.from(".dcp-contacts-section .dcp-contact-card, .dcp-contacts-section .dcp-map-card", {
      opacity:0, y:16, duration:0.8, stagger:0.2,
      scrollTrigger:{ trigger:".dcp-contacts-section", start:"top center+=20%", toggleActions:"play none play reverse" }
    });

    gsap.from(".dcp-faq-section .dcp-faq-item", {
      opacity:0, y:16, duration:0.8, stagger:0.2,
      scrollTrigger:{ trigger:".dcp-faq-section", start:"top center+=20%", toggleActions:"play none play reverse" }
    });
  }
});
/* ===== Your existing main.js logic can stay above this line ===== */

/* viewport-vars (stabilize --svw/--svh to visible viewport, esp. mobile) */
(function(){
  const docEl = document.documentElement;

  function applyViewportVars(){
    const vw = (window.visualViewport?.width  ?? window.innerWidth);
    const vh = (window.visualViewport?.height ?? window.innerHeight);
    docEl.style.setProperty('--svw', `${vw}px`);
    docEl.style.setProperty('--svh', `${vh}px`);
  }

  applyViewportVars();

  // Listen to events that change the visible viewport
  window.addEventListener('resize', applyViewportVars, { passive: true });
  window.visualViewport && window.visualViewport.addEventListener('resize', applyViewportVars, { passive: true });
  window.addEventListener('orientationchange', applyViewportVars, { passive: true });
})();
