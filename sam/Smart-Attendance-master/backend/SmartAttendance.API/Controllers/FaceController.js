const User = require("../models/User");

// Euclidean Distance Function
const euclideanDistance = (a, b) => {
  if (a.length !== b.length) {
    return Number.MAX_VALUE;
  }

  let sum = 0;

  for (let i = 0; i < a.length; i++) {
    sum += Math.pow(a[i] - b[i], 2);
  }

  return Math.sqrt(sum);
};

// POST /api/face/register
const registerFace = async (req, res) => {
  try {
    const { userId, embeddings } = req.body;

    if (
      !userId ||
      !embeddings ||
      embeddings.length === 0
    ) {
      return res.status(400).json({
        message: "Invalid request data"
      });
    }

    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "User not found"
      });
    }

    user.faceData = embeddings;

    await user.save();

    res.status(200).json({
      message: "Face registered successfully"
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

// POST /api/face/match
const matchFace = async (req, res) => {
  try {
    const { embedding } = req.body;

    if (!embedding || embedding.length === 0) {
      return res.status(400).json({
        message: "Invalid embedding"
      });
    }

    const allUsers = await User.find({
      faceData: {
        $exists: true,
        $ne: []
      }
    });

    let bestMatch = null;
    let bestDistance = Number.MAX_VALUE;

    const threshold = 0.55;

    for (const user of allUsers) {
      if (
        !user.faceData ||
        user.faceData.length === 0
      ) {
        continue;
      }

      let totalDistance = 0;

      for (const registeredEmbedding of user.faceData) {
        totalDistance += euclideanDistance(
          embedding,
          registeredEmbedding
        );
      }

      const averageDistance =
        totalDistance / user.faceData.length;

      if (averageDistance < bestDistance) {
        bestDistance = averageDistance;
        bestMatch = user;
      }
    }

    if (
      bestMatch &&
      bestDistance <= threshold
    ) {
      const confidence = Math.max(
        0,
        Math.min(
          1,
          1 - bestDistance / (threshold * 1.5)
        )
      );

      return res.status(200).json({
        match: true,
        userId: bestMatch._id,
        userName: bestMatch.name,
        confidence: Number(
          (confidence * 100).toFixed(2)
        )
      });
    }

    return res.status(200).json({
      match: false,
      message: "No matching face found",
      distance: bestDistance
    });
  } catch (error) {
    res.status(500).json({
      message: error.message
    });
  }
};

module.exports = {
  registerFace,
  matchFace
};