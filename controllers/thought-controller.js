const { Thought, User } = require('../models');

const thoughtController = {
  // Thought methods
	getAllThought(req, res) {
		Thought.find({}).then((dbThoughtData) => res.json(dbThoughtData)).catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
	},

	getThoughtById({ params }, res) {
		Thought.findOne({ _id: params.id })
			.then((dbThoughtData) => {
				if (!dbThoughtData) {
					res.status(404).json({ message: 'No thought found with this id!' });
					return;
				}
				res.json(dbThoughtData);
			})
			.catch((ett) => {
				console.log(err);
				res.status(400).json(err);
			});
	},

	createThought({ body }, res) {
    Thought.create(body)
      // destructure new thought _id from db response data
			.then(({ _id, userId }) => {
        // add new thought _id to user's thoughts array
				return User.findOneAndUpdate(
					// user _id
					{ _id: userId },
					// thought _id
					{ $push: { thoughts: _id } },
					{ new: true }
				);
			})
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: 'No user found with this id.' });
					return;
        }
        // send updated user data to client
				res.json(dbUserData);
			})
			.catch((err) => res.status(500).json(err));
	},

	updateThought({ params, body }, res) {
		Thought.findOneAndUpdate({ _id: params.id }, body, {
			new: true,
			runValidators: true
		})
			.then((dbThoughtData) => {
				if (!dbThoughtData) {
					res.status(404).json({ message: 'No thought with this id.' });
					return;
				}
				res.json(dbThoughtData);
			})
			.catch((err) => res.status(400).json(err));
	},

	removeThought({ params }, res) {
    Thought.findOneAndDelete({ _id: params.id })
      .then(deletedThought => {
        if (!deletedThought) {
          res.status(404).json({ message: 'No thought with this id.' })
        return;
        }
        // remove deleted thought _id from user's thoughts array
        return User.findOneAndUpdate(
          { _id: deletedThought.userId },
          { $pull: { thoughts: params.id} },
          { new: true }
        )
      })
      .then(dbUserData => {
        if (!dbUserData) {
          res.status(404).json({ message: 'No user found with this id.' });
          return;
        }
        res.json(dbUserData)
      })
      .catch(err => res.json(err));
  },

  // Reaction methods
  addReaction({ params, body }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $push: { reactions: body }},
      { new: true, runValidators: true }
    )
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id.' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.json(err));
  },
  
  removeReaction({ params }, res) {
    Thought.findOneAndUpdate(
      { _id: params.thoughtId },
      { $pull: { reactions: { reactionId: params.reactionId} }},
      { new: true }
    )
    .then(dbThoughtData => {
      if (!dbThoughtData) {
        res.status(404).json({ message: 'No thought found with this id.' });
        return;
      }
      res.json(dbThoughtData);
    })
    .catch(err => res.json(err));
  }

};

module.exports = thoughtController;
