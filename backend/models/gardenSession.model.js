import mongoose from 'mongoose';

const gardenSessionSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: true,
      index: true,
    },
    answers: {
      spaceType: {
        type: String,
        enum: ['balcony', 'rooftop', 'small_backyard', 'indoor', 'terrace'],
        required: true,
      },
      spaceSize: {
        type: String,
        enum: ['very_small', 'small', 'medium', 'large'],
        required: true,
      },
      plantType: {
        type: [String],
        enum: ['vegetables', 'fruits', 'herbal_plants', 'flowers', 'indoor_plants'],
        required: true,
      },
      sunlight: {
        type: String,
        enum: ['full_sun', 'partial_sun', 'low_light'],
        required: true,
      },
      watering: {
        type: String,
        enum: ['daily', 'every_2_3_days', 'once_a_week', 'rarely'],
        required: true,
      },
      purpose: {
        type: String,
        enum: ['eating', 'beauty', 'both', 'selling'],
        required: true,
      },
      budget: {
        type: String,
        enum: ['low', 'medium', 'high', 'premium'],
        required: true,
      },
    },
    location: {
      type: String,
      default: null,
    },
    spacePhoto: {
      type: String,
      default: null,
    },
    generatedImage: {
      type: String,
      default: null,
    },
    repromptCount: {
      type: Number,
      default: 0,
      max: 3,
    },
    lastPrompt: {
      type: String,
      default: null,
    },
    status: {
      type: String,
      enum: ['started', 'photo_uploaded', 'generated', 'completed'],
      default: 'started',
    },
    expiresAt: {
      type: Date,
      default: () => new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days
      index: { expires: 0 },
    },
  },
  { timestamps: true }
);

const GardenSession = mongoose.model('GardenSession', gardenSessionSchema);
export default GardenSession;