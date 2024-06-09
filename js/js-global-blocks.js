// JAVASCRIPT

// COPYRIGHT YEAR (AUTOMATIC)
let getyear = new Date().getFullYear();
let getyeardiv = document.getElementById("year");
getyeardiv.innerHTML = getyear;

// HEADER FIXED
function headerfixed() {
  let getheaderdiv = document.getElementsByTagName("header")[0].classList;
  if (document.documentElement.scrollTop > 20) {
    getheaderdiv.add("fixed");
  } 
  else {
    getheaderdiv.remove("fixed");
  }
}
window.onscroll = headerfixed;

// JQUERY
$(document).ready(function () {
  $('#contact-form').on('submit', (e) => {
    e.preventDefault();
    let name = $('[name="name"]').val();
    let message = $('[name="message"]').val();
    let finalMessage = `¡Hola! Soy ${name}. ${message}`;
    let url = `https://wa.me/5491126438752?text=${finalMessage}`;
    window.open(url, '_blank');
  });
});
