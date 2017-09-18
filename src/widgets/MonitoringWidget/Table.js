import React from 'react';
import { BootstrapTable, TableHeaderColumn } from 'react-bootstrap-table';
import ModalWindow from './ModalWindow.js';
import {getCoords, sortNumeric, sortStrings, updateServerCache} from './functions/functions.js';
import Select from 'react-select';
import 'react-select/dist/react-select.css';


export default class Table extends React.Component {
  constructor(props) {
      super(props);
      this.selectOptions = []; //массив для хранения значений селекта
      this.state = {
        modalIsOpen:false,
        objectForEditing:null
      }
  };

  renderShowsTotal(start, to, total) { // показ общего количества строк
    return (
      <p style={ { color: "#337ab7" } }>
        От { start } до { to }, всего - { total }&nbsp;&nbsp;
      </p>
    );
  }

  // createObjectsforSelectOptions(contactsArr, newArr){ //создание объектов для заполнения массива значений селекта
  //     if(contactsArr && !this.selectOptions.length){ //если передаваемые контакты не пустые,и не записаны
  //       //this.selectOptions = [];
  //         contactsArr.forEach( contactObj => {
  //           let newObj = {};
  //           newObj.value = contactObj.id; // value - обязательное уникальное значение для селекта
  //           newObj.label = `${contactObj.firstName} ${contactObj.surname} ${contactObj.phone}`;  //строчное представление объекта
  //
  //           [newObj.lastName,newObj.surname, newObj.email,newObj.job, newObj.firstName, newObj.phone, newObj.objects] //присвоение свойств
  //                             =
  //           [contactObj.lastName, contactObj.surname,contactObj.email,contactObj.job, contactObj.firstName, contactObj.phone, contactObj.objects];
  //           newArr.push(newObj);
  //         });
  //         return newArr;
  //     }
  // }
  createObjectsforSelectOptions(contactsArr){ //создание объектов для заполнения массива значений селекта
    let newArr = [];
      if(contactsArr){ //если передаваемые контакты не пустые,и не записаны
          contactsArr.forEach( contactObj => {
            let newObj = {};
            newObj.value = contactObj.id; // value - обязательное уникальное значение для селекта
            newObj.label = `${contactObj.firstName} ${contactObj.surname} ${contactObj.phone}`;  //строчное представление объекта

            [newObj.lastName,newObj.surname, newObj.email,newObj.job, newObj.firstName, newObj.phone, newObj.objects] //присвоение свойств
                              =
            [contactObj.lastName, contactObj.surname,contactObj.email,contactObj.job, contactObj.firstName, contactObj.phone, contactObj.objects];
            newArr.push(newObj);
          });
          return newArr;
      }
  }

  enumFormatter(cell, row, enumObject) { //форматирование ячееек колонки "Валидность"
    return cell;
  }

  trClassFormat(rowData, rIndex) {
    if(rowData.hasErrors){    // если объект с данными имеет ошибки, добавляем css-класс row-with-error
      return 'row-with-error'
    }
    return rIndex % 2 === 0 ? 'tr-grey' : '';//каждая вторая строка таблицы получает css-класс tr-grey
  }

  sortFunc(a, b, order) {                   //сортирующая функция для ошибок
    if(a.lastModified && b.lastModified){                           //для сравнения дат проверяем на наличие свойства с датами
      return sortNumeric(a.lastModified,b.lastModified,order)
    }
    else{
      let [aString, bString] = [ a.message.join(' ') , b.message.join(' ') ];     // создаем 2 строковых переменных-значения из массива ошибок для сравнения строк
      return sortStrings(aString, bString, order)
    }
  }

  deleteContact(e){ //функция отвязки контакта от объекта
    e.stopPropagation();
    let [contact, objId] = [+e.target.dataset.contact, +e.target.dataset.obj];
    let contactObj;
    this.props.contactsArr.forEach( item => {
      if(item.id === contact) {
        contactObj = item;
        let index;
        if( ~(index = contactObj.objects.indexOf( objId )) )
            contactObj.objects.splice(index,1);
      }
    });
    this.editContactsApi(contactObj); //отправка запроса на сервер с новым контактом
  }

