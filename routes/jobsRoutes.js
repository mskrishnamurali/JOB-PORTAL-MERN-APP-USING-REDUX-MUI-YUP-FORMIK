const express = require('express');
const router = express.Router();
const { createJob, singleJob, updateJob, showJobs, deleteJob } = require('../controllers/jobsController');
const { isAuthenticated, isAdmin, } = require('../middleware/auth');



//job type routes

// /api/type/create
router.post('/job/create', isAuthenticated, createJob)

router.get('/job/:id', singleJob)

router.put('/job/update/:job_id', isAuthenticated, updateJob)

router.get('/jobs/show', showJobs)

router.delete('/job/delete/:job_id', isAuthenticated, deleteJob)


module.exports = router;