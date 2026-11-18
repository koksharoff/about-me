# about-me

Сайт-визитка Вячеслава Кокшарова: основатель агротех-стартапа «Моё зерно», студент РГАУ-МСХА, разработчик.

Чистый статический сайт без сборки: `index.html`, `styles.css`, `script.js`.

## Запустить локально

```bash
python3 -m http.server 4173
```

Открыть http://localhost:4173.

## Опубликовать на GitHub Pages

Settings → Pages → Source: «Deploy from a branch», ветка `main`, папка `/ (root)`.
Сайт появится по адресу https://koksharoff.github.io/about-me/.

## Что поменять

- **Фото:** положить `assets/photo.jpg` (вертикальное, 4:5) и раскомментировать `<img>` в блоке «Обо мне».
- **Контакты:** раздел `#contacts` в `index.html`.
- **Путь стартапа:** список `.timeline`; статусы — `pill--done` (факт), `pill--sent` (подано), `pill--wip` (в процессе), `pill--goal` (цель).
- **Интересы:** массив `INTERESTS` в `script.js`.
