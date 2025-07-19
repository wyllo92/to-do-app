import mongoose, { Schema } from "mongoose";

// Define sub-schemas
const assigneeSchema = new Schema({
  name: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },
  role: {
    type: String,
    enum: ["Developer", "Designer", "Manager", "Tester", "Other"],
    default: "Other",
  },
  userId: {
    type: String,
    required: false,
  },
});

// Subdocument for files
const fileSchema = new Schema({
  name: { type: String, required: true },
  url: { type: String, required: true },
  type: { type: String, enum: ["document", "image", "video", "other"] },
  extension: { type: String, required: true },
  size: { type: Number }, // in KB
  uploadDate: { type: Date, default: Date.now },
});

const commentSchema = new Schema({
  content: {
    type: String,
    required: true,
    trim: true,
  },
  author: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const taskSchema = new Schema({
  title: {
    type: String,
    required: true,
    trim: true,
    maxlength: 100,
  },
  description: {
    type: String,
    trim: true,
  },
  type: {
    type: String,
    enum: ["Development", "Design", "Meeting", "Documentation", "Other"],
    required: true,
  },
  priority: {
    type: String,
    enum: ["High", "Medium", "Low"],
    default: "Medium",
  },
  color: {
    type: String,
    default: "#3498db",
    match: /^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$/,
  },

  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
    validate: {
      validator: function (value) {
        return value >= this.startDate;
      },
      message: "End date must be after start date",
    },
  },
  creationDate: {
    type: Date,
    default: Date.now,
  },
  status: {
    type: String,
    enum: ["Pending", "In Progress", "Completed", "Cancelled"],
    default: "Pending",
  },
  notificationEmail: {
    type: String,
    match: /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
  },

  assignees: [assigneeSchema],
  files: [fileSchema],
  comments: [commentSchema],
  tags: [
    {
      type: String,
      trim: true,
    },
  ],
  projectID: {
    type: Schema.Types.ObjectId,
    ref: "Project",
    required: false,
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true, // Change from true to false
  },
  lastModified: {
    type: Date,
    default: Date.now,
  },
});

// Middleware to update modification date before saving
taskSchema.pre("save", function (next) {
  this.lastModified = new Date();
  next();
});

taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ starDate: 1, endDate: 1 });
taskSchema.index({ tags: 1 });

export default mongoose.model("Task", taskSchema);
