import axios from "axios";

export const axiosConfig = {
  headers: {
    authorization: `Bearer ${typeof window !== "undefined" ? localStorage.getItem("token") : ""
      }`,
  },
};

export const login = async (email, password) => {
  try {
    const res = await axios.post("http://localhost:4000/auth", {
      email,
      password,
    });
    const token = res.data.token;
    localStorage.setItem("token", token);
    // console.log(token)
    alert("Login realizado com sucesso!")
    axiosConfig.headers.authorization = `Bearer ${token}`;
    return { success: true };
  } catch (error) {
    return { success: false, message: error.message };
  }
};

export const logout = (router) => {
  localStorage.removeItem("token");
  axiosConfig.headers.authorization = "";
  router.push("/")
}