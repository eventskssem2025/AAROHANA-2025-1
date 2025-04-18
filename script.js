// Wait for the HTML document to be fully loaded before running any script
document.addEventListener('DOMContentLoaded', () => {
    console.log("DOM loaded. Initializing scripts..."); // Debug log

    // --- Mobile Menu Toggle Functionality ---
    const menuToggle = document.querySelector('.menu-toggle');
    const mainNav = document.querySelector('.main-navigation');
    if (menuToggle && mainNav) {
        menuToggle.addEventListener('click', () => {
            mainNav.classList.toggle('active');
            // Toggle body scroll based on menu state
             document.body.style.overflow = mainNav.classList.contains('active') ? 'hidden' : '';
        });
    } else {
        if (!menuToggle) console.error('Error: Menu toggle button (.menu-toggle) not found.');
        if (!mainNav) console.error('Error: Main navigation element (.main-navigation) not found.');
    }

    // --- Close mobile menu on link click ---
    const navLinks = document.querySelectorAll('.main-navigation a');
    if (navLinks && mainNav) {
        navLinks.forEach(link => {
            link.addEventListener('click', () => {
                // Only remove 'active' class if menu is currently active (avoids errors)
                 if (mainNav.classList.contains('active')) {
                    mainNav.classList.remove('active');
                    document.body.style.overflow = ''; // Restore scroll when closing menu
                }
                // Smooth scroll logic for hash links can be added here if needed,
                // but basic closing on click is implemented.
            });
        });
    }

    // --- Countdown Timer Functionality (If on index.html) ---
    const countdownElement = document.getElementById('countdown');
    if (countdownElement) {
         console.log("Countdown element found. Initializing timer.");
        // *** IMPORTANT: Set your actual Fest Start Date and Time ***
        const festStartDate = new Date("April 26, 2025 09:00:00").getTime(); // Example Date

        const countdownInterval = setInterval(() => {
            const now = new Date().getTime();
            const distance = festStartDate - now;
            const daysSpan = document.getElementById('days');
            const hoursSpan = document.getElementById('hours');
            const minutesSpan = document.getElementById('minutes');
            const secondsSpan = document.getElementById('seconds');
            const timerWrapper = countdownElement;
            const timerLaunchText = document.querySelector('.timer-launch-text');

            if (distance < 0) {
                clearInterval(countdownInterval);
                if(timerWrapper && timerWrapper.querySelector('#days')) {
                    timerWrapper.innerHTML = "<div style='font-size: 1.8rem; color: var(--primary-color); font-family: var(--font-heading);'>AAROHANA 2K25 IS LIVE!</div>";
                }
                if(timerLaunchText) timerLaunchText.style.display = 'none';
                return;
            }

            const days = Math.floor(distance / (1000 * 60 * 60 * 24));
            const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((distance % (1000 * 60)) / 1000);

            if(daysSpan) daysSpan.textContent = days < 10 ? '0' + days : days.toString();
            if(hoursSpan) hoursSpan.textContent = hours < 10 ? '0' + hours : hours.toString();
            if(minutesSpan) minutesSpan.textContent = minutes < 10 ? '0' + minutes : minutes.toString();
            if(secondsSpan) secondsSpan.textContent = seconds < 10 ? '0' + seconds : seconds.toString();
        }, 1000);
    } // End countdown check

    // --- Event Modal Functionality (If on events.html) ---
    const eventCards = document.querySelectorAll('.event-card');
    const eventModal = document.getElementById('eventModal'); // Renamed variable for clarity
    const eventModalCloseButton = eventModal ? eventModal.querySelector('.modal-close-button') : null;

    if (eventModal && eventModalCloseButton && eventCards.length > 0) {
        console.log("Event modal elements found. Initializing handlers.");
        const modalTitle = document.getElementById('modalEventTitle');
        const modalDate = document.getElementById('modalEventDate');
        const modalTime = document.getElementById('modalEventTime');
        const modalVenue = document.getElementById('modalEventVenue');
        const modalFee = document.getElementById('modalEventFee');
        const modalDescription = document.getElementById('modalEventDescription');
        const modalRulesLinkDiv = document.getElementById('modalEventRulesLink');
        const modalRegisterButton = document.getElementById('modalRegisterButton'); // Use the correct ID

        function openEventModal(card) {
            if (!card || !modalTitle || !modalDate || !modalTime || !modalVenue || !modalFee || !modalDescription || !modalRulesLinkDiv || !modalRegisterButton) {
                 console.error("Event modal elements missing, cannot open."); return;
             }
            modalTitle.textContent = card.dataset.title || 'Event Details';
            modalDate.textContent = card.dataset.date || 'TBA';
            modalTime.textContent = card.dataset.time || 'TBA';
            modalVenue.textContent = card.dataset.venue || 'TBA';
            modalFee.textContent = card.dataset.fee || 'N/A';
            modalDescription.textContent = card.dataset.description || 'More details coming soon.';

            const rulesPath = card.dataset.rules;
            modalRulesLinkDiv.innerHTML = '';
            if (rulesPath && rulesPath.trim() !== '') {
                 modalRulesLinkDiv.innerHTML = `<a href="${rulesPath}" class="button button-secondary" target="_blank"><i class="fas fa-book"></i> View Rulebook</a>`;
                 modalRulesLinkDiv.style.display = 'block';
            } else { modalRulesLinkDiv.style.display = 'none'; }

            // Handle Register button (link might be set in HTML or dynamically if needed)
             const registerLink = card.dataset.konfhubLink || 'register.html'; // Fallback to general registration if no specific link
             if (registerLink) {
                modalRegisterButton.href = registerLink;
                modalRegisterButton.style.display = 'block'; // Or 'inline-block' depending on CSS
                // Check if it's the fallback link to maybe change the text
                if (registerLink === 'register.html') {
                    modalRegisterButton.textContent = 'Go to Registration'; // More generic text
                } else {
                    modalRegisterButton.textContent = 'Register Now'; // Specific event link
                }
             } else {
                modalRegisterButton.style.display = 'none'; // Hide if no link at all
             }

            eventModal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }

        function closeEventModal() {
            eventModal.classList.remove('active');
            document.body.style.overflow = '';
        }

        eventCards.forEach(card => card.addEventListener('click', (e) => { if (e.target.tagName !== 'A') openEventModal(card); })); // Don't open modal if clicking link inside card
        eventModalCloseButton.addEventListener('click', closeEventModal);
        eventModal.addEventListener('click', (event) => { if (event.target === eventModal) closeEventModal(); }); // Close on overlay click
        document.addEventListener('keydown', (event) => { if (event.key === 'Escape' && eventModal.classList.contains('active')) closeEventModal(); });

    } // End event modal check


    // --- Announcement Modal Pop-up Logic (If on index.html or other specified pages) ---
    const announcementModal = document.getElementById('announcementModal');
    const announcementCloseButton = announcementModal ? announcementModal.querySelector('.announcement-modal-close') : null;
    const SESSION_STORAGE_KEY = 'aarohana2k25_announce_shown_v1'; // Changed key slightly to force redisplay if needed

    if (announcementModal && announcementCloseButton) {
         console.log("Announcement modal elements found. Setting up display logic.");

        function showAnnouncementModal() {
            if (!sessionStorage.getItem(SESSION_STORAGE_KEY)) {
                console.log("Showing announcement modal (first time this session).");
                announcementModal.classList.add('active');
                document.body.style.overflow = 'hidden';
                sessionStorage.setItem(SESSION_STORAGE_KEY, 'true');
            } else {
                 console.log("Announcement modal already shown this session.");
            }
        }

        function closeAnnouncementModal() {
            announcementModal.classList.remove('active');
             // Only restore body scroll if no *other* modal is active
             if (!document.querySelector('.modal.active')) {
                document.body.style.overflow = '';
             }
        }

        // Add listeners for announcement modal
        announcementCloseButton.addEventListener('click', closeAnnouncementModal);
        announcementModal.addEventListener('click', (event) => {
            if (event.target === announcementModal) closeAnnouncementModal();
        });
        // Use the same escape key listener - it will close whichever modal is active
        document.addEventListener('keydown', (event) => {
            if (event.key === 'Escape' && announcementModal.classList.contains('active')) {
                 closeAnnouncementModal();
            }
         });

        // --- Trigger the Announcement Modal ---
        // Show after a delay ONCE per session
        setTimeout(showAnnouncementModal, 2000); // Show after 2 seconds

    } // End announcement modal check


    // --- Scroll-Triggered Animation Functionality (Applies to all pages) ---
     const observerOptions = { root: null, rootMargin: '0px', threshold: 0.1 };
     const observerCallback = (entries, observer) => {
         entries.forEach(entry => {
             if (entry.isIntersecting) {
                 entry.target.classList.add('is-visible');
                 observer.unobserve(entry.target); // Animate only once
             }
         });
     };
     const observer = new IntersectionObserver(observerCallback, observerOptions);
     const targets = document.querySelectorAll('.animate-on-scroll');
     if (targets.length > 0) {
         targets.forEach(target => observer.observe(target));
          // console.log(`Observing ${targets.length} elements for scroll animation.`); // Less verbose
     }

     // --- Registration Form Handling (REMOVED if linking to Google Forms) ---
     // Make sure any previous form submission JS using fetch API is removed if you switched back to Google Forms link.


}); // End of DOMContentLoaded listener