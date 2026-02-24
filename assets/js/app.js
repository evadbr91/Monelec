window.addEventListener("DOMContentLoaded", () => {
  document.body.classList.add("loaded");

  const links = document.querySelectorAll("nav.menu a");
  const path = window.location.pathname.split("/").pop();

  links.forEach(link => {
    const href = link.getAttribute("href");
    if(href === path || (href === "index.html" && path === "")){
      link.classList.add("active");
    }
  });
});
