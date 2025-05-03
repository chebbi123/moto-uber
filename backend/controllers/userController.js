import User from '../models/User.js';

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, role } = req.body;

    // Validate required fields
    if (!name || !email || !role) {
      return res.status(400).send({ error: 'All fields are required.' });
    }

    // Find and update the user
    const updatedUser = await User.findByIdAndUpdate(
      id,
      { name, email, role },
      { new: true, runValidators: true }
    );

    if (!updatedUser) {
      return res.status(404).send({ error: 'User not found.' });
    }

    res.status(200).send(updatedUser);
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while updating the user.' });
  }
};

export const userInfo = async (req, res) => {
  try {
    const userId = req.user._id; // Assuming user ID is available in req.user from authentication middleware
    const user = await User.findById(userId).select('-password'); // Exclude password from the response

    if (!user) {
      return res.status(404).send({ error: 'User not found.' });
    }

    res.status(200).send(user);
  } catch (error) {
    res.status(500).send({ error: 'An error occurred while fetching user information.' });
  }
};
