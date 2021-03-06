import React, { Component } from 'react';
import './style.scss';
class Authorization extends Component {
    constructor(props){
        super(props);
        this.state={
            isLoggedIn:null,
            login:'',
            password:''
        }
    }

    setLogin(e){
        this.setState({login:e.target.value})
    }

    setPassword(e){
        this.setState({password:e.target.value})
    }

    validation(){   //валидация полей
        if(!this.state.login || !this.state.password){
            this.setState({hasErrors:true});
            return false;
        }
        else{
            this.setState({hasErrors:false})
            return true;
        }
    }

    ajaxRequest(url,options){                   //функция-шаблон для ajax-запросов
        return  fetch(url, options)
            .then(function (response) {
                if (!response.ok) {
                    return Promise.reject(new Error(
                        'Response failed: ' + response.status + ' (' + response.statusText + ')'
                    ));
                }
                return response.json();
            })
    }

    getUserData(){  // парсинг данных пользователя после авторизации
        let options = {
            method:'GET',
            credentials:'include',
            mode: 'cors'
        };
        this.ajaxRequest('https://repo.re-ports.ru/api/',options)
            .then(data => {
                this.setState({
                    userName:data.login
                })
            })
            .catch(error => console.log(error));
    }


    checkEitherLoggedInOrNot(){ //проверка залогинен ли юзер
        let options = {
            method:'GET',
            credentials:'include',
            mode: 'cors'
        };
        this.ajaxRequest('https://repo.re-ports.ru/api/Auth',options)
            .then(data => {
                if(data.authorized === true){
                    this.setState({isLoggedIn:true});
                    this.getUserData();
                }

                else{
                    this.setState({isLoggedIn:false,password:''});
                }
            })
            .catch(error => console.log(error));
    }



    logIn(e) {      // запрос на вход\авторизацию пользователя
        e.preventDefault();
        if (this.validation()) {
            let obj = {
                pwd: this.state.password,
                login: this.state.login
            };
            let options = {
                method: 'POST',
                credentials: 'include',
                headers: {
                    "Content-type": "application/json;charset=UTF-8"
                },
                body: JSON.stringify(obj),
                mode: 'cors'
            };
            this.sendDataForLogInAndOut(options);
        }
    }

    logOff(e){  // запрос на выход пользователя\логаут
        e.preventDefault();
        let options = {
            method: 'DELETE',
            credentials: 'include',
            mode: 'cors'
        };
        this.sendDataForLogInAndOut(options);
    }

    sendDataForLogInAndOut(options){    //обработка ответов на запросы логина\логаута
        this.ajaxRequest('https://repo.re-ports.ru/api/Auth',options)
            .then(data => {
                if(data.error) {
                    if (data.error.message === 'Неверный логин или пароль') {
                        this.setState({loginIsIncorrect: true})
                    }
                }
                else{
                    this.setState({loginIsIncorrect: false,connectionIsFailed:false});
                }
                this.checkEitherLoggedInOrNot()
            })
            .catch(error => this.setState({connectionIsFailed:true}));
    }


    showError(){
        if(this.state.hasErrors)
            return(
                <div className="hintMessage alert alert-danger">Введите логин и пароль</div>
            )
        if(this.state.loginIsIncorrect)
            return(
                <div className="hintMessage alert alert-danger">Авторизационные данные неверны</div>
            )
        if(this.state.connectionIsFailed)
            return(
                <div className="hintMessage alert alert-danger">Соединение потеряно. Что-то пошло не так. Обратитесь в тех.поддержку или попробуйте еще раз</div>
            )
    }

    showForm(){     //функция рендера всей формы
        if(this.state.isLoggedIn)
            return(
                <div>
                    <h3>Здравствуйте,{this.state.userName}</h3>
                    <button
                        className="btn btn-primary"
                        onClick={this.logOff.bind(this)}
                    >
                        Разлогиниться
                    </button>
                </div>
            )
        else{
            return(
                <div>
                    <h1>Авторизация</h1>
                    <form action="#" method="POST">
                        <div className="form-group">
                            <input
                                onChange={this.setLogin.bind(this)}
                                style={ {marginBottom: '10px'} }
                                className="form-control"
                                value={this.state.login}
                                placeholder="Логин"
                            />
                            <input
                                type="password"
                                value={this.state.password}
                                onChange={this.setPassword.bind(this)}
                                className="form-control"
                                placeholder="Пароль"
                            />
                            {this.showError()}
                        </div>
                        <button
                            type="submit"
                            className="btn btn-primary"
                            onClick={this.logIn.bind(this)}
                        >
                            Отправить
                        </button>
                    </form>
                </div>
            )
        }
    }

    componentDidMount(){
        this.checkEitherLoggedInOrNot();//при заходе на стр сразу проверяем авторизован ли юзер
    }

    render() {
        return (
            <div className="auth-window animated fadeIn">
                {this.showForm()}
            </div>
        )
    }
}

export default Authorization;
