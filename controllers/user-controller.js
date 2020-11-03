const { User, Thought } = require('../models');

const userController = {
    getAllUsers(req, res) {
        User.find({})
        .populate({
          path: 'thoughts',
          select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
          .then(dbData => res.json(dbData))
          .catch(err => {
            console.log(err);
            res.status(500).json(err);
          });
      },

    getUserById({ params }, res) {
        User.findOne({ _id: params.id })
        .populate({
            path: 'thoughts',
            select: '-__v'
        })
        .populate({
            path: 'friends',
            select: '-__v'
        })
        .select('-__v')
          .then(dbData => {
            if (!dbData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbData)
          })
          .catch(err => {
            console.log(err);
            res.status(400).json(err);
          });
    },

    createUser({ body }, res) {
        User.create(body)
          .then(dbData => res.json(dbData))
          .catch(err => res.status(400).json(err));
    },

    updateUser({ params, body }, res) {
        User.findOneAndUpdate({ _id: params.id }, body, { new: true,  runValidators: true })
          .then(dbData => {
            if (!dbData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            res.json(dbData);
          })
          .catch(err => res.status(400).json(err));
    },

    deleteUser({ params }, res) {
        User.findOneAndDelete({ _id: params.id })
          .then(dbData => {
            if (!dbData) {
              res.status(404).json({ message: 'No user found with this id!' });
              return;
            }
            return Thought.deleteMany({_id: {$in: dbData.thoughts}});
          })
          .then((returnedData) => {
            res.json(returnedData);
          })
          .catch(err => res.status(400).json(err));
    },

    addFriend({ params }, res) {
        User.findOneAndUpdate(
            { _id: params.userId },
            { $addToSet: { friends: params.friendId } },
            { new: true}
        )
            .then(dbData => {
              if (!dbData) {
                res.status(404).json({ message: 'No user found with this id!' });
                return;
              }
              res.json(dbData);
            })
            .catch(err => res.json(err));
    },

    deleteFriend({ params }, res) {
        User.findOneAndUpdate(
          { _id: params.userId },
          { $pull: { friends: params.friendId } },
          { new: true }
        )
          .then(dbData => res.json(dbData))
          .catch(err => res.json(err));
    }
     
}

module.exports = userController;