import React, { Component } from 'react';

class EmailInput extends Component {
    constructor(props){
        super(props);
        this.state = {
            value:null,
            focus:null,
            isValid:props.isValid
        }
    }

    setHint(){
        this.setState({focus:true});
    }

    hideHint(){
        this.setState({focus:false});
    }

    showHint(){  //функция рендера сообщения подсказки
        if(this.state.focus){
            return(
                <div className="hintMessage alert alert-info">a-z0-9 не более 16 символов</div>
            )
        }
    }

    showError(){            //функция рендера сообщения об ошибке
        if(this.state.isValid === false){
            return(
                <div className="hintMessage alert alert-danger">Адрес E-mail может быть не менее 3 символов,состоять только из латинских символов,@ или кириллицы</div>
            )
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({isValid:nextProps.isValid})
    }


    validateField(e){//функция-валидация
        let value = e.target.value;
        this.hideHint(); //прячем окно с подсказкой
        let regExp = new RegExp('^[a-zA-Zа-яА-Я0-9-_\.@]{3,30}$');
        if(!regExp.test(value)){   //проверка на соответствие регэкспу
            this.setState({isValid:false});
            this.props.fieldIsValid('email',false);
        }
        else{
            this.setState({isValid:true});
            this.props.fieldIsValid('email',value);
        }
    }

    setValue(e){
        this.setState({value:e.target.value})
    }


    render() {
        return (
            <div className="form-group">
                <label>
                    E-mail
                    <input onFocus={this.setHint.bind(this)}
                           onBlur={this.validateField.bind(this)}
                           onChange={this.setValue.bind(this)}
                           className="form-control" type="text"
                           placeholder="Адрес E-mail"
                    />
                    {this.showHint()}
                    {this.showError()}
                </label>
            </div>
        )
    }
}

export default EmailInput;