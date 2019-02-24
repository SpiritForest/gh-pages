import React, { Component } from 'react';
import Header from './Header';
import Table from './Table';

export default class App extends Component {

    constructor(...args) {
        super(...args);

        this.handleSearch = this.handleSearch.bind(this);
    }

    state = {
        name: localStorage.getItem('name') || ''
    }

    handleSearch(value) { 
        localStorage.clear();
        localStorage.setItem('name',value);
        this.setState({name: value});
    }

    render() {
        const { name } = this.state;
        return (
        <div style={{padding: '0 20px'}}>
            <Header handleSearch={this.handleSearch}/>
            <Table mentorName={name}/>
        </div>
        )
        
    }
}