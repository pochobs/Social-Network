const { Thought, User } = require('../models');

const thoughtController = {

    getAllThoughts(req, res) {
        Thought.find({})
        .populate({
          path: 'reactions',
          select: '-__v'
        })
        .select('-__v')
          .then(dbData => res.json(dbData))
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
      },

    getThoughtById({ params }, res) {
        Thought.findOne({ _id: params.id })
        .populate({
            path: 'reactions',
            select: '-__v'
        })
        .select('-__v')
          .then(dbData => {
            if (!dbData) {
              res.status(404).json({ message: 'No Thought found with this id!' });
              return;
            }
            res.json(dbData)
          })
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
          });
    },

    createThought({ body }, res) {
        Thought.create(body)
        .then(({ _id }) => {
          return User.findOneAndUpdate(
            { _id: body.userId },
            { $push: { thoughts: _id } },
            { new: true }
          );
        })
        .then(dbData => {
          if (!dbData) {
            res.status(404).json({ message: 'No user found with this id!' });
            return;
          }
          res.json(dbData);
        })
        .catch(err => res.json(err));
    },

    updateThought({ params, body }, res) {
        Thought.findOneAndUpdate({ _id: params.id }, body, { new: true,  runValidators: true })
          .then(dbData => {
            if (!dbData) {
              res.status(404).json({ message: 'No Thought found with this id!' });
              return;
            }
            res.json(dbData);
          })
          .catch(err => res.status(400).json(err));
    },

    deleteThought({ params }, res) {
        Thought.findOneAndDelete({ _id: params.id })
        .then(deletedThought => {
          if (!deletedThought) {
            return res.status(404).json({ message: 'No Thought with this id!' });
          }
          return User.findOneAndUpdate(
            { thoughts: params.id },
            { $pull: { thoughts: params.id } },
            { new: true }
          );
        })
        .then(dbData => {
          if (!dbData) {
            res.status(404).json({ message: 'Thought is deleted, but there is no user for this thought!' });
            return;
          }
          res.json(dbData);
        })
        .catch(err => res.json(err));
    },

    addReaction({ params, body }, res) {
        Thought.findOneAndUpdate(
            { _id: params.thoughtId },
            { $push: { reactions: body } },
            { new: true, runValidators: true}
        )
            .then(dbData => {
              if (!dbData) {
                res.status(404).json({ message: 'No Thought found with this id!' });
                return;
              }
              res.json(dbData);
            })
            .catch(err => res.json(err));
    },

    deleteReaction({ params }, res) {
        Thought.findOneAndUpdate(
          { _id: params.thoughtId },
          { $pull: { reactions: { reactionId: params.reactionId } } },
          { new: true }
        )
          .then(dbData => res.json(dbData))
          .catch(err => res.json(err));
    }    

}

module.exports = thoughtController;