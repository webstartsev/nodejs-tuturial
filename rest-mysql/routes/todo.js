const { Router } = require('express');
const router = Router();

// Получение списка задач
router.get('/', (req, res) => {
  res.json({ a: 1 });
});

// Создание задачи
router.post('/', (req, res) => {});

// Изменение заадчи
router.put('/:id', (req, res) => {});

// Удаление задачи
router.delete('/:id', (req, res) => {});

module.exports = router;
