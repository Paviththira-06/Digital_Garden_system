import { startSession, saveLocation, uploadPhoto, generateImage, reprompt, getSession, deleteSession } from '../services/garden.service.js';
import { sendSuccess, sendError } from '../utils/response.util.js';

const start = async (req, res) => {
  try {
    const { spaceType, spaceSize, plantType, sunlight, watering, purpose, budget } = req.body;

    if (!spaceType || !spaceSize || !plantType || !sunlight || !watering || !purpose || !budget) {
      return sendError(res, 400, 'All questions are required');
    }
    if (!Array.isArray(plantType) || plantType.length === 0) {
      return sendError(res, 400, 'Please select at least one plant type');
    }

    const session = await startSession(req.user.userId, { spaceType, spaceSize, plantType, sunlight, watering, purpose, budget });
    return sendSuccess(res, 201, 'Garden session started', { session });
  } catch (error) {
    if (error.statusCode) return sendError(res, error.statusCode, error.message);
    return sendError(res, 500, 'Internal server error', error);
  }
};

const location = async (req, res) => {
  try {
    const { sessionId, location } = req.body;
    if (!sessionId || !location) return sendError(res, 400, 'Session ID and location are required');

    const session = await saveLocation(sessionId, req.user.userId, location);
    return sendSuccess(res, 200, 'Location saved', { session });
  } catch (error) {
    if (error.statusCode) return sendError(res, error.statusCode, error.message);
    return sendError(res, 500, 'Internal server error', error);
  }
};

const photo = async (req, res) => {
  try {
    const { sessionId, photoUrl } = req.body;
    if (!sessionId || !photoUrl) return sendError(res, 400, 'Session ID and photo are required');

    const session = await uploadPhoto(sessionId, req.user.userId, photoUrl);
    return sendSuccess(res, 200, 'Photo uploaded', { session });
  } catch (error) {
    if (error.statusCode) return sendError(res, error.statusCode, error.message);
    return sendError(res, 500, 'Internal server error', error);
  }
};

const generate = async (req, res) => {
  try {
    const { sessionId } = req.body;
    if (!sessionId) return sendError(res, 400, 'Session ID is required');

    const session = await generateImage(sessionId, req.user.userId);
    return sendSuccess(res, 200, 'Image generated successfully', { session });
  } catch (error) {
    if (error.statusCode) return sendError(res, error.statusCode, error.message);
    return sendError(res, 500, 'Internal server error', error);
  }
};

const repromptController = async (req, res) => {
  try {
    const { sessionId, prompt } = req.body;
    if (!sessionId || !prompt) return sendError(res, 400, 'Session ID and prompt are required');

    const session = await reprompt(sessionId, req.user.userId, prompt);
    return sendSuccess(res, 200, 'Image regenerated successfully', { session });
  } catch (error) {
    if (error.statusCode) return sendError(res, error.statusCode, error.message);
    return sendError(res, 500, 'Internal server error', error);
  }
};

const getSessionController = async (req, res) => {
  try {
    const session = await getSession(req.params.id, req.user.userId);
    return sendSuccess(res, 200, 'Session fetched', { session });
  } catch (error) {
    if (error.statusCode) return sendError(res, error.statusCode, error.message);
    return sendError(res, 500, 'Internal server error', error);
  }
};

const deleteSessionController = async (req, res) => {
  try {
    await deleteSession(req.params.id, req.user.userId);
    return sendSuccess(res, 200, 'Session deleted successfully');
  } catch (error) {
    if (error.statusCode) return sendError(res, error.statusCode, error.message);
    return sendError(res, 500, 'Internal server error', error);
  }
};

export { start, location, photo, generate, repromptController, getSessionController, deleteSessionController };