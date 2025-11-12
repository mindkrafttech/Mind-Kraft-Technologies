// ====================== MOBILE SIDEBAR TOGGLE ====================== //
document.addEventListener("DOMContentLoaded", () => {
  const menuToggle = document.getElementById("menuToggle");
  const mobileMenu = document.getElementById("mobileMenu");
  const closeMenu = document.getElementById("closeMenu");

  if (menuToggle && mobileMenu && closeMenu) {

    // Toggle sidebar on hamburger click (open/close)
    menuToggle.addEventListener("click", () => {
      mobileMenu.classList.toggle("active");
      document.body.style.overflow = mobileMenu.classList.contains("active") ? "hidden" : "auto";
    });

    // Close sidebar when clicking the × button
    closeMenu.addEventListener("click", () => {
      mobileMenu.classList.remove("active");
      document.body.style.overflow = "auto";
    });

    // Close sidebar when clicking outside of it
    document.addEventListener("click", (e) => {
      if (
        mobileMenu.classList.contains("active") &&
        !mobileMenu.contains(e.target) &&
        !menuToggle.contains(e.target)
      ) {
        mobileMenu.classList.remove("active");
        document.body.style.overflow = "auto";
      }
    });
  }
});
