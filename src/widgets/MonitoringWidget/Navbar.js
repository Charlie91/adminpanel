import React from 'react';
import {formatNumericDate} from './functions/functions';
import NavMessage from './views/navbar/NavMessage';
import ModalWindow from './ModalWindow.js';
import Loading from './../../views/Loading/Loading';

export default class Navbar extends React.Component {
    constructor(props) {
        super(props);
        this.state={
            modalIsOpen:false
        }
    };

    openTheWindow(){
        this.setState({modalIsOpen:true})
    }
    closeTheWindow(){
        this.setState({modalIsOpen:false})
    }

    showStatus(){     //функция рендера поля отображения статуса
        if(this.props.status === 'no-data'){
            return (
                <NavMessage>
                    <div className="update-split">
                        <i className="glyphicon glyphicon-refresh"></i>
                    </div>
                    <div className="update-text">Данных еще нет. Рекомендуется выполнить проверку.</div>
                </NavMessage>
            )
        }
        else if(this.props.status === 'in-checking'){
            return(
                <NavMessage>
                    <div className="update-split update-danger">
                        <i className="glyphicon glyphicon-warning-sign"></i>
                    </div>
                    <Loading/>
                    <div className="update-text">Выполняется проверка. Ожидайте или выполните вход позже.</div>
                </NavMessage>
            )
        }
        else if(this.props.status === 'ready'){
            return(
                <NavMessage>
                    <div className="update-split update-info">
                        <i className="glyphicon glyphicon-folder-open"></i>
                    </div>
                    <div className="update-text">
                        Показаны результаты проверки от <b>{ (this.props.date) ? formatNumericDate(this.props.date) : ''}</b>
                    </div>
                </NavMessage>
            )
        }
    };

    render() {
        return (
            <header className="col-lg-offset-1 col-xl-10 col-md-12 col-xs-12 header">
                <button onClick={this.props.checkFunction} className="btn btn-primary col-md-offset-0 col-md-3 col-xs-offset-4 col-xs-4">Получить данные</button>
                <button onClick={this.openTheWindow.bind(this)} className="btn btn-primary col-md-offset-1 col-md-2 col-xs-offset-4 col-xs-4">Добавить новый контакт</button>
                {this.showStatus()}
                <ModalWindow
                    title="Добавление нового контакта"
                    modalIsOpen={this.state.modalIsOpen}
                    setStatus={this.props.setStatus}
                    closeTheWindow={this.closeTheWindow.bind(this)}
                    checkFunction={this.props.checkFunction}
                />
            </header>
        );
    }

}
