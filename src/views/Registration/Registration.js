import React, { Component } from 'react';
import LoginInput from './inputs/LoginInput.js';
import PasswordInput from './inputs/PasswordInput.js';
import NameInput from './inputs/NameInput.js';
import SurnameInput from './inputs/SurnameInput.js';
import PhoneInput from './inputs/PhoneInput.js';
import EmailInput from './inputs/EmailInput.js';
import PositionInput from './inputs/PositionInput.js';
import './registration.scss';




class Registration extends Component {
    constructor(props){
        super(props);
        this.state = {    //состояние null у состояний значит что это поле еще не изменялось, т.е. начальное состояние
            login:null,     //false - то, что поле невалидное
            password:null,  // любое трушное значение - что все ок
            passwordsAreConfirm:null,
            name:null,
            surname:null,
            position:null,
            email:null,
            phone:null
        }
    }

    fieldIsValid(field,boolean){
        this.setState({[field]:boolean})
    }

    finalValidation(e){
        e.preventDefault();
        if(this.state.login === null){      //если поле не изменялось пользователем - переводим его в false
            this.setState({login:false})
        }
        if(this.state.password === null){
            this.setState({password:false})
        }
        if(this.state.passwordsAreConfirm === null){
            this.setState({passwordsAreConfirm:false})
        }
        if(this.state.name === null){
            this.setState({name:false})
        }
        if(this.state.surname === null){
            this.setState({surname:false})
        }
        if(this.state.position === null){
            this.setState({position:false})
        }
        if(this.state.email === null){
            this.setState({email:false})
        }
        if(this.state.phone === null){
            this.setState({phone:false})
        }


        for( let key in this.state){
            if(!this.state[key]) {
                console.log('error');
                return;
            }
        }
        console.log('success')
    }

    render() {
        return (
            <div className="registration-form animated fadeIn">
                <h1>Регистрация</h1>
                <form action="#" method="POST">
                    <LoginInput  isValid={this.state.login} fieldIsValid={this.fieldIsValid.bind(this)}/>
                    <PasswordInput isValid={this.state.password} isConfirm={this.state.passwordsAreConfirm} fieldIsValid={this.fieldIsValid.bind(this)}/>
                    <NameInput  isValid={this.state.name} fieldIsValid={this.fieldIsValid.bind(this)}/>
                    <SurnameInput  isValid={this.state.surname} fieldIsValid={this.fieldIsValid.bind(this)}/>
                    <PositionInput  isValid={this.state.position} fieldIsValid={this.fieldIsValid.bind(this)}/>
                    <EmailInput  isValid={this.state.email} fieldIsValid={this.fieldIsValid.bind(this)}/>
                    <PhoneInput  isValid={this.state.phone} fieldIsValid={this.fieldIsValid.bind(this)}/>
                    <button
                        onClick={this.finalValidation.bind(this)}
                        type="submit"
                        className="btn btn-primary"
                    >
                        Отправить
                    </button>
                </form>
            </div>
        )
    }
}

export default Registration;