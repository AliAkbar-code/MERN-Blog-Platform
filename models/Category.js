import mongoose from 'mongoose';
import slugify from 'slugify';

const categorySchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Please provide a category name'],
        unique: true,
        trim: true,
        maxlength: [50, 'Name cannot be more than 50 characters']
    },
    slug: String,
    description: {
        type: String,
        maxlength: [500, 'Description cannot be more than 500 characters']
    }
}, { timestamps: true });

// Create category slug from the name
categorySchema.pre('save', function (next) {
    this.slug = slugify(this.name, { lower: true });
    next();
});

const Category = mongoose.model('Category', categorySchema);

export default Category;
