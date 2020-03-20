const fs = require('fs');
const path = require('path');

// // Создание папки
fs.mkdir(path.join(__dirname, 'notes'), err => {
  if (err) {
    if (err.code === 'EEXIST') {
      fs.rmdir(path.join(__dirname, 'notes'), errUnlink => {
        if (errUnlink) throw errUnlink;

        console.log('Папка была удалена');
      });
    } else {
      throw new Error(err);
    }
  } else {
    console.log('Папка была создана');
  }
});

// // Создание, добавление в файл и чтение из файла
fs.writeFile(path.join(__dirname, 'notes', 'mynotes.txt'), 'Hello world', err => {
  if (err) throw err;

  console.log('Файл был создан');

  fs.appendFile(path.join(__dirname, 'notes', 'mynotes.txt'), ' From append file', err => {
    if (err) throw err;

    console.log('Файл обновлен');

    fs.readFile(path.join(__dirname, 'notes', 'mynotes.txt'), 'utf-8', (err, data) => {
      if (err) throw err;

      console.log(data);
    });
  });
});

fs.rename(
  path.join(__dirname, 'notes', 'mynotes.txt'),
  path.join(__dirname, 'notes', 'notes.txt'),
  err => {
    if (err) throw err;

    console.log('Файл переименован');
  }
);
