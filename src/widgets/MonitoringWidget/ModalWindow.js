import React from 'react';
import Modal from 'react-modal';
import {updateServerCache} from './functions/functions.js';
import {API} from './API_CONFIG.js';

const customStyles = {
    content : {
        width                 : '30%',
        top                   : '50%',
        left                  : '50%',
        right                 : 'auto',
        bottom                : 'auto',
        marginRight           : '-50%',
        transform             : 'translate(-50%, -50%)'
    }
};

export default class ModalWindow extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            firstName:'',
            lastName:'',
            surname:'',
            job:'',
            objects:[],
            phone:'',
            email:'',
            validMessage:''
        }
    };

    updateValue(e){
        let elem = e.target;
        this.setState({[elem.name]:elem.value})
    }
    sendNewData(obj){
        console.log(obj);
        fetch(API.CONTACTS_URL, {
            method: 'POST',
            headers: {
                "Content-type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify(obj),
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
                console.log(data);
                this.props.closeTheWindow();
                this.props.setStatus('in-checking'); //ставим статус "В ожидании загрузки"
                this.props.checkFunction();
                //updateServerCache(this.props.checkFunction);// принудительное обновление кэша
                console.log('new')}
            )
            .catch(error => console.log(error));
    }

    sendEditData(obj){
        obj.id = this.state.id;
        console.log(obj);
        fetch(API.CONTACTS_URL, {//http://repo.re-ports.ru:8888/monitoring/AJAX?action=ContactsApi&
            method: 'POST',
            headers: {
                "Content-type": "application/json;charset=UTF-8"
            },
            body: JSON.stringify(obj),
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
            .then(data =>  {
                console.log(data);
                this.props.closeTheWindow();
                this.props.setStatus('in-checking'); //ставим статус "В ожидании загрузки"
                this.props.checkFunction();
                //updateServerCache(this.props.checkFunction);// принудительное обновление кэша
                console.log('edit')
            })
            .catch(error => console.log(error));
    }

    sendData(e){
        e.preventDefault();
        if(this.fieldsValidation()){
            let obj = {
                firstName:this.state.firstName,
                surname:this.state.surname,
                lastName:this.state.lastName,
                objects:this.state.objects,
                job:this.state.job,
                phone:this.state.phone,
                email:this.state.email
            };
            if(!this.state.id){
                this.sendNewData(obj)
            }
            else{
                this.sendEditData(obj)
            }
        }
        else{
            console.log('wrong')
        }
    }

    fieldsValidation(){ //валидация полей
        let message = [];
        if(!this.state.firstName)message.push('Введите Имя');
        if(!this.state.lastName)message.push('Введите Отчество');
        if(!this.state.surname)message.push('Введите Фамилию');
        if(!this.state.job)message.push('Введите Должность');
        if(!this.state.phone)message.push('Введите Телефон');
        if(!this.state.email)message.push('Введите E-mail');

        if(message.length){
            this.setState({validMessage:message});
            return false;
        }
        else{
            this.setState({validMessage:''});
            return true;
        }
    }

    showMessage(){ // показ сообщений валидации
        if(this.state.validMessage){
            console.log(this.state.validMessage);
            let newArr = this.state.validMessage.map(
                (item,i) => {
                    return(
                        <div className='validation_error' key={i}>{item}</div>
                    )
                }
            );
            return newArr;
        }
    }

    componentWillReceiveProps(props){
        if(props.obj){
            let obj = props.obj;
            this.setState({
                firstName:obj.firstName,
                lastName:obj.lastName,
                surname:obj.surname,
                objects:obj.objects,
                job:obj.job,
                id:obj.id,
                phone:obj.phone,
                email:obj.email
            });
        }
    }

    render() {
        return (
            <Modal
                isOpen={this.props.modalIsOpen}
                contentLabel="Modal"
                style={customStyles}
            >
                <button onClick={this.props.closeTheWindow} className="close-button btn">X</button>
                <h3 className="modal-title">{this.props.title}</h3>
                <div className="form-group">
                    <form>
                        <label>
                            Фамилия
                            <input
                                className="form-control"
                                type="text"
                                name="surname"
                                value={this.state.surname}
                                onChange = {this.updateValue.bind(this)}
                            />
                        </label>
                        <label>
                            Имя
                            <input
                                className="form-control"
                                type="text"
                                name="firstName"
                                value={this.state.firstName}
                                onChange = {this.updateValue.bind(this)}
                            />
                        </label>
                        <label>
                            Отчество
                            <input
                                className="form-control"
                                type="text"
                                name="lastName"
                                value={this.state.lastName}
                                onChange = {this.updateValue.bind(this)}
                            />
                        </label>
                        <label>
                            Должность
                            <input
                                className="form-control"
                                type="text"
                                name="job"
                                value={this.state.job}
                                onChange = {this.updateValue.bind(this)}
                            />
                        </label>
                        <label>
                            Телефон
                            <input
                                className="form-control"
                                type="text"
                                name="phone"
                                value={this.state.phone}
                                onChange = {this.updateValue.bind(this)}
                            />
                        </label>
                        <label>
                            E-mail
                            <input
                                className="form-control"
                                type="text"
                                name="email"
                                value={this.state.email}
                                onChange = {this.updateValue.bind(this)}
                            />
                        </label>
                        <label>
                            <button onClick={this.sendData.bind(this)} type="submit" className="btn btn-primary">
                                Отправить
                            </button>
                        </label>
                        {this.showMessage()}
                    </form>
                </div>
            </Modal>
        );
    }

}
