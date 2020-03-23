const { Router } = require('express');
const Course = require('../models/courses');
const router = Router();

router.get('/', async (req, res) => {
  const courses = await Course.getAll();
  res.render('courses', {
    title: 'Список курсов',
    isCourses: true,
    courses
  });
});

module.exports = router;
