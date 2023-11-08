const mongoose = require("mongoose")
const { mongo } = require("mongoose")
const marked = require("marked")
const slugify = require("slugify")
const { JSDOM } = require("jsdom")
const createDomPurifier = require("dompurify")
const dompurify = createDomPurifier(new JSDOM().window)

const articleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    markdown: {
        type: String
    },
    createdAt: {
        type: Date,
        default: () => Date.now()
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sanitizedHtml: {
        type: String,
        required: true
    }
})

articleSchema.pre("validate", function(next) {
    if (this.title) {
        this.slug = slugify(this.title, {lower: true, strict: true })
    }

    if (this.markdown) {
        this.sanitizedHtml = dompurify.sanitize(marked.parse(this.markdown))
    }

    next()
})

module.exports = mongoose.model("Article", articleSchema)
