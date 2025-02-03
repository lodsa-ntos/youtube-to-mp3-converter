const mongoose = require('mongoose');

// Schema para conversões de vídeos
// Schema for video conversions
const conversionSchema = new mongoose.Schema({
  videoUrl: {
    type: String,
    required: true,
    validate: {
      validator: (v) => /^(https?\:\/\/)?(www\.)?(youtube\.com|youtu\.be)\/.+$/.test(v),
      message: (props) => `${props.value} is not a valid YouTube URL.`
    },
  },
  mp3Url: { 
    type: String,
    required: false
  },
  status: { 
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  errorMessage: { 
    type: String,
    required: false
  },
  }, 
  { timestamps: true } // Adds createdAt and updatedAt fields
);

// Índices para consultas rápidas
// Indexes for quick queries
conversionSchema.index({ status: 1 });
conversionSchema.index({ createdAt: -1 });

const Conversion = mongoose.model('Conversion', conversionSchema);

module.exports = Conversion;