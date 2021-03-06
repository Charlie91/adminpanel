import React, { Component } from 'react';

class PhoneInput extends Component {
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
                <div className="hintMessage alert alert-danger">Номер телефона невалиден</div>
            )
        }
    }

    componentWillReceiveProps(nextProps){
        this.setState({isValid:nextProps.isValid})
    }


    validateField(e){//функция-валидация
        let value = e.target.value;
        this.hideHint(); //прячем окно с подсказкой
        let regExp = new RegExp('^((8|\\+7)[\\- ]?)?(\\(?\\d{3}\\)?[\\- ]?)?[\\d\\- ]{7,10}$');
        if(!regExp.test(value)){   //проверка на соответствие регэкспу
            this.setState({isValid:false});
            this.props.fieldIsValid('phone',false);
        }
        else{
            this.setState({isValid:true});
            this.props.fieldIsValid('phone',value);
        }
    }

    setValue(e){
        this.setState({value:e.target.value})
    }

    render() {
        return (
            <div className="form-group">
                <label>
                    Телефон:
                    <input onFocus={this.setHint.bind(this)}
                           onBlur={this.validateField.bind(this)}
                           onChange={this.setValue.bind(this)}
                           className="form-control"
                           type="text"
                           placeholder="Номер телефона"
                    />
                    {this.showHint()}
                    {this.showError()}
                </label>
            </div>
        )
    }
}

export default PhoneInput;