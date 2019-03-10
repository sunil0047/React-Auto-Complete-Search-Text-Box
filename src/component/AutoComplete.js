import React, { Component } from 'react';
import PropTypes from 'prop-types';
import './AutoComplete.css';

class AutoComplete extends Component {

    constructor() {
        super();
        this.state = {
            suggestions: [],
            text: '',
            isSuggestionHidden: true,
            selectedItemIndex: -1
        }
    }
    items = [
        'aa',
        'aaa',
        'aaa',
        'aaa',
        'aaaaaaaaaaaa'
    ];

    container = React.createRef();

    componentWillMount() {
        this.items = this.props.data;
    }

    countDownSelectedIndex = () => {
        this.setState( (currentState) => ( { selectedItemIndex :currentState.selectedItemIndex + 1 }))

    }

    countUpSelectedIndex = () =>{
        this.setState((currentState) => ({ selectedItemIndex :currentState.selectedItemIndex - 1 }))
    }

    scrollToView = (index) => {
        const container = this.container.current;
        const ul = container.querySelector('ul');
        const li = ul.querySelector('li');
        const liHeight = li.offsetHeight;
        const scrollTop = ul.scrollTop;
        const viewport = scrollTop + ul.offsetHeight;
        const scrollOffset = liHeight * index;
        console.log(scrollOffset);
        if (scrollOffset < scrollTop || (scrollOffset + liHeight) > viewport) {
            ul.scrollTop = scrollOffset;
        }
    }

    inputElKeyHandler = (evt) => {
        const value = evt.target.value;
        //console.log(value)
        if(value.length === 0){
            this.setState({
                suggestions: [],
                text: value
            })
        } else {
            const suggestions = this.suggestionFilter(value);
            this.setState({
                suggestions,
                text: value
            })
        }

        const suggestionLength = this.state.suggestions.length;
        const { selectedItemIndex } = this.state;

        switch (evt.keyCode){
            case 27: //ESC
            this.setState({suggestions:[]});
            break;

            case 38: //UP
            if(selectedItemIndex  > 0){
                this.countDownSelectedIndex();
                this.scrollToView(this.state.selectedItemIndex - 1 )
            }
            break;

            case 40: //DOWN
            if(selectedItemIndex + 1 < suggestionLength ){
                this.countUpSelectedIndex();
                this.scrollToView(this.state.selectedItemIndex + 1);
            }
            break;

            default:
        }
    }

    renderSuggestions = () =>{
        const { suggestions } = this.state;
        if (suggestions.length === 0) {
            return null;
        }

        return (
            <ul className={'auto-complete-data-container list-group'}>
                {suggestions.map((item, i) => (
                    <li
                        key={i}
                        className={this.liDynamicClass(i)}
                        onClick={() => {
                            this.suggestionSelected(item)
                        }}>{item}</li>
                ))}
            </ul>
        )
    };



    liDynamicClass = (i) => {
        return this.state.selectedItemIndex === i ? 'active-grey list-group-item': 'list-group-item';

    }


    suggestionSelected = (value) => {
        this.setState(() => (
            {
                text: value,
                suggestions: []
            }
        ))
    };


    onTextChanged = (e) =>{
        console.log(e.target.value.length)
        if(this.props.minChars >= e.target.value.length){
            const value = e.target.value;
            if(value.length === 0){
                this.setState({
                    suggestions: [],
                    text: value
                });
            } else {
                const suggestions =this.suggestionFilter(value);
                this.setState({
                    suggestions,
                    text: value
                })
            }
        }

    }

    suggestionFilter = (value) =>{

        const regex= new RegExp(value, 'ig');
        return this.items.sort().filter(v => regex.test(v))

    }


    render() {
        return (
            <div ref={this.container} className={'form-group auto-complete-container'} style={{ width: '300px' }}>
                <input
                    className={'form-control'}
                    value={this.state.text}
                    onKeyDown={this.inputElKeyHandler}
                    onChange={this.onTextChanged}
                    placeholder="Select an Language"
                    type="text" />
                {this.renderSuggestions()}
            </div >
        );
    }
}

AutoComplete.propTypes = {
    minChars: PropTypes.number,
    data: PropTypes.array.isRequired,
  };

  AutoComplete.defaultProps = {
    minChars: 0
};

export default AutoComplete;;