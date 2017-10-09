import React, { Component } from 'react';
import './scss/App.scss';
import Table from './Table.js';
import Navbar from './Navbar.js';
//import './../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import {API} from './API_CONFIG.js';
import {formatAjaxDataResults} from './functions/functions.js';


class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            data:null,
            contactsArr:null,
            lastSuccessCall:null,
            loadingInProcess:false,
            status : 'ready'
        };
    };

    setStatus(value){ //установка статуса готовности данных
        this.setState({status:value});
        return this;
    }
    setLastCheckDate(time){
        this.setState({lastSuccessCall:time});//установка даты последней проверки в state
        return this;
    }

    getContacts(){
        fetch( API.CONTACTS_URL ,{mode: 'cors'})//  http://repo.re-ports.ru:8888/monitoring/AJAX?action=ContactsApi&params=%7Bmethod:%22get%22%7D
            .then((response) => {
                if (!response.ok) {
                    console.log('connection error');
                    return Promise.reject(
                        console.log(new Error('Response failed: ' + response.status + ' (' + response.statusText + ')' ) )
                    );
                }
                return response.json();
            })
            .then(contacts => {
                console.log(contacts);
                this.setState({contactsArr:contacts});
                this.getTheAjaxData();              //если контакты получены - получаем оставшиеся данные
            })
            .catch(error => {
                console.log('Error' + error);
            });
    }


    getTheAjaxData(){          //получаем по AJAX данные для таблицы
        fetch(API.MONITORING_URL,{mode: 'cors'}) //      http://repo.re-ports.ru:8888/monitoring/AJAX?action=MonitoringApi&params=%7B%7D
            .then((response) => {
                if (!response.ok) {
                    console.log('connection error');
                    return Promise.reject(
                        console.log(new Error('Response failed: ' + response.status + ' (' + response.statusText + ')' ) )
                    );
                }
                this.setStatus('in-checking');
                return response.json();
            })
            .then(data => {
                console.log(data);
                let objects = formatAjaxDataResults(data.objects, this.state.contactsArr); // форматируем и изменяем входящий массив объектов данных для удобной работы с ним
                console.log('измененный',objects);
                this.setStatus('ready')
                    .setLastCheckDate(data.invokeTime)
                    .setState({data:objects});                     //сохраняем массив данных в state
            })
            .catch(error => {
                this.setStatus('ready');
                console.log('Error' + error);
            });
    }

    componentDidMount(){
        this.getContacts();   //первым запросом получаем список контактов
    }

    render() {
        return (
            <div className="App">
                <Navbar
                    status={this.state.status}
                    setStatus={this.setStatus.bind(this)}
                    date={this.state.lastSuccessCall}
                    checkFunction={this.getContacts.bind(this)}
                />
                <Table
                    setStatus={this.setStatus.bind(this)}
                    dataArr = {this.state.data}
                    contactsArr = {this.state.contactsArr}
                    updateData={this.getContacts.bind(this)}
                    checkFunction={this.getContacts.bind(this)}
                />

            </div>
        );
    }
}

export default App;
