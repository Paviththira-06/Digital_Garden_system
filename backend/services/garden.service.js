import GardenSession from '../models/gardenSession.model.js';

// ── Start Session (Submit Answers) ────────────────────
const startSession = async (userId, answers) => {
  const session = await GardenSession.create({ userId, answers });
  return session;
};

// ── Save Location ─────────────────────────────────────
const saveLocation = async (sessionId, userId, location) => {
  const session = await GardenSession.findOne({ _id: sessionId, userId });
  if (!session) {
    const error = new Error('Session not found');
    error.statusCode = 404;
    throw error;
  }

  session.location = location;
  await session.save();
  return session;
};

// ── Upload Photo ──────────────────────────────────────
const uploadPhoto = async (sessionId, userId, photoUrl) => {
  const session = await GardenSession.findOne({ _id: sessionId, userId });
  if (!session) {
    const error = new Error('Session not found');
    error.statusCode = 404;
    throw error;
  }

  session.spacePhoto = photoUrl;
  session.status = 'photo_uploaded';
  await session.save();
  return session;
};

// ── Generate Image ────────────────────────────────────
const generateImage = async (sessionId, userId) => {
  const session = await GardenSession.findOne({ _id: sessionId, userId });
  if (!session) {
    const error = new Error('Session not found');
    error.statusCode = 404;
    throw error;
  }

  if (!session.location) {
    const error = new Error('Please provide your location first');
    error.statusCode = 400;
    throw error;
  }

  if (!session.spacePhoto) {
    const error = new Error('Please upload your space photo first');
    error.statusCode = 400;
    throw error;
  }

  // TODO: Replace with real AI API call
  const generatedImage = `https://placeholder.com/garden-${sessionId}.jpg`;

  session.generatedImage = generatedImage;
  session.status = 'generated';
  await session.save();
  return session;
};

// ── Reprompt ──────────────────────────────────────────
const reprompt = async (sessionId, userId, prompt) => {
  const session = await GardenSession.findOne({ _id: sessionId, userId });
  if (!session) {
    const error = new Error('Session not found');
    error.statusCode = 404;
    throw error;
  }

  if (session.status !== 'generated') {
    const error = new Error('Please generate image first');
    error.statusCode = 400;
    throw error;
  }

  if (session.repromptCount >= 3) {
    const error = new Error('Maximum reprompt limit reached (3 times)');
    error.statusCode = 400;
    throw error;
  }

  const wordCount = prompt.trim().split(/\s+/).length;
  if (wordCount > 20) {
    const error = new Error('Prompt must be 20 words or less');
    error.statusCode = 400;
    throw error;
  }

  // TODO: Replace with real AI API call
  const newImage = `https://placeholder.com/garden-reprompt-${sessionId}-${session.repromptCount + 1}.jpg`;

  session.generatedImage = newImage;
  session.lastPrompt = prompt;
  session.repromptCount += 1;
  await session.save();
  return session;
};

// ── Get Session ───────────────────────────────────────
const getSession = async (sessionId, userId) => {
  const session = await GardenSession.findOne({ _id: sessionId, userId }).lean();
  if (!session) {
    const error = new Error('Session not found');
    error.statusCode = 404;
    throw error;
  }
  return session;
};

// ── Delete Session ────────────────────────────────────
const deleteSession = async (sessionId, userId) => {
  const session = await GardenSession.findOneAndDelete({ _id: sessionId, userId });
  if (!session) {
    const error = new Error('Session not found');
    error.statusCode = 404;
    throw error;
  }
};

export { startSession, saveLocation, uploadPhoto, generateImage, reprompt, getSession, deleteSession };