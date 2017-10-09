import React, { Component } from 'react';
import './../../../node_modules/react-bootstrap-table/dist/react-bootstrap-table-all.min.css';
import Table from './Table.js';

class App extends Component {
    constructor(props) {
        super(props);
    };


    render() {
        return (
            <div className="container-fluid App">
                <Table/>
            </div>
        );
    }
}

export default App;