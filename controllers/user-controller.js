const { User } = require('../models');
const Thought = require('../models/Thought');

const userController = {
	// User methods
	getAllUser(req, res) {
		User.find({}).then((dbUserData) => res.json(dbUserData)).catch((err) => {
			console.log(err);
			res.status(500).json(err);
		});
	},

	getUserById({ params }, res) {
		User.findOne({ _id: params.id })
			.populate({
				path   : 'thoughts',
				select : '-__v'
			})
			.populate({
				path   : 'friends',
				select : '-__v'
			})
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: 'No user found with this id!' });
					return;
				}
				res.json(dbUserData);
			})
			.catch((err) => {
				console.log(err);
				res.status(400).json(err);
			});
	},

	createUser({ body }, res) {
		User.create(body)
			.then((dbUserData) => res.json(dbUserData))
			.catch((err) => res.status(400).json(err));
	},

	updateUser({ params, body }, res) {
		User.findOneAndUpdate({ _id: params.id }, body, {
			new           : true,
			runValidators : true
		})
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: 'No user found with this id' });
					return;
				}
				res.json(dbUserData);
			})
			.catch((err) => res.status(400).json(err));
	},

	// // working to delete user, but user's thoughts remain...
	// deleteUser({ params }, res) {
	// 	User.findOneAndDelete({ _id: params.id })
	// 		.then((dbUserData) => {
	// 			if (!dbUserData) {
	// 				res.status(404).json({ message: 'No user found with this id' });
	// 				return;
	// 			}
	// 			res.json(dbUserData);
	// 		})
	// 		.catch((err) => res.status(400).json(err));
	// },

	// bonus remove deleted user's thoughts...
	deleteUser({ params }, res) {
		Thought.deleteMany({ userId: params.id })
			.then(() => {
        User.findOneAndDelete({ _id: params.id })
          .then((dbUserData) => {
            if (!dbUserData) {
              res.status(404).json({ message: 'No user found with this id' });
              return;
            }
					  res.json(dbUserData);
				});
			})
			.catch((err) => res.status(400).json(err));
	},

	// Friend methods
	addFriend({ params }, res) {
		User.findOneAndUpdate(
			{ _id: params.userId },
			{ $push: { friends: params.friendId } },
			{ new: true }
		)
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: 'No user found with this id' });
					return;
				}
				res.json(dbUserData);
			})
			.catch((err) => res.status(400).json(err));
	},

	removeFriend({ params }, res) {
		User.findOneAndUpdate(
			{ _id: params.userId },
			{ $pull: { friends: params.friendId } },
			{ new: true }
		)
			.then((dbUserData) => {
				if (!dbUserData) {
					res.status(404).json({ message: 'No user found with this id' });
					return;
				}
				res.json(dbUserData);
			})
			.catch((err) => res.status(400).json(err));
	}
};

module.exports = userController;
