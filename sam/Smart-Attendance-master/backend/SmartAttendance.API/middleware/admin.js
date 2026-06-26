const admin = (req, res, next) => {

    if (req.user.role !== "Admin") {

        return res.status(403).json({
            message: "Admin Access Only"
        });

    }

    next();

};

module.exports = admin;