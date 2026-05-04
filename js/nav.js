document.addEventListener('DOMContentLoaded', function () {
  var hamburger = document.querySelector('.nav-hamburger');
  var navUl = document.querySelector('nav ul');

  if (!hamburger || !navUl) return;

  hamburger.addEventListener('click', function () {
    navUl.classList.toggle('open');
    hamburger.classList.toggle('active');
  });

  // Close menu when a nav link is tapped
  navUl.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      navUl.classList.remove('open');
      hamburger.classList.remove('active');
    });
  });

  // Close menu when clicking outside
  document.addEventListener('click', function (e) {
    if (!hamburger.contains(e.target) && !navUl.contains(e.target)) {
      navUl.classList.remove('open');
      hamburger.classList.remove('active');
    }
  });
});
