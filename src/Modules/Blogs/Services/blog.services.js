const getAllBlogs = (req, res) => {
    res.send("Get All Blogs");
};

const getBlogById = (req, res) => {
    res.send("Get Blog By Id");
};

const createBlog = (req, res) => {
    res.send("Create Blog");
};

const updateBlog = (req, res) => {
    res.send("Update Blog");
};

const deleteBlog = (req, res) => {
    res.send("Delete Blog");
};

module.exports = {
    getAllBlogs,
    getBlogById,
    createBlog,
    updateBlog,
    deleteBlog
}