  editContactsApi(obj){   //функция редактирования контактов(привязки/отвязки объектов)
    fetch('http://repo.re-ports.ru:8888/monitoring/AJAX?action=ContactsApi&', {
        method: 'POST',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: `params=%7Bmethod:%22edit%22,entity:${JSON.stringify(obj)}%7D`,
        mode: 'cors'
    })
    .then(function(response) {
        if (!response.ok) {
            return Promise.reject(new Error(
              'Response failed: ' + response.status + ' (' + response.statusText + ')'
            ));
        }
        return response.json();
    })
    .then(data => {
      this.props.setStatus('in-checking'); //ставим статус "В ожидании загрузки"
      updateServerCache(this.props.checkFunction);// принудительное обновление кэша
      console.log(data)}
    )
    .catch(error => console.log(error));
  }

  openTheWindow(){
    this.setState({modalIsOpen:true})
  }

  closeTheWindow(){
    this.setState({modalIsOpen:false})
  }

  editTheContact(e){
    let elem = e.target;
    let obj;
    this.props.contactsArr.forEach( contact => {
      if(contact.id === +elem.dataset.contact)
          obj = contact
    });
    this.setState({objectForEditing:obj})
    this.openTheWindow();
  }

  contactFormatter(cell, row, enumObject){//функция форматирования ячейки контактов
      if(cell.length === 1)cell = cell[0];
      if(cell.length === 0){
        return(
          <Select
              style={{float:'left',width:'100%'}}
              name="form-field-name"
              placeholder={'Привязать новый контакт'}
              options={this.selectOptions}
              onChange={this.onChangeSelect(row.id)}
          />
        )
      }
      return (
            (cell.length > 1) ?
            <div>
                {cell.map( (item,i) =>
                  <span
                    data-contact={item.id}
                    className="contactItem btn-primary"
                    onClick={this.editTheContact.bind(this)}
                    key={i}
                  >
                      <button
                          data-contact={item.id}
                          className="unbound_contact_button"
                          data-obj={row.id}
                          onClick={this.deleteContact.bind(this)}>
                          X
                      </button>
                      {String(item)}
                  </span>
                ) }
                <Select
                    style={{float:'left',width:'100%'}}
                    name="form-field-name"
                    placeholder={'Привязать новый контакт'}
                    options={this.selectOptions}
                    onChange={this.onChangeSelect(row.id)}
                />
            </div>
                  :
            <div>
                <span
                  className="contactItem btn-primary"
                  onClick={this.editTheContact.bind(this)}
                  data-contact={cell.id}
                >
                    <button
                        data-contact={cell.id}
                        className="unbound_contact_button"
                        data-obj={row.id}
                        onClick={this.deleteContact.bind(this)}>
                        X
                    </button>
                    {String(cell)}
                </span>
                <Select
                    style={{float:'left',width:'100%'}}
                    name="form-field-name"
                    placeholder={'Привязать новый контакт'}
                    options={this.selectOptions}
                    onChange={this.onChangeSelect(row.id)}
                />
            </div>
      )
  }

  onChangeSelect(id)  {//обходной маневр против ограничений библиотеки,не стоит пытаться этого понять
    const _onChange = (val) => {
        this.toBoundObjectToContact(id,val);//вызов AJAX функции
    }
    return _onChange; // you can also do return _onChange.bind(this) if you need the scope.
  }

  toBoundObjectToContact(objectID, contact){ //привязка контакта к объекту
    contact.objects.push(objectID);
    contact.id = contact.value;
    delete contact.value;
    this.editContactsApi(contact);
  }

  componentDidMount(){
      // let th = document.getElementsByClassName('table-header-wrapper')[0],
      //     tbody = document.getElementsByClassName('react-bs-container-body')[0];
      // window.onscroll = function(e){                    // определяем по событию положение скролла на странице и делаем шапку fixed
      //    let scrollTop = window.pageYOffset || document.documentElement.scrollTop;
      //    if(scrollTop > getCoords(tbody).top){
      //      th.classList.add('navbar-fixed-top','container-fluid');
      //    }
      //    else{
      //      th.classList.remove('navbar-fixed-top','container-fluid');
      //      tbody.style.cssText = 'top:0px;position:static';
      //    }
      // }
  }

  componentWillReceiveProps(){
    this.selectOptions = this.createObjectsforSelectOptions(this.props.contactsArr);//при получении контактов от сервера - заполняем данные для селекта
  }

  // componentDidUpdate(){
  //     this.createObjectsforSelectOptions(this.props.contactsArr, this.selectOptions);//при получении контактов от сервера - заполняем данные для селекта
  // }

