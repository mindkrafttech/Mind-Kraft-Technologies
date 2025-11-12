// ====================== MOBILE SIDEBAR TOGGLE ====================== //
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeMenu = document.getElementById("closeMenu");

  if (menuToggle && mobileMenu && closeMenu) {
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.add("active");
      document.body.style.overflow = "hidden"; // prevent background scroll
    });

    closeMenu.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "auto";
    });

    // Close sidebar when clicking outside
    document.addEventListener("click", (e) => {
      if (!mobileMenu.contains(e.target) && !menuToggle.contains(e.target)) {
        mobileMenu.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    });
  }
});
