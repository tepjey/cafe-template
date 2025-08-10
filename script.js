// Testimonials
const testimonials = [
  {
    avatar: "https://randomuser.me/api/portraits/men/32.jpg",
    name: "Azlan Hakimi",
    position: "Pembangun Web",
    quote: "Makanan di RBSB Cafe memang sedap dan berpatutan. Saya selalu order waktu malam, dan penghantaran pun cepat. Website mereka pun mudah digunakan!"
  },
  {
    avatar: "https://randomuser.me/api/portraits/women/44.jpg",
    name: "Ain Nurul",
    position: "Pereka Antara Muka",
    quote: "Saya suka sangat dengan menu waffle mereka. Lembut dan rangup! Reka bentuk laman web mereka juga menarik dan senang untuk cari apa yang saya nak."
  },
  {
    avatar: "https://randomuser.me/api/portraits/men/75.jpg",
    name: "Syafiq Razman",
    position: "Ketua Pemasaran",
    quote: "Pengalaman saya dengan RBSB Cafe sangat memuaskan. Sesuai untuk pelajar universiti yang nak makanan sedap dengan harga bajet. Sangat disyorkan!"
  }
];


let current = 0; // Current testimonial index

// Elements
const avatar = document.getElementById("avatar");
const name = document.getElementById("name");
const position = document.getElementById("position");
const quote = document.getElementById("quote");
const dots = document.querySelectorAll(".dot");

// Loading message
function updateTestimonial(index) {
  const data = testimonials[index];
  avatar.src = data.avatar;
  name.textContent = data.name;
  position.textContent = data.position;
  quote.textContent = data.quote;

  dots.forEach(dot => dot.classList.remove("active"));
  dots[index].classList.add("active");
}

// Event listeners for next and previous buttons
document.querySelector(".next").addEventListener("click", () => {
  current = (current + 1) % testimonials.length;
  updateTestimonial(current);
});

document.querySelector(".prev").addEventListener("click", () => {
  current = (current - 1 + testimonials.length) % testimonials.length;
  updateTestimonial(current);
});

dots.forEach((dot, index) => {
  dot.addEventListener("click", () => {
    current = index;
    updateTestimonial(current);
  });
});

// Initial load
updateTestimonial(current);

// Dark Mode
const toggle = document.getElementById('darkModeToggle');
toggle.addEventListener('change', function() {
  document.body.classList.toggle('dark-mode', this.checked);
});
