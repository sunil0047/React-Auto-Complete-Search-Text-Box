import React, { Component } from 'react';

import  './App.css';
import { languageList } from './LanguageList';
import AutoComplete from "./component/AutoComplete";

class App extends Component {

    render() {
        const suggestionData = [];

        for (let languageCode in languageList) {
            if (languageList[languageCode]) {
                suggestionData.push(languageList[languageCode].name)
            }
        }


        return (
            <div className="container">
                <AutoComplete data={suggestionData} minChars={5} />
            </div>

        );
    }

}

export default App;

