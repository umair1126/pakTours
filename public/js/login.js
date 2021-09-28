const url = "http://127.0.0.1:7000/api/u1/users/login";
import { showAlert } from "./alerts";

export const login = async (email, password) => {
  //console.log(email, password);
  try {
    const res = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        // 'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: JSON.stringify({
        email: email,
        password: password,
      }),
    });
    //console.log(res);
    const r = await res.json();
    //console.log(r);
    if (r.status === "success") {
      //console.log("entering");
      showAlert("success", "logged in successfully!");
      window.setTimeout(() => {
        location.assign("/");
      }, 2000);
    } else {
      console.log(r.message);
      showAlert("error", "invalid login info!");
    }
  } catch (error) {
    console.log(error);
  }
};

export const logout = async () => {
  //console.log("logouting");
  try {
    const res = await fetch("http://127.0.0.1/api/u1/users/logout", {
      method: "GET",
    });
    const r = await res.json();
    console.log(r);
    if (r.status === "success") location.assign("/");
  } catch (error) {
    console.log(error);
  }
};
