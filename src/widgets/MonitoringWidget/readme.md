http://repo.re-ports.ru:8080/ContactsApi GET - JSON массив со всеми контактами
[ 
{ 
id: 6, 
firstName: "Алексей", 
lastName: "Михайлович", 
surname: "Корягин", 
gender: 1, 
job: "Разработчик админки 1", 
phone: "пишите на почту", 
email: "seventref@gmail.com", 
im: "--", 
objects: (0)[ 
] 
}, 
{ 
id: 7, 
firstName: "Кирилл", 
lastName: "Николаевич", 
surname: "Еропкин", 
gender: 1, 
job: "CEO", 
phone: "89636902257", 
email: "krill221@gmail.com", 
im: "-", 
objects: (0)[ 
] 
}, 
{ 
id: 8, 
firstName: "Степан", 
lastName: "Юрьевич", 
surname: "Мельничук", 
gender: 1, 
job: "Java программист", 
phone: "-", 
email: "stepan.melnichuk@gmail.com", 
im: "Мониторинг объектов", 
objects: (0)[ 
] 
}]
http://repo.re-ports.ru:8080/ContactsApi POST
{
id: // отсутствует или -1 для создания нового
firstName: 'Имя',
lastName: 'Отчество',
surname: 'Фамилия',
job: 'Ассенизатор',
phone: '13-666-13',
email: 'no_such@mail.ru',
objects: [1, 2, 5, 13, 666]
}