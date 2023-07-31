const mongoose = require("mongoose")

const blogSchema = new mongoose.Schema({
    title: {type: String, require: true},
    category : {type: String, require: true},
    author_name: {type: String},
    author_email: {type: String},
    content: {type: String, require: true}
},{
    timestamps: true,
})

const BlogModel = mongoose.model("blog", blogSchema)

module.exports = {
    BlogModel
}