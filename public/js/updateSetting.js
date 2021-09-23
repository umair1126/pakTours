import { showAlert } from "./alerts";
import axios from "axios";

export const updateData = async (data, type) => {
  console.log("updating", data);
  let url;
  try {
    if (type === "password") {
      url = "http://127.0.0.1:7000/api/u1/users/updatepassword";
      const response = await fetch(url, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify({
          data,
        }),
      });
      console.log(response);
      const res = await response.json();
      console.log(res);
      if (res.status === "success") {
        showAlert("success", res.message);
      } else {
        showAlert("error", res.message);
      }
    } else {
      url = "http://127.0.0.1:7000/api/u1/users/updateme";
      const res = await axios({
        method: "PATCH",
        url,
        data,
      });

      console.log(res);
      if (res.data.status === "success") {
        showAlert("success", res.data.message);
      } else if (res.data.status === "error") {
        showAlert("error", res.data.message);
      } else {
        showAlert("error", "something went wrong");
      }
    }
  } catch (error) {
    console.log(error);
  }
};
