import mongoose from 'mongoose';

const BookmarkSchema = new mongoose.Schema(
  {
    userId: { type: String, required: true, index: true },
    resourceId: { type: String, required: true },
    title: { type: String, required: true, trim: true },
    platform: { type: String, default: '' },
    linkUrl: { type: String, default: '' },
    resourceData: { type: mongoose.Schema.Types.Mixed, default: {} }
  },
  { timestamps: true }
);

BookmarkSchema.index({ userId: 1, resourceId: 1 }, { unique: true });

const Bookmark = mongoose.models.Bookmark || mongoose.model('Bookmark', BookmarkSchema);
export default Bookmark;
