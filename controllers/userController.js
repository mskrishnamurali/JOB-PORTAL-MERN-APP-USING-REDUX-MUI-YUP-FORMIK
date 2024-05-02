const User = require('../models/userModel');
const ErrorResponse = require('../utils/errorResponse');

//load all users
exports.allUsers = async (req, res, next) => {
    //enable pagination
    const pageSize = 10;
    const page = Number(req.query.pageNumber) || 1;
    const count = await User.find({}).estimatedDocumentCount();

    try {
        const users = await User.find().sort({ createdAt: -1 }).select('-password')
            .skip(pageSize * (page - 1))
            .limit(pageSize)

        res.status(200).json({
            success: true,
            users,
            page,
            pages: Math.ceil(count / pageSize),
            count

        })
        next();
    } catch (error) {
        return next(error);
    }
}

//show single user
exports.singleUser = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        res.status(200).json({
            success: true,
            user
        })
        next();

    } catch (error) {
        return next(error);
    }
}


//edit user
exports.editUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.status(200).json({
            success: true,
            user
        })
        next();

    } catch (error) {
        return next(error);
    }
}

//delete user
exports.deleteUser = async (req, res, next) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        res.status(200).json({
            success: true,
            message: "user deleted"
        })
        next();

    } catch (error) {
        return next(error);
    }
}
exports.createUserJobsHistory = async (req, res, next) => {
    const { title, description, salary, location } = req.body;

    try {
        const currentUser = await User.findOne({ _id: req.user._id });
        if (!currentUser) {
            return next(new ErrorResponse("You must log In", 401));
        } else {
            const addJobHistory = {
                title,
                description,
                salary,
                location,
                user: req.user._id
            }
            currentUser.jobsHistory.push(addJobHistory);
            await currentUser.save();
        }

        res.status(200).json({
            success: true,
            currentUser
        })
        next();

    } catch (error) {
        return next(error);
    }
}
exports.deleteUserJobsHistory = async (req, res, next) => {
    const jobId = req.params.jobId;

    try {
        const currentUser = await User.findOne({ _id: req.user._id });
        if (!currentUser) {
            return next(new ErrorResponse("User not found", 404));
        }

        const jobIndex = currentUser.jobsHistory.findIndex(job => job._id === jobId);
        if (jobIndex === -1) {
            return next(new ErrorResponse("Job history entry not found", 404));
        }

        currentUser.jobsHistory.splice(jobIndex, 1);
        await currentUser.save();

        res.status(200).json({
            success: true,
            message: "Job history entry deleted successfully"
        });
    } catch (error) {
        return next(error);
    }
};
exports.deleteUserJobsHistory = async (req, res, next) => {
    const jobId = req.params.jobId;
    try {
        const currentUser = await User.findById(req.user._id);
        if (!currentUser) {
            return res.status(404).json({ message: 'User not found' });
        }
        const indexToRemove = currentUser.jobsHistory.findIndex(job => job._id === jobId);
        if (indexToRemove === -1) {
            return res.status(404).json({ message: 'Job history entry not found' });
        }
        currentUser.jobsHistory.splice(indexToRemove, 1);
        await currentUser.save();
        res.status(200).json({ message: 'Job history entry deleted successfully' });
    } catch (error) {
        next(error);
    }
};