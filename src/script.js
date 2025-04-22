// Smooth scrolling for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

// Project Modal Logic
document.querySelectorAll('.project-card').forEach(card => {
    const imageWrapper = card.querySelector('.project-image-wrapper'); // Target wrapper
    const modal = card.querySelector('.project-modal');
    const closeBtn = modal.querySelector('.close-modal');

    // Check if elements exist before adding listeners
    if (imageWrapper && modal && closeBtn) {
        // Open modal on image click
        imageWrapper.addEventListener('click', () => {
            modal.style.display = 'block';
            document.body.style.overflow = 'hidden'; // Prevent background scroll
        });

        // Close modal with button
        closeBtn.addEventListener('click', () => {
            modal.style.display = 'none';
            document.body.style.overflow = 'auto'; // Restore scroll
        });

        // Close modal when clicking outside the modal content
        modal.addEventListener('click', (e) => { // Listen on the modal background itself
            if (e.target === modal) {
                modal.style.display = 'none';
                document.body.style.overflow = 'auto';
            }
        });
    } else {
        // Log an error if elements are missing for a card
        console.error("Modal elements missing for a project card:", card);
    }
});


// Navbar scroll effect
window.addEventListener('scroll', function() {
    const navbar = document.querySelector('.navbar');
    if (navbar) { // Check if navbar exists
        if (window.scrollY > 50) {
            // Apply a more subtle background on scroll, keeping some opacity
            navbar.style.backgroundColor = 'rgba(26, 26, 26, 0.85)';
            navbar.style.backdropFilter = 'blur(5px)'; // Add blur on scroll
             navbar.style.webkitBackdropFilter = 'blur(5px)'; // Safari
        } else {
             // Reset to initial style (make sure this matches the CSS)
            navbar.style.backgroundColor = 'rgba(26, 26, 26, 0.9)';
            navbar.style.backdropFilter = 'none'; // Remove blur
             navbar.style.webkitBackdropFilter = 'none';
        }
    }
});

// --- Typing Animation ---
function typeEffect(element, text, speed, callback) {
    let i = 0;
    element.innerHTML = ""; // Clear element before typing
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        } else if (callback) {
            // Add a slight delay before calling the callback
            setTimeout(callback, 300);
        }
    }
    type();
}

function backspaceEffect(element, speed, callback) {
    const text = element.innerHTML;
    let i = text.length;
    function backspace() {
        if (i > 0) {
            element.innerHTML = text.substring(0, i - 1);
            i--;
            setTimeout(backspace, speed);
        } else if (callback) {
             // Add a slight delay before calling the callback
            setTimeout(callback, 500);
        }
    }
    backspace();
}

document.addEventListener("DOMContentLoaded", () => {
    const nameElement = document.getElementById("safal");
    const titleElement = document.getElementById("softeng");

    if (nameElement && titleElement) {
        // Initial state before animation
        nameElement.innerHTML = "";
        titleElement.innerHTML = "&nbsp;"; // Use &nbsp; to reserve space initially

        typeEffect(nameElement, "Safal Karki", 100, () => {
            let titles = ["Software Engineer", "Web Developer", "AI/ML Enthusiast", "QA Engineer"]; // Updated title
            let index = 0;

            function loopTyping() {
                 // Ensure title element is cleared before typing next title
                 titleElement.innerHTML = "&nbsp;";
                typeEffect(titleElement, titles[index], 100, () => {
                    // Wait longer before backspacing
                    setTimeout(() => {
                        backspaceEffect(titleElement, 50, () => {
                            index = (index + 1) % titles.length;
                            loopTyping();
                        });
                    }, 2000); // Increased delay to 2 seconds
                });
            }
            loopTyping(); // Start the title loop
        });
    } else {
        console.error("Could not find elements for typing animation (#safal or #softeng).");
    }

    // --- Shooting Stars ---
    const starsContainer = document.querySelector('.stars-container');
    if (starsContainer) {
        const numberOfStars = 50; // Adjust density

        for (let i = 0; i < numberOfStars; i++) {
            createStar(starsContainer);
        }
    } else {
         console.error("Could not find .stars-container element.");
    }
    // --- End Shooting Stars ---
});

// --- Shooting Star Creation Function ---
function createStar(container) {
    const star = document.createElement('div');
    star.classList.add('star');

    // Random properties
    const size = Math.random() * 5 + 1; // Star size between 1px and 3px
    const startX = Math.random() * 100; // Start X position (percentage)
    const startY = Math.random() * 100; // Start Y position (percentage)
    const duration = Math.random() * 5 + 3; // Animation duration between 3s and 8s
    const delay = Math.random() * 5; // Animation delay up to 5s

    star.style.width = `${size}px`;
    star.style.height = `${size}px`;
    star.style.left = `${startX}%`;
    star.style.top = `${startY}%`;
    star.style.animationDuration = `${duration}s`;
    star.style.animationDelay = `${delay}s`;

    container.appendChild(star);

    // Remove star after animation finishes to prevent buildup (optional but good practice)
    star.addEventListener('animationend', () => {
        star.remove();
        // Create a new star to replace the one that finished
        createStar(container);
    });
}
// --- End Shooting Star Creation ---