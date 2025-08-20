const sideMenu = document.querySelector('#sideMenu');
const navBar = document.querySelector("nav");
const navLinks = document.querySelector("nav ul");

function openMenu() {
   sideMenu.style.transform = 'translateX(-16rem)';
}

function closeMenu() {
   sideMenu.style.transform = 'translateX(16rem)';
}

window.addEventListener('scroll', () => {
   if (scrollY > 50) {
      navBar.classList.add('bg-gray', 'bg-opacity-50', 'backdrop-blur-lg', 'shadow-sm', 'dark:shadow-white/20');
      navLinks.classList.remove('bg-gray', 'shadow-sm', 'bg-opacity-50');
   } else {
      navBar.classList.remove('bg-gray', 'bg-opacity-50', 'backdrop-blur-lg', 'shadow-sm');
      navLinks.classList.add('bg-gray', 'shadow-sm', 'bg-opacity-50');
   }
})

const backToTopButton = document.getElementById("backToTop");

window.addEventListener("scroll", () => {
   if (window.scrollY > 300) {
      backToTopButton.classList.remove("hidden");
      backToTopButton.classList.add("animate-bounce");
   } else {
      backToTopButton.classList.add("hidden");
      backToTopButton.classList.remove("animate-bounce");
   }
});

backToTopButton.addEventListener("click", () => {
   window.scrollTo({
      top: 0,
      behavior: 'smooth'
   });
});

// Function to update multiple icons based on dark/light mode
function updateAllIcons() {
  const icons = [
    {
      id: "codeIcon",
      light: "images/code-icon.png",       // light mode → dark icon
      dark: "images/code-icon-dark.png"    // dark mode → light icon
    },
    {
      id: "eduIcon",
      light: "images/edu-icon.png",
      dark: "images/edu-icon-dark.png"
    },
    {
      id: "projectIcon",
      light: "images/project-icon.png",
      dark: "images/project-icon-dark.png"
    }
  ];

  icons.forEach(({ id, light, dark }) => {
    const el = document.getElementById(id);
    if (!el) return;

    if (document.documentElement.classList.contains("dark")) {
      el.src = dark;
      el.alt = "Light Mode Icon";
    } else {
      el.src = light;
      el.alt = "Dark Mode Icon";
    }
  });
}

// Run once on page load
updateAllIcons();

// Observe <html> for class changes (dynamic dark mode toggle)
const observer = new MutationObserver(updateAllIcons);
observer.observe(document.documentElement, { attributes: true, attributeFilter: ["class"] });



// Typing Animation
document.addEventListener('DOMContentLoaded', function () {
   // Configuration options for the Typed.js library
   const options = {
      // An array of the strings to be typed
      strings: [
         'React.js Developer ⚛️',
         'Full Stack Developer 🚀',
         'MERN Stack Developer'
      ],
      typeSpeed: 60, // Speed of typing in milliseconds
      backSpeed: 40, // Speed of deleting in milliseconds
      backDelay: 2000, // Pause after typing before deleting
      startDelay: 500, // Pause before the animation begins
      loop: true, // Loop the animation indefinitely
      showCursor: true,
      cursorChar: '|', // Character for the cursor
      autoInsertCss: true // Let Typed.js handle the cursor CSS
   };

   // Initialize the Typed instance on the element with the ID 'typing-animation'
   const typed = new Typed('#typing-animation', options);
});

//Theme Toggle
const html = document.documentElement;
const toggleBtn = document.getElementById('themeToggle');
const toggleIcon = document.getElementById('themeIcon');
const menuBlackIcon = document.querySelector('img[src="images/menu-black.png"]');
const menuWhiteIcon = document.querySelector('img[src="images/menu-white.png"]');

// Function to update menu icons based on theme
function updateMenuIcons(isDark) {
   if (menuBlackIcon && menuWhiteIcon) {
      if (isDark) {
         menuBlackIcon.style.display = 'none';
         menuWhiteIcon.style.display = 'block';
      } else {
         menuBlackIcon.style.display = 'block';
         menuWhiteIcon.style.display = 'none';
      }
   }
}

// Set default theme to dark if no preference is saved
if (!localStorage.getItem('theme')) {
   localStorage.setItem('theme', 'dark');
}

// Apply saved theme and update icon before render
const savedTheme = localStorage.getItem('theme');
if (savedTheme === 'dark') {
   html.classList.add('dark');
   if (toggleIcon) toggleIcon.src = 'images/sun_icon.png';
   updateMenuIcons(true);
} else {
   html.classList.remove('dark');
   if (toggleIcon) toggleIcon.src = 'images/moon_icon.png';
   updateMenuIcons(false);
}

toggleBtn.addEventListener('click', () => {
   const isDark = html.classList.toggle('dark');
   localStorage.setItem('theme', isDark ? 'dark' : 'light');
   if (toggleIcon) toggleIcon.src = isDark ? 'images/sun_icon.png' : 'images/moon_icon.png';
   updateMenuIcons(isDark);
});