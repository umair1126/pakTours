import "@babel/polyfill";
import { login, logout } from "./login";
import { displayMap } from "./mapbox";
import { updateData } from "./updateSetting";
import { signUp } from "./signup";
//import { bookTour } from "./stripe";

// Dom elements
const mapbox = document.getElementById("map");
const loginForm = document.querySelector(".form--login");
const logoutBtn = document.querySelector(".nav__el--logout");
const updateUser = document.querySelector(".form-user-data");
const updatePassword = document.querySelector(".form-user-password");
const signUpForm = document.querySelector(".form--signup");
//const bookBtn = document.querySelector("#book-tour");

// Delegation
if (mapbox) {
  const locations = JSON.parse(mapbox.dataset.locations);
  //console.log(locations);

  displayMap(locations);
}

if (signUpForm) {
  signUpForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--signup").textContent = "Processing...";
    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    const confirmPassword = document.getElementById("confirmPassword").value;
    await signUp(name, email, password, confirmPassword);
    document.querySelector(".btn--signup").textContent = "SIGNUP";
  });
}

if (loginForm) {
  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--login").textContent = "Processing...";
    const email = document.getElementById("email").value;
    const password = document.getElementById("password").value;
    await login(email, password);
    document.querySelector(".btn--login").textContent = "LOGIN";
  });
}

if (logoutBtn) {
  logoutBtn.addEventListener("click", logout);
}

if (updateUser) {
  updateUser.addEventListener("submit", async (e) => {
    //console.log("submiting");
    e.preventDefault();
    document.querySelector(".btn--save").textContent = "Saving...";

    const form = new FormData();

    const name = document.getElementById("name").value;
    const email = document.getElementById("email").value;
    const photo = document.getElementById("photo").files[0];

    form.append("name", name);
    form.append("email", email);
    form.append("photo", photo);

    await updateData(form, "data");
    document.querySelector(".btn--save").textContent = "SAVE SETTINGS";
  });
}

if (updatePassword) {
  updatePassword.addEventListener("submit", async (e) => {
    e.preventDefault();
    document.querySelector(".btn--save-password").textContent = "Updating...";
    //console.log("password updating");
    const passwordCurrent = document.getElementById("password-current").value;
    const newPassword = document.getElementById("password").value;
    const passwordConfirm = document.getElementById("password-confirm").value;

    await updateData(
      { passwordCurrent, newPassword, passwordConfirm },
      "password"
    );
    document.querySelector(".btn--save-password").textContent = "Save password";
    document.getElementById("password-current").value = "";
    document.getElementById("password").value = "";
    document.getElementById("password-confirm").value = "";
  });
}

// if (bookBtn) {
//   bookBtn.addEventListener("click", (e) => {
//     console.log("booking..");
//     e.target.textContent = "Processing...";
//     const { tourId } = e.target.dataset;
//     bookTour(tourId);
//   });
// }
