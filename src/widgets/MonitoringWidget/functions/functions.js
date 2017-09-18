
function formatNumericDate(dateNum){       //форматирование даты из миллисекунд в dd.mm.yy hh:mm
    let date = new Date(dateNum),
       [day,mm,yy,h,m] = [
          date.getDate(),
          date.getMonth() + 1,
          date.getFullYear() % 100,
          date.getHours(),
          date.getMinutes()
    ];
    if (day < 10) day = '0' + day;
    if (mm < 10) mm = '0' + mm;
    if (yy < 10) yy = '0' + yy;
    if(h < 10) h = '0' + h;
    if(m < 10) m = '0' + m;
    return day + '.' + mm + '.' + yy + ' ' + h + ':' + m;
}

function getCoords(elem) {                         //кроссбраузерная функция получения координат DOM-элемента
    let box = elem.getBoundingClientRect(),
        body = document.body,
        docEl = document.documentElement,
        scrollTop = window.pageYOffset || docEl.scrollTop || body.scrollTop,
        scrollLeft = window.pageXOffset || docEl.scrollLeft || body.scrollLeft,
        clientTop = docEl.clientTop || body.clientTop || 0,
        clientLeft = docEl.clientLeft || body.clientLeft || 0,
        top = box.top + scrollTop - clientTop,
        left = box.left + scrollLeft - clientLeft;

    return {
      top: top,
      left: left
    };
}

function sortNumeric(a,b,order){ //цифровая сортировка строк таблиц
    if (order === 'desc')
       return a - b;
    else
       return b - a;
 }

 function sortStrings(a,b,order){ //строчная сортировка строк таблиц
   if (order === 'desc')
     return a.localeCompare(b);
   else if (order === 'asc')
     return b.localeCompare(a);
 }

 export function updateServerCache(callback){ //запрос на принудительное обновление кэша к серверу
   console.log('start caching update');
   fetch('http://repo.re-ports.ru:8888/monitoring/AJAX?action=MonitoringApi&params=%7Baction:%22updatecache%22%7D',{mode: 'cors'})
       .then((response) => {
         if (!response.ok) {
               console.log('connection error');
               return Promise.reject(
                 console.log(new Error('Response failed: ' + response.status + ' (' + response.statusText + ')' ) )
               );
         }
         return response.json();
       })
       .then(data => {console.log('end caching update');callback()} ) //обновляем данные по завершению
       .catch(error => console.log('Error' + error));
 }

 export function addContactsArrayToDataResults(dataResults, contacts){ //функция добавления массива контактов в объект
   dataResults.forEach( (item,i) => {
     item.contactsData = [];
     let ids = item.contacts;//получаем и сохраняем массив ссылок на контакты
     if(ids.length){
       contacts.forEach( contactObj => {
          ids.forEach(id => {
            if(id === contactObj.id){
              contactObj.toString = function(){
                return `${contactObj.firstName} ${contactObj.phone}`;
              }
              dataResults[i].contactsData.push(contactObj);
            }
          })
       })
     }
   })
   return dataResults;
 }

 export function addContactsToDataResults(dataResults, contacts){ // функция добавления контактов, работающая с одним значением
   dataResults.forEach( (item,i) => {
     let contactsId = item.contacts[0];//получаем и сохраняем массив ссылок на контакты
     if(contactsId){
       contacts.forEach( item => {
          if(item.id === contactsId) dataResults[i].contactsData = item;
          item.toString = function(){
            return `${item.firstName} ${item.phone}`;
          }
       })
     }
   })
   return dataResults;
 }

export function formatAjaxDataResults(objects, contacts){
       if(objects){
         let actualArr = objects.filter((item,i) => {     //фильтруем массив по полю Actual,создаем новый массив с только актуальными данными
           return objects[i].actual
         });
         actualArr.forEach((item,i) => {
           [actualArr[i].message, actualArr[i].status] = [ [], [] ];      //создаем массивы для сохранения туда статусов и значений ошибок из remarks объекта
           actualArr[i].remarks.forEach( (item,n) => {  // перебор массива ошибок в объекте
                  item = formatAjaxDataMessages(item);
                  actualArr[i].status.push(item.status);
                  if(n > 0)
                      actualArr[i].message.push('<br/>' + item.message);//если объект не первый в массиве ставим перенос строки для красивого отображения в таблице
                  else
                      actualArr[i].message.push(item.message);
                  if( item.lastModified && (item.status === 1 || item.status === 2) ){
                    if(item.status === 2 && actualArr[i].lastModified) return;    //если дата уже записана, то некоторым объектам нельзя ее перезаписывать(для сортировки по датам)
                    actualArr[i].lastModified = item.lastModified;
                  }
            });

           actualArr[i].status.forEach( item => {
                  if(item !== 0 && item !== 3) actualArr[i].hasErrors = true; //определяем объекты с ошибками
           });
         });
        actualArr = addContactsArrayToDataResults(actualArr,contacts);     // добавляем контакты в исходный массив данных
        return actualArr
       }
 }

 export function formatAjaxDataMessages(obj){
   if(obj.status === 0){
     obj.message = '<span class="success">OK</span>';   //форматируем статус 'OK'
   }
   else if(obj.status === 1){
     obj.message = 'Файл устарел с ' + formatNumericDate(obj.lastModified) ; //форматируем статус ошибки с устаревшей датой. Вставляем в нее отформатированную дату
   }
   else if(obj.status === 2){
     obj.message = 'Данные устарели с ' + formatNumericDate(obj.lastModified) ; //форматируем статус ошибки с устаревшей датой. Вставляем в нее отформатированную дату
   }
   else if(obj.status === -2){
     obj.message = 'Нет доступа к тексту файла или неверная кодировка'; //форматируем статус ошибки с устаревшей датой. Вставляем в нее отформатированную дату
   }
   return obj;
 }

export {formatNumericDate, getCoords, sortNumeric, sortStrings}
