// home.js - MIND KRAFT TECHNOLOGIES
// All interactivity: Mobile menu + Day-Night Scroll Animation

document.addEventListener('DOMContentLoaded', () => {

  // ====================== DAY-NIGHT SCROLL ANIMATION ======================
  const sun = document.getElementById('sun');
  const cloud = document.getElementById('cloud');
  const stars = document.getElementById('stars');
  const bg = document.getElementById('bg-animation');

  if (sun && bg) {
    const phases = [
      { pct: 0, sky: '#aee7fa', sunY: '15vh', sunX: '20vw', sunGlow: '#ffe053e7', stars: 0 },
      { pct: 25, sky: '#87CEEB', sunY: '10vh', sunX: '50vw', sunGlow: '#ffec70', stars: 0 },
      { pct: 50, sky: '#fdb44f', sunY: '25vh', sunX: '80vw', sunGlow: '#ffc700', stars: 0 },
      { pct: 75, sky: '#ff7e5f', sunY: '45vh', sunX: '90vw', sunGlow: '#ff6b6b', stars: 0.3 },
      { pct: 100, sky: '#1a2a44', sunY: '80vh', sunX: '95vw', sunGlow: '#2c3e50', stars: 1 }
    ];

    function updateDayCycle() {
      const scroll = window.scrollY;
      const height = document.body.scrollHeight - window.innerHeight;
      const progress = Math.min(scroll / height, 1) * 100;

      let current = phases[0], next = phases[1];
      for (let i = 0; i < phases.length - 1; i++) {
        if (progress >= phases[i].pct && progress <= phases[i + 1].pct) {
          current = phases[i];
          next = phases[i + 1];
          break;
        }
      }
      const t = (progress - current.pct) / (next.pct - current.pct);

      const lerp = (a, b, t) => a + (b - a) * t;
      const lerpColor = (c1, c2, t) => {
        const h1 = c1.slice(1), h2 = c2.slice(1);
        const r = Math.round(parseInt(h1.substr(0, 2), 16) * (1 - t) + parseInt(h2.substr(0, 2), 16) * t);
        const g = Math.round(parseInt(h1.substr(2, 2), 16) * (1 - t) + parseInt(h2.substr(2, 2), 16) * t);
        const b = Math.round(parseInt(h1.substr(4, 2), 16) * (1 - t) + parseInt(h2.substr(4, 2), 16) * t);
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      };

      const sky = lerpColor(current.sky, next.sky, t);
      bg.style.background = `linear-gradient(to bottom, ${sky} 0%, #fdf7a4 100%)`;
      sun.style.top = lerp(parseFloat(current.sunY), parseFloat(next.sunY), t) + 'vh';
      sun.style.left = lerp(parseFloat(current.sunX), parseFloat(next.sunX), t) + 'vw';
      sun.style.boxShadow = `0 0 90px 24px ${lerpColor(current.sunGlow, next.sunGlow, t)}`;
      stars.style.opacity = lerp(current.stars, next.stars, t);

      if (cloud) {
        cloud.style.left = `calc(${sun.style.left} + 20vw)`;
        cloud.style.top = `calc(${sun.style.top} - 10vh)`;
      }
    }

    window.addEventListener('scroll', updateDayCycle);
    window.addEventListener('resize', updateDayCycle);
    updateDayCycle();
  }
  // ====================== SCROLL-TO-TOP BUTTON ======================
  const scrollBtn = document.querySelector('.scroll-to-top');

  if (scrollBtn) {
    // Show/hide on scroll
    window.addEventListener('scroll', () => {
      if (window.scrollY > 300) {
        scrollBtn.classList.add('visible');
      } else {
        scrollBtn.classList.remove('visible');
      }
    });

    // Smooth scroll to top
    scrollBtn.addEventListener('click', () => {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      });
    });
  }
});

// ====================== TECHY SEARCH MODAL – SITE-WIDE SEARCH ======================
document.addEventListener("DOMContentLoaded", () => {
  const searchTrigger = document.getElementById('searchTrigger');
  const searchModal = document.getElementById('searchModal');
  const searchInput = document.getElementById('searchInput');
  const searchResults = document.getElementById('searchResults');
  const closeSearch = document.querySelector('.close-search');

  // Open modal
  searchTrigger?.addEventListener('click', () => {
    searchModal.classList.add('active');
    searchInput.focus();
    document.body.style.overflow = 'hidden';
  });

  // Close modal
  const closeModal = () => {
    searchModal.classList.remove('active');
    searchInput.value = '';
    searchResults.innerHTML = '';
    document.body.style.overflow = '';
  };
  closeSearch?.addEventListener('click', closeModal);
  searchModal?.addEventListener('click', (e) => {
    if (e.target === searchModal) closeModal();
  });

  // ====================== WEBSITE SEARCH ======================
  // List of your website pages to search
  const pages = [
    "index.html",
    "about.html",
    "contact.html",
    "courses.html",
    "blog.html"
  ];

  // Fetch and cache page content
  const siteContent = {};
  const isBlog = window.location.pathname.includes('/blog/');

  pages.forEach(page => {
    const fetchPath = isBlog ? `../${page}` : page;
    fetch(fetchPath)
      .then(res => res.text())
      .then(html => {
        const parser = new DOMParser();
        const doc = parser.parseFromString(html, 'text/html');
        siteContent[page] = doc.body.innerText.toLowerCase();
      })
      .catch(err => console.warn(`Failed to load ${page}`, err));
  });

  // Search through all pages
  searchInput?.addEventListener('input', () => {
    const query = searchInput.value.toLowerCase().trim();
    searchResults.innerHTML = '';

    if (query.length < 2) return;

    let matches = [];

    for (const [page, text] of Object.entries(siteContent)) {
      if (text.includes(query)) {
        const snippetIndex = text.indexOf(query);
        const snippet = text.substring(snippetIndex - 50, snippetIndex + 100)
          .replace(/\s+/g, ' ')
          .trim();

        matches.push({
          title: page.replace('.html', '').toUpperCase(),
          desc: snippet,
          url: page
        });
      }
    }

    if (matches.length === 0) {
      searchResults.innerHTML = `<p style="color:#ffd14a; text-align:center; padding:2rem;">No results found</p>`;
      return;
    }

    matches.forEach(item => {
      const div = document.createElement('div');
      div.className = 'search-result-item';
      div.innerHTML = `
        <h4>${item.title}</h4>
        <p>${item.desc}...</p>
      `;
      div.onclick = () => window.location.href = item.url;
      searchResults.appendChild(div);
    });
  });
});