  render() {
    const qualityType = {//конструкция для фильтрации поля "Ошибки"
      'OK': 'OK',
      'XML не соответствует соглашениям о формате': 'XML не соответствует соглашениям о формате',
      'Отсутствует файл': 'Отсутствует файл',
      'XML не содержит данных по этому объекту':'XML не содержит данных по этому объекту',
      'Файл устарел':'Файл устарел',
      'Неверный формат даты в XML':'Неверный формат даты в XML',
      'Нет доступа к тексту файла':'Нет доступа к тексту файла',
      'Не является XML':'Не является XML',
      'Данные устарели': 'Данные устарели'
    };

    const options = { //опции пагинации
         page: 1,  // which page you want to show as default
         sizePerPageList: [ {
           text: '15', value: 15
         }, {
           text: '50', value: 50
         },{
           text: 'Все', value: (this.props.dataArr) ? this.props.dataArr.length : ''
         } ], // you can change the dropdown list for size per page
         sizePerPage: 15,  // which size per page you want to locate as default
         pageStartIndex: 1, // where to start counting the pages
         paginationSize: 3,  // the pagination bar size.
         prePage: 'Предыдущая', // Previous page button text
         nextPage: 'Следующая', // Next page button text
         firstPage: 'Первая', // First page button text
         lastPage: 'Последняя', // Last page button text
         prePageTitle: 'Предыдущая страница', // Previous page button title
         nextPageTitle: 'Следующая страница', // Next page button title
         firstPageTitle: 'Перейти к первой странице', // First page button title
         lastPageTitle: 'Перейти к последней странице', // Last page button title
         paginationShowsTotal: this.renderShowsTotal,//this.renderShowsTotal,  // Accept bool or function
         paginationPosition: 'bottom',  // default is bottom, top and both is all available
         keepSizePerPageState: false, //default is false, enable will keep sizePerPage dropdown state(open/clode) when external rerender happened
         hideSizePerPage: false, //> You can hide the dropdown for sizePerPage
         // alwaysShowAllBtns: true // Always show next and previous button
         withFirstAndLast: true,// > Hide the going to First and Last page button
         hidePageListOnlyOnePage: true // Hide the page list if only one page.
   };

    return (
      <div>
      <BootstrapTable
                      className="Table col-md-offset-1 col-md-10 col-lg-offset-1 col-lg-10 col-xs-12"
                      data={ this.props.dataArr }
                      trClassName={ this.trClassFormat }
                      pagination={ true }
                      options = {options}
      >

        <TableHeaderColumn
                           width='150'
                           dataField='objName'
                           tdStyle={ { whiteSpace: 'normal' } }
                           isKey={ true }
                           filter={{ type: 'TextFilter', delay: 1000 }}
                           dataSort={ true }>
                           Название
        </TableHeaderColumn>

        <TableHeaderColumn
                           dataField='concept'
                           tdStyle={ { whiteSpace: 'normal' } }
                           filter={{ type: 'TextFilter', delay: 1000 }}
                           editable={false}
                           dataSort={ true }>
                           Концепция
        </TableHeaderColumn>

        <TableHeaderColumn
                           dataField='cityName'
                           filter={{ type: 'TextFilter', delay: 1000 }}
                           editable={false}
                           dataSort={ true }>
                           Город
        </TableHeaderColumn>

        <TableHeaderColumn
                           dataField='xmlName'
                           filter={{ type: 'TextFilter', delay: 1000 }}
                           editable={false}
                           dataSort={ true }>
                           ID
        </TableHeaderColumn>

        <TableHeaderColumn
                           width='350'
                           tdStyle={ { whiteSpace: 'normal' } }
                           dataField={'message'}
                           filterFormatted
                           dataSort={ true }
                           editable={false}
                           sortFunc={ this.sortFunc }
                           dataFormat={ this.enumFormatter }
                           formatExtraData={ qualityType }
                           filter={ { type: 'SelectFilter', options: qualityType } }
                           >
                           Валидность
        </TableHeaderColumn>

        <TableHeaderColumn
                           width='250'
                           tdStyle={ { whiteSpace: 'normal' } }
                           columnClassName={ 'contacts_column' }
                           dataField={'contactsData'}
                           editable={false}
                           dataFormat={ this.contactFormatter.bind(this) }
                           filter={{ type: 'TextFilter', delay: 1000 }}>
                           Контакты
        </TableHeaderColumn>
      </BootstrapTable>
      <ModalWindow
        setStatus={this.props.setStatus}
        title="Редактирование контакта"
        modalIsOpen={this.state.modalIsOpen}
        checkFunction={this.props.checkFunction}
        obj={this.state.objectForEditing}
        closeTheWindow={this.closeTheWindow.bind(this)}/>
    </div>
    );
  }
}
