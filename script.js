/* ===========================
   Core Elements
=========================== */
// Get the main input fields and sections from the DOM
const searchInput = document.getElementById("searchInput");
const categoryFilter = document.getElementById("categoryFilter");
const sections = document.querySelectorAll("main > section");
const header = document.querySelector("header");

/* ===========================
   Intro / Welcome Screen
=========================== */
// Create a full-screen overlay with a welcome message
const introOverlay = document.createElement("div");
introOverlay.id = "introOverlay";
introOverlay.innerHTML = `<h1 class="welcome">مرحبًا بكم في منصة المحاور</h1>`;
document.body.appendChild(introOverlay);

// Fade out and remove the welcome screen after 2 seconds
window.addEventListener("load", () => {
  setTimeout(() => {
    introOverlay.classList.add("fade-out"); // Add fade-out animation
    setTimeout(() => introOverlay.remove(), 1000); // Remove after animation ends
  }, 2000);
});

/* ===========================
   Special Buttons Creation
=========================== */
// Create "Back to Main" button
const backBtn = document.createElement("button");
backBtn.id = "backToMain";
backBtn.textContent = " الرجوع إلى الرئيسية";
document.body.appendChild(backBtn);

// Create "Scroll to Top" button
const scrollTopBtn = document.createElement("button");
scrollTopBtn.id = "scrollTopBtn";
scrollTopBtn.textContent = " الانتقال للأعلى";
document.body.appendChild(scrollTopBtn);

// Create a container for filtered view
const filteredView = document.createElement("div");
filteredView.id = "filteredView";
filteredView.innerHTML = `
  <h2 id="filteredTitle"></h2>
  <div class="filtered-cards"></div>
`;
document.body.appendChild(filteredView);

/* ===========================
   Scroll and Back Buttons Functionality
=========================== */
// Smooth scroll to top
scrollTopBtn.addEventListener("click", () => {
  window.scrollTo({ top: 0, behavior: "smooth" });
});

// Return from filtered view back to main
backBtn.addEventListener("click", () => {
  filteredView.classList.remove("fade-in");
  filteredView.classList.add("fade-out");

  setTimeout(() => {
    document.body.classList.remove("filtered-mode"); // Exit filtered mode
    backBtn.style.display = "none"; // Hide back button
    filteredView.style.display = "none"; // Hide filtered container
    document.querySelector("main").style.display = ""; // Show main sections
    document.querySelector(".intro").style.display = ""; // Show intro section
    header.querySelector("h1").style.display = ""; // Show main header
    categoryFilter.value = ""; // Reset category filter
    filteredView.classList.remove("fade-out"); // Reset animation class
  }, 400);
});

/* ===========================
   Click on Axis from Intro
=========================== */
// Helper function to normalize Arabic text for comparison
function normalizeText(t) {
  return t
    .replace(/[\u0622\u0623\u0625]/g, "ا") // unify Alef forms
    .replace(/\s+/g, "") // remove spaces
    .replace(/ى/g, "ي") // replace final Alef Maqsura
    .trim();
}

// Add click event to each axis in the intro list
document.querySelectorAll(".intro ul li").forEach((item) => {
  item.style.cursor = "pointer";
  item.addEventListener("click", () => {
    const axisName = normalizeText(item.textContent);

    // Find the matching section
    const section = Array.from(sections).find(
      (sec) =>
        normalizeText(sec.querySelector("h2")?.textContent || "") === axisName
    );

    if (section) {
      // Scroll section to center of the viewport
      const sectionY =
        section.getBoundingClientRect().top +
        window.scrollY -
        window.innerHeight / 2 +
        section.offsetHeight / 2;
      window.scrollTo({ top: sectionY, behavior: "smooth" });

      // Add temporary highlight and zoom effect
      sections.forEach((s) => s.classList.remove("highlight"));
      section.classList.add("highlight", "zoomed");
      setTimeout(() => section.classList.remove("zoomed"), 1000);
    }
  });
});

/* ===========================
   Category Filter Functionality
=========================== */
categoryFilter?.addEventListener("change", () => {
  const selected = categoryFilter.value.trim();

  if (!selected) {
    // Reset to normal view if no category is selected
    document.body.classList.remove("filtered-mode");
    backBtn.style.display = "none";
    filteredView.style.display = "none";
    document.querySelector("main").style.display = "";
    document.querySelector(".intro").style.display = "";
    header.querySelector("h1").style.display = "";
    return;
  }

  // Enter filtered mode
  document.body.classList.add("filtered-mode");
  backBtn.style.display = "block";
  filteredView.style.display = "block";
  filteredView.classList.add("fade-in");

  document.querySelector("main").style.display = "none";
  document.querySelector(".intro").style.display = "none";
  header.querySelector("h1").style.display = "none";

  // Show only the selected section
  const section = Array.from(sections).find(
    (sec) => sec.getAttribute("data-category") === selected
  );

  if (section) {
    const title = section.querySelector("h2").textContent;
    document.getElementById("filteredTitle").textContent = "عرض محور: " + title;

    const cardsContainer = filteredView.querySelector(".filtered-cards");
    cardsContainer.innerHTML = "";

    const cards = section.querySelectorAll(".card");
    cards.forEach((card, i) => {
      const clone = card.cloneNode(true); // Duplicate card
      clone.style.opacity = "0";
      clone.style.transform = "translateY(40px)";
      cardsContainer.appendChild(clone);

      // Animate cards appearance with delay
      setTimeout(() => {
        clone.classList.add("show");
        clone.style.opacity = "1";
        clone.style.transform = "translateY(0)";
      }, 300 + i * 250);
    });
  }
});

/* ===========================
   Show Scroll-to-Top Button on Scroll
=========================== */
window.addEventListener("scroll", () => {
  if (window.scrollY > 300) scrollTopBtn.style.display = "block";
  else scrollTopBtn.style.display = "none";
});

/* ===========================
   Sticky Navbar on Scroll
=========================== */
window.addEventListener("scroll", () => {
  if (window.scrollY > 80) header.classList.add("sticky");
  else header.classList.remove("sticky");
});

/* ===========================
   Starry Background Decoration
=========================== */
const bgAnim = document.createElement("div");
bgAnim.className = "bg-anim-extra";
document.body.appendChild(bgAnim);

// Create 50 animated stars with random position and opacity
for (let i = 0; i < 50; i++) {
  const s = document.createElement("span");
  s.className = "star";
  s.style.left = Math.random() * 100 + "%";
  s.style.top = Math.random() * 100 + "%";
  s.style.animationDelay = Math.random() * 6 + "s"; // Random animation delay
  s.style.opacity = Math.random() * 0.6; // Random opacity
  bgAnim.appendChild(s);
}
