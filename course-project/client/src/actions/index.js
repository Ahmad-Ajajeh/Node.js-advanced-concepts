import axios from "axios";
import { FETCH_USER, FETCH_BLOGS, FETCH_BLOG } from "./types";

export const fetchUser = () => async (dispatch) => {
  const res = await axios.get("/api/current_user");

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const handleToken = (token) => async (dispatch) => {
  const res = await axios.post("/api/stripe", token);

  dispatch({ type: FETCH_USER, payload: res.data });
};

export const submitBlog = (values, file, history) => async (dispatch) => {
  // 1 - ask for a generated file url from the backend .
  const uploadConfig = await axios.get(
    "/api/generate-signed-url?type=" + file.type
  );

  // 2 - put the file into the generated url suit .
  await axios.put(uploadConfig.data.url, file, {
    headers: {
      "Content-Type": file.type,
    },
  });

  // 3 - now you are able to create a blog with an image properly .
  const res = await axios.post("/api/blogs", {
    ...values,
    filename: uploadConfig.data.filename,
  });

  history.push("/blogs");
  dispatch({ type: FETCH_BLOG, payload: res.data });
};

export const fetchBlogs = () => async (dispatch) => {
  const res = await axios.get("/api/blogs");

  dispatch({ type: FETCH_BLOGS, payload: res.data });
};

export const fetchBlog = (id) => async (dispatch) => {
  const res = await axios.get(`/api/blogs/${id}`);

  dispatch({ type: FETCH_BLOG, payload: res.data });
};
