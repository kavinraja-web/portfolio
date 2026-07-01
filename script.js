// Initialize AOS (Animate on Scroll)
document.addEventListener('DOMContentLoaded', () => {
    AOS.init({
        once: true,
        offset: 100,
        duration: 800,
        easing: 'ease-out-cubic',
    });

    // Prevent scrolling during intro
    document.body.style.overflow = 'hidden';

    const splineViewer = document.getElementById('my-spline-viewer');
    const splineLoading = document.getElementById('spline-loading');
    const enterBtn = document.getElementById('enter-portfolio-btn');
    const splineIntro = document.getElementById('spline-intro');
    const loader = document.getElementById('loader');

    // Hide old basic loader since we have the Spline intro now
    if(loader) {
        loader.style.display = 'none';
    }

    if (splineViewer && splineIntro) {
        // Robust loading logic with fallback
        let isSplineLoaded = false;
        function showEnterButton() {
            if (isSplineLoaded) return;
            isSplineLoaded = true;
            if(splineLoading) splineLoading.style.opacity = '0';
            
            setTimeout(() => {
                if(splineLoading) splineLoading.style.display = 'none';
                if(enterBtn) {
                    enterBtn.classList.remove('opacity-0', 'pointer-events-none');
                    enterBtn.classList.add('opacity-100', 'pointer-events-auto');
                }
            }, 500);
        }

        // Listen for the Spline scene to finish loading
        splineViewer.addEventListener('load', showEnterButton);
        splineViewer.addEventListener('load-complete', showEnterButton);
        
        // Failsafe: If spline takes too long or fails, show button anyway
        setTimeout(showEnterButton, 3500);
        if(enterBtn) {
            enterBtn.addEventListener('click', () => {
                // Hide button immediately
                enterBtn.style.opacity = '0';
                
                // Zoom through the laptop screen effect using GSAP
                gsap.to(splineViewer, {
                    scale: 30, // Scale up to go "through" the screen
                    duration: 1.5,
                    ease: "power2.in"
                });

                gsap.to(splineIntro, {
                    opacity: 0,
                    duration: 1.0,
                    delay: 0.5, // Start fading out as we get closer to the screen
                    ease: "power2.in",
                    onComplete: () => {
                        splineIntro.style.display = 'none';
                        document.body.style.overflow = 'auto'; // Restore scrolling
                    }
                });
            });
        }
    } else {
        // Fallback if spline intro isn't present
        document.body.style.overflow = 'auto';
    }

    // Navbar Scroll Effect
    const navbar = document.getElementById('navbar');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            navbar.classList.add('shadow-lg', 'bg-primary-dark/95');
            navbar.classList.remove('bg-transparent');
        } else {
            navbar.classList.remove('shadow-lg', 'bg-primary-dark/95');
        }
    });

    // Mobile Menu Toggle
    const mobileMenuBtn = document.getElementById('mobile-menu-btn');
    const closeMenuBtn = document.getElementById('close-menu-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    const mobileNavLinks = document.querySelectorAll('.mobile-nav-link');

    const toggleMenu = () => {
        if (mobileMenu.classList.contains('translate-x-full')) {
            mobileMenu.classList.remove('translate-x-full');
            document.body.style.overflow = 'hidden'; // Prevent scrolling
        } else {
            mobileMenu.classList.add('translate-x-full');
            document.body.style.overflow = 'auto';
        }
    };

    if (mobileMenuBtn && closeMenuBtn && mobileMenu) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
        closeMenuBtn.addEventListener('click', toggleMenu);
        
        // Close menu when clicking a link
        mobileNavLinks.forEach(link => {
            link.addEventListener('click', toggleMenu);
        });
    }

    // Typewriter Effect
    const words = ["Web Solutions.", "Digital Experiences.", "Scalable Platforms."];
    let wordIndex = 0;
    let charIndex = 0;
    let isDeleting = false;
    const typeSpeed = 100;
    const deleteSpeed = 50;
    const waitTime = 2000;
    
    const typewriterElement = document.getElementById('typewriter');
    
    // Add cursor span inside the typewriter container or next to it
    if(typewriterElement) {
        typewriterElement.innerHTML = `<span id="type-text"></span><span class="typewriter-cursor">&nbsp;</span>`;
        const typeText = document.getElementById('type-text');
        
        function type() {
            const currentWord = words[wordIndex];
            
            if (isDeleting) {
                typeText.textContent = currentWord.substring(0, charIndex - 1);
                charIndex--;
            } else {
                typeText.textContent = currentWord.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let timing = isDeleting ? deleteSpeed : typeSpeed;
            
            if (!isDeleting && charIndex === currentWord.length) {
                timing = waitTime;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                wordIndex = (wordIndex + 1) % words.length;
                timing = 500;
            }
            
            setTimeout(type, timing);
        }
        
        // Start typing effect
        setTimeout(type, 1000);
    }

    // Contact Form Submission (Real via FormSubmit)
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const btn = contactForm.querySelector('button[type="submit"]');
            const originalText = btn.innerHTML;
            
            const name = document.getElementById('name').value;
            const email = document.getElementById('email').value;
            const message = document.getElementById('message').value;
            
            // Loading state
            btn.innerHTML = '<i class="ri-loader-4-line animate-spin"></i> Sending...';
            btn.classList.add('opacity-80', 'cursor-not-allowed');
            
            // Send Real Email via Formsubmit.co
            fetch("https://formsubmit.co/ajax/kavinraja471@gmail.com", {
                method: "POST",
                headers: { 
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({
                    name: name,
                    email: email,
                    message: message
                })
            })
            .then(response => response.json())
            .then(data => {
                btn.innerHTML = '<i class="ri-check-line text-xl"></i> Message Sent!';
                btn.classList.replace('btn-primary', 'bg-green-500');
                btn.classList.replace('border-accent', 'border-green-500');
                btn.style.boxShadow = '0 4px 15px rgba(34, 197, 94, 0.4)';
                
                contactForm.reset();
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.replace('bg-green-500', 'btn-primary');
                    btn.classList.replace('border-green-500', 'border-accent');
                    btn.style.boxShadow = '';
                    btn.classList.remove('opacity-80', 'cursor-not-allowed');
                }, 4000);
            })
            .catch(error => {
                console.error(error);
                btn.innerHTML = '<i class="ri-error-warning-line text-xl"></i> Error!';
                btn.classList.replace('btn-primary', 'bg-red-500');
                btn.classList.replace('border-accent', 'border-red-500');
                
                setTimeout(() => {
                    btn.innerHTML = originalText;
                    btn.classList.replace('bg-red-500', 'btn-primary');
                    btn.classList.replace('border-red-500', 'border-accent');
                    btn.classList.remove('opacity-80', 'cursor-not-allowed');
                }, 3000);
            });
        });
    }

    // Featured Flip Card Toggle (Mobile & Click Support)
    const flipCard = document.getElementById('featured-flip-card');
    if (flipCard) {
        flipCard.addEventListener('click', (e) => {
            // Ignore if clicked on an anchor link
            if (e.target.closest('a')) return;
            flipCard.classList.toggle('flipped');
        });
    }

    // Smooth Scroll for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if(targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if(targetElement) {
                const navHeight = document.getElementById('navbar').offsetHeight;
                const targetPosition = targetElement.getBoundingClientRect().top + window.scrollY - navHeight;
                
                window.scrollTo({
                    top: targetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
});
