const router = require('express').Router();

const {
	getAllThought,
	getThoughtById,
	createThought,
	updateThought,
  removeThought,
  addReaction,
  removeReaction
} = require('../../controllers/thought-controller');

// GET and POST at /api/thoughts
router.route('/').get(getAllThought).post(createThought);

// GET one, PUT, and DELETE at /api/thoughts/:id
router.route('/:id').get(getThoughtById).put(updateThought).delete(removeThought);

// POST at /api/thoughts/:thoughtId/reactions
router  
  .route('/:thoughtId/reactions')
  .post(addReaction);

// DELETE at /api/thoughts/:thoughtId/reactions/:reactionId
router  
  .route('/:thoughtId/reactions/:reactionId')
  .delete(removeReaction);

module.exports = router;