// ====================== ENROLLMENT + RAZORPAY + GOOGLE SHEETS + EMAILJS ======================
const enrollBtns = document.querySelectorAll('.enroll-btn');
const enrollModal = document.getElementById('enrollModal');
const closeEnroll = document.querySelector('.close-enroll');
const enrollForm = document.getElementById('enrollForm');
const selectedCourseEl = document.getElementById('selectedCourse');
const displayPriceEl = document.getElementById('displayPrice');
const successMessage = document.getElementById('successMessage');

let currentCourse = '';
let currentPrice = 0;

// Open modal
if (enrollBtns) {
  enrollBtns.forEach(btn => {
    btn.addEventListener('click', e => {
      e.preventDefault();
      currentCourse = btn.getAttribute('data-course');
      currentPrice = parseInt(btn.getAttribute('data-price'));

      if (selectedCourseEl) selectedCourseEl.textContent = `Course: ${currentCourse}`;
      if (displayPriceEl) displayPriceEl.textContent = `₹${currentPrice.toLocaleString()}`;

      if (enrollModal) {
        enrollModal.classList.add('active');
        document.body.style.overflow = 'hidden';
      }
    });
  });
}

// Close modal
if (closeEnroll) {
  closeEnroll.onclick = () => {
    if (enrollModal) enrollModal.classList.remove('active');
    document.body.style.overflow = '';
    if (enrollForm) {
      enrollForm.reset();
      enrollForm.style.display = 'block';
    }
    if (successMessage) successMessage.style.display = 'none';
  };
}

// Submit form
if (enrollForm) {
  enrollForm.onsubmit = async e => {
    e.preventDefault();

    const formData = new FormData(enrollForm);
    const data = {
      name: formData.get('name'),
      email: formData.get('email'),
      mobile: formData.get('mobile'),
      profession: formData.get('profession'),
      course: currentCourse,
      price: currentPrice,
      timestamp: new Date().toISOString()
    };

    const options = {
      key: "rzp_live_RdB5ubw9QiTwIb",
      amount: currentPrice * 100,
      currency: "INR",
      name: "MIND KRAFT TECHNOLOGIES",
      description: currentCourse,
      handler: async function (response) {
        data.payment_id = response.razorpay_payment_id;

        // ✅ 1. SEND TO GOOGLE SHEETS (FORM-DATA)
        try {
          const sheetsData = new URLSearchParams();
          for (const key in data) {
            sheetsData.append(key, data[key]);
          }
          sheetsData.append('payment_id', data.payment_id); // Ensure payment_id is added

          const sheetsRes = await fetch("https://script.google.com/macros/s/AKfycbzHkY83n6-7Zl9-OXX1hVKofT-eLSQDGRptk2hq9zZNwIUURXIyH_fFHUEVoAf8PgdSwg/exec", {
            method: "POST",
            body: sheetsData,  // ← FORM-DATA
            headers: {
              "Content-Type": "application/x-www-form-urlencoded"
            }
          });
          const sheetsText = await sheetsRes.text();
          console.log("Google Sheets Response:", sheetsText);
        } catch (err) {
          console.error("Google Sheets webhook failed:", err);
        }

        // ✅ 3. SUCCESS MESSAGE
        if (enrollForm) enrollForm.style.display = 'none';
        if (successMessage) {
          successMessage.style.display = 'block';
          successMessage.innerHTML = `
            <i class="fas fa-check-circle"></i>
            <h3>Enrollment Confirmed!</h3>
            <p>Payment ID: <strong>${data.payment_id}</strong></p>
            <p>Data saved & email sent!</p>
          `;
        }

        // Auto-close
        setTimeout(() => {
          if (enrollModal) enrollModal.classList.remove('active');
          document.body.style.overflow = '';
          if (enrollForm) {
            enrollForm.reset();
            enrollForm.style.display = 'block';
          }
          if (successMessage) successMessage.style.display = 'none';
        }, 6000);
      },
      prefill: {
        name: data.name,
        email: data.email,
        contact: data.mobile
      },
      theme: { color: "#216892" }
    };

    const rzp = new Razorpay(options);
    rzp.open();
  };
}