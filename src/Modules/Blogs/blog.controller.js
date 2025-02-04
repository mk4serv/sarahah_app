// blog routers (Controller)

const express = require("express");
const app = express();

app.get("/blogs", getAllBlogs);
app.get("/blogs/:id", getBlogById);
app.post("/blogs", createBlog);
app.put("/blogs/:id", updateBlog);
app.delete("/blogs/:id", deleteBlog);