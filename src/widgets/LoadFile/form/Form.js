import React, { Component } from 'react';
import IdField from './ID-input.js';
import SubdField from './SUBD-input.js';
import SoftField from './soft-input.js';


class Form extends Component {
  constructor(props) {
    super(props);
    this.state = {
      idField:'',
      subdField:'PostgreSQL',
      softField:'Retail soft 1',
      fileIsReady:false,
      progressBar:0
    };
    this.checkReadyStatus = this.checkReadyStatus.bind(this);//закрепляем контекст, чтобы функция не теряла его когда вызывалась callback'ом
  };

  preValidation(field,value){
    this.setState({ [field]: value} );  //сохранение всех значений дочерних компонентов в state
  };

   // Вспомогательные функции
  setSubmitAble(boolean){
    this.sybmitInput.disabled = boolean;
    return this;//во всех вспомогательных функциях возвращаем контекст для чейнинга
  };

  dropTheLoader(){                      //сброс прогрессбара
    this.setState({progressBar:0});
    return this;
  };

  increaseTheLoader(){                  //увеличить прогрессбар
    this.setState({progressBar:this.state.progressBar + 3});
    return this;
  }

  finishTheDownload(){                  //загрузка прошла успешно
    this.setState({fileIsReady:true,progressBar:100});
    return this;
  }
  setFailedLoad(){                      // ошибка на сервере
    this.setState({loadFailed:true});
    return this;
  }

  hidePreviousErrorMessage(){           //сброс сообщения об ошибке
    this.setState({loadFailed:false});
    return this;
  };


  //AJAX запросы
  checkReadyStatus(data){
    var self = this;           //сохраняем контекст

    self.setSubmitAble(true)        //вызов вспомогательных функций чейнингом
        .dropTheLoader()
        .hidePreviousErrorMessage();

    var timerId = setInterval(function() {
      fetch('http://192.168.0.62:8080/bot-wizard/AJAX?action=Threads&objId=obj_9955',{mode: 'cors'})
              .then(function(response) {
                if (!response.ok) {
                      clearInterval(timerId);
                      return Promise.reject(
                        new Error('Response failed: ' + response.status + ' (' + response.statusText + ')' )
                      );
                }
                return response.json();
              })
              .then(function(data) {
                console.log(data);
                if(data.state === 'ARCHETYPE')
                    self.increaseTheLoader();
                if(data.state === 'INSTALL')
                    self.increaseTheLoader();
                if(data.state === 'READY'){
                    clearInterval(timerId);
                    self.finishTheDownload()
                        .setSubmitAble(false);
                };
                if(data.state === 'FAILED'){
                    clearInterval(timerId);
                    self.setFailedLoad()
                        .dropTheLoader()
                        .setSubmitAble(false);
                }
              })
              .catch(function(error) {
                clearInterval(timerId);
                console.log('Error' + error);
              });
    }, 1000);
  };

  ajaxProcess(e){
    e.preventDefault();
      let dataObj = {
          objId:'obj_9955',
          modelArtifactId:'Postgres'
      };

      fetch('http://192.168.0.62:8080/bot-wizard/AJAX?action=ExecMaven', {
        method: 'POST',
        headers: {
            "Content-type": "application/x-www-form-urlencoded; charset=UTF-8"
        },
        body: 'params='+JSON.stringify(dataObj),
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
      .then(data => this.checkReadyStatus())
      .catch(error => console.log(error));
  };

  //Функции рендера
  showLink(){
    if(this.state.fileIsReady)
      return(
        <a className="download-link col-md-12" href="http://192.168.0.62:8080/bot-wizard/AJAX?action=Download&objId=obj_9953"> Скачать архив </a>
      );
      return null
  };

  showProgressBar(){
    if(this.state.progressBar)
      return(
        <div className="loader_wrapper col-md-12">
          <p style={{width: + (this.state.progressBar) + '%'}} className="progress-bar col-md-12"></p>
          <span id="loader-indicator">{this.state.progressBar + '%'}</span>
        </div>
      );
      return null;
  }

  showError(){
    if(this.state.loadFailed)
      return(
        <div className="error alert-danger form-control col-md-2"> Объект уже сформирован </div>
      );
      return null;
  }

  render() {
    return (
      <form id="form" className="loadfile col-md-offset-4 col-md-4">
        <IdField isValid={this.preValidation.bind(this)} />
        <SubdField isValid={this.preValidation.bind(this)} />
        <SoftField isValid={this.preValidation.bind(this)} />
        <input onClick={this.ajaxProcess.bind(this)} className="form-control" disabled={!this.state.idField} value="Сформировать" ref={(input) => {this.sybmitInput = input;}} type="submit" />

          {this.showProgressBar()}

        {this.showError()}
        <div className="row">{this.showLink()}</div>
      </form>
    );
  }
}

export default Form;
