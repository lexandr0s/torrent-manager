# torrent_manager
mvp v. 0.0.5

1. Качаем NodeJS версию LTS: https://nodejs.org/ru/
2. Качаете [этот репозиторий](https://github.com/aliasxrus/torrent-manager) (Если нет гита то тыкаете сверху кнопку Code и выбираете Download zip, затем извлекаете и переходите в папку).
3. В торрент клиенте открываете настройки -> дополнительно -> веб интерфейс, указываете логин, пароль и порт. Удобнее всего редактировать через [Notepad++](https://notepad-plus-plus.org/downloads/)
4. Находите среди файлов config.js и открываете в любом текстовом редакторе, заполняете поля как в пункте выше.
5. Запускаем START.bat

Инструкция от @Sandra2Z https://telegra.ph/Kak-zapustit-skript-ot-Kharis-Shamsuarov-cherez-komandnuyu-stroku-04-25
    
Это просто демонстрация, нормальная версия будет чуть позже. Тут куча багов и ошибок!!!

Как заработать больше
-------------------------
Самый простой способ заработка это увеличить количество раздающих компьютеров.
При желании можно взять _**[VPS](https://zomro.com/vds.html?from=294244)**_ в аренду, проверенные виртуальные сервера можно арендовать на _**[ZOMRO](https://zomro.com/vds.html?from=294244)**_.
Рекомендую тариф _**VDS/VPS «MEGA»**_ c SSD до 100Gb с операционной системой Windows. Средний срок окупаемости до недели.

Как безопасно качать файлы
-------------------------
При скачивании файлов есть опасность потратить свои BTT, они будут потрачены на ускорение скачивания.
Для предотвращения этого можно скачивать торрент другим клиентом и в автоматическом режиме передавать их в μTorrent/BitTorrent.
1. Скачиваем и устанавливаем [QBittorrent](https://www.qbittorrent.org/download.php)
2. Переходим в настройки QBittorrent: Сервис -> Настройки... -> Загрузки
    - указываем _**Путь сохранения по умолчанию**_, это папка куда будут скачиваться торренты. 
    - указываем _**Копировать торрент-файлы завершенных загрузок в**_, сюда будут сохранены торрент файлы для передачи их в μTorrent/BitTorrent.
3. Переходим в настройки QBittorrent: Сервис -> Настройки... -> BitTorrent
   - В самом низу находим _**Ограничения раздачи**_
   - Ставим галку _**По достижению рейтинга раздачи**_ в значение: 0
   - В пункте _**затем**_ выбираем _**Остановить торрент**_
4. Заходим в μTorrent Настройки -> Настройки программы
   - указываем путь _**Помещать загружаемые файлы в**_ как у QBittorrent.
   - ставим галку у пункта _**Automatically load torrents from**_ и указываем путь куда QBittorrent сохраняет торрент файлы.
