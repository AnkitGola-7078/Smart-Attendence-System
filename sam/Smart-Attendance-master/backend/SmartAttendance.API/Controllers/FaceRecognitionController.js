const User = require("../models/User");

// Euclidean Distance
const euclideanDistance = (source, target) => {
  if (source.length !== target.length) {
    return Number.MAX_VALUE;
  }

  let sum = 0;

  for (let i = 0; i < source.length; i++) {
    sum += Math.pow(
      source[i] - target[i],
      2
    );
  }

  return Math.sqrt(sum);
};

// POST /api/face/register
const registerFace = async (req, res) => {
  try {
    const { userId, faceData } = req.body;

    if (
      !faceData ||
      faceData.length === 0
    ) {
      return res.status(400).json({
        message: "No face data provided"
      });
    }

    const enrolledUsers = await User.find({
      faceData: {
        $exists: true,
        $ne: []
      }
    });

    for (const user of enrolledUsers) {
      if (
        user._id.toString() === userId
      ) {
        continue;
      }

      for (const existingEmbedding of user.faceData) {
        for (const incomingEmbedding of faceData) {
          const distance =
            euclideanDistance(
              existingEmbedding,
              incomingEmbedding
            );

          if (distance < 0.5) {
            return res.status(400).json({
              message:
                "Face already registered to another user in the system"
            });
          }
        }
      }
    }

    const updatedUser =
      await User.findByIdAndUpdate(
        userId,
        {
          faceData
        },
        {
          new: true
        }
      );

    if (!updatedUser) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    res.status(200).json({
      message:
        "Face registered successfully"
    });
  } catch (error) {
    res.status(500).json({
      message:
        "Error occurred during registration",
      error: error.message
    });
  }
};

// GET /api/face/data
const getFaceData = async (
  req,
  res
) => {
  try {
    const loggedInUserId =
      req.user.id;

    const loggedInRole =
      req.user.role;

    let usersWithFaces;

    if (
      loggedInRole === "Admin"
    ) {
      usersWithFaces =
        await User.find({
          faceData: {
            $exists: true,
            $ne: []
          }
        });
    } else {
      usersWithFaces =
        await User.find({
          _id: loggedInUserId,
          faceData: {
            $exists: true,
            $ne: []
          }
        });
    }

    const payload =
      usersWithFaces.map(user => ({
        userId: user._id,
        name: user.name,
        faceData: user.faceData
      }));

    res.status(200).json(payload);
  } catch (error) {
    res.status(500).json({
      message:
        "Error fetching face data",
      error: error.message
    });
  }
};

module.exports = {
  registerFace,
  getFaceData
};