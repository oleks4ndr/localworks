import mongoose from 'mongoose';

// user
const UserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true,
    trim: true
  },
  passwordHash: {
    type: String,
    required: true
  },
  role: {
    type: String,
    enum: ['user', 'tradesperson', 'admin'],
    default: 'user'
  }
}, {
  timestamps: true // automatically adds createdAt and updatedAt
});

// profile
const ProfileSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  displayName: {
    type: String,
    required: true,
    trim: true
  },
  headline: {
    type: String,
    trim: true
  },
  skills: [{
    type: String,
    trim: true
  }],
  credentials: [{
    label: {
      type: String,
      required: true
    },
    issuer: {
      type: String,
      required: true
    },
    id: {
      type: String,
      required: true
    }
  }],
  bio: {
    type: String,
    trim: true
  },
  rate: {
    currency: {
      type: String,
      default: 'USD'
    },
    amount: {
      type: Number,
      min: 0
    },
    unit: {
      type: String,
      enum: ['hour', 'day', 'project'],
      default: 'hour'
    }
  },
  location: {
    city: String,
    state: String,
    lat: {
      type: Number,
      min: -90,
      max: 90
    },
    lng: {
      type: Number,
      min: -180,
      max: 180
    }
  },
  serviceRadiusKm: {
    type: Number,
    min: 0,
    default: 25
  },
  photos: [{
    type: String // URL to photo
  }],
  isPublished: {
    type: Boolean,
    default: false
  },
  avgRating: {
    type: Number,
    min: 0,
    max: 5,
    default: null
  },
  reviewCount: {
    type: Number,
    min: 0,
    default: 0
  }
}, {
  timestamps: true
});

// review
const ReviewSchema = new mongoose.Schema({
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  profile: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Profile',
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  comment: {
    type: String,
    trim: true
  }
}, {
  timestamps: true
});

// add compound index to prevent duplicate reviews from same user on same profile
ReviewSchema.index({ reviewer: 1, profile: 1 }, { unique: true });

// conversation
const ConversationSchema = new mongoose.Schema({
  participants: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  }],
  lastMessageAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// message Schema
const MessageSchema = new mongoose.Schema({
  conversation: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Conversation',
    required: true
  },
  sender: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true,
    trim: true
  },
  readAt: {
    type: Date,
    default: null
  }
}, {
  timestamps: true
});

// create models
const User = mongoose.model('User', UserSchema);
const Profile = mongoose.model('Profile', ProfileSchema);
const Review = mongoose.model('Review', ReviewSchema);
const Conversation = mongoose.model('Conversation', ConversationSchema);
const Message = mongoose.model('Message', MessageSchema);

// export models
export { User, Profile, Review, Conversation, Message };
