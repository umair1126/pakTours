import { showAlert } from "./alerts";
const url = "http://127.0.0.1:7000/api/u1/users/signup";

export const signUp = async (name, email, password, confirmPassword) => {
  console.log(name, email, password, confirmPassword);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        name,
        email,
        password,
        confirmPassword,
      }),
    });
    console.log(res);
    const r = await res.json();
    console.log(r);
    if (r.status === "success") {
      console.log("entering");
      showAlert("success", "SignUp successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 2000);
    } else {
      console.log(r.message);
      showAlert("error", r.message);
    }
  } catch (error) {
    console.log(error);
  }
};
