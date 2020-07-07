import React, { Component } from 'react';
import { withRouter, Link } from "react-router-dom";
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { Collapse } from "react-bootstrap";

import { performSearch } from "../actions/search.action";

import {
    PROFILE_PAGE_ENDPOINT,
    SEARCH_PAGE_ENDPOINT,
} from "../constants";

class SearchBar extends Component {

    constructor(props) {
        super(props);

        this.onChange = this.onChange.bind(this);
        this.onSubmit = this.onSubmit.bind(this);

        this.onFocus = this.onFocus.bind(this);
        this.onBlur = this.onBlur.bind(this);

        this.onSuggestionClick = this.onSuggestionClick.bind(this);

        this.search = this.search.bind(this);

        this.renderSuggestion = this.renderSuggestion.bind(this);
        this.renderSuggestionList = this.renderSuggestionList.bind(this);
        this.renderSearchSuggestions = this.renderSearchSuggestions.bind(this);

        this.timerSearch = null;

        this.state = {
            searchTerm: "",
            searchResults: [],
            focused: false
        }
    }

    componentWillReceiveProps(newProps) {
        if (newProps) {
            this.setState({ searchResults: newProps.search.result });
        }
    }

    onFocus() {
        this.setState({ focused: true });
    }

    onBlur() {
        this.setState({ focused: false });
    }

    onChange(e) {
        this.setState({ [e.target.id]: e.target.value });

        if (!this.timerSearch) {
            clearTimeout(this.timerSearch);
        }

        this.timerSearch = setTimeout(this.search, 1000);
    }

    onSubmit(e) {
        e.preventDefault();
    
        if (!this.timerSearch) {
            clearTimeout(this.timerSearch);
        }

        // this.search();
        if (this.state.searchTerm) {
            this.props.history.push(SEARCH_PAGE_ENDPOINT + this.state.searchTerm);
        }
    }

    onSuggestionClick(e) {
        this.setState({ searchTerm: "" });
    }

    search() {
        const query = {
            searchTerm: this.state.searchTerm,
        };

        if (JSON.stringify(query) === JSON.stringify(this.props.search.query)) {
            return;
        }

        try {
            this.props.performSearch(
                query,
                ((args) => {})
            );
        } catch (e) {
            console.log('Error occurred on search');
        }

        this.timerSearch = null;
    }

    renderSuggestion(obj, i) {
        return (
        <Link 
            to={ PROFILE_PAGE_ENDPOINT + obj._id }
            onClick={ this.onSuggestionClick }
            className="list-group-item text-body btn btn-outline-light" 
            style={{ 
                textAlign: "left", 
                width: "100%",
                whiteSpace: "nowrap",
                paddingTop: "0.5em",
                paddingBottom: "0.5em",
            }}
        >
            <h5 style={{ overflow: "hidden", textOverflow: "ellipsis", marginBottom: "0em" }}>
                <b>{obj.name}</b>
            </h5>

            <div style={{ overflow: "hidden", textOverflow: "ellipsis" }}>
                { (obj.bio.trim()) ?
                    <span>{obj.bio}</span> : 
                    <span><i>biography not available</i></span>
                }
            </div>
        </Link>
        );
    }

    renderSuggestionList() {
        const searchResults = (Array.isArray(this.state.searchResults)) ? this.state.searchResults : [];
        const suggestionList = [...searchResults].splice(0, 10);

        return (
        <>
        {
            suggestionList.map((object, i) =>
                this.renderSuggestion(object, i)
            )
        }
        </>
        );
    }

    renderSearchSuggestions() {
        const enabled = (this.state.searchTerm !== "") && (this.state.searchResults.length !== 0) && this.state.focused;

        return (
        <Collapse in={enabled}>
            <span 
                className="col-sm-4 list-group btn-group-vertical shadow"
                style={{
                    padding: "0em",
                    marginTop: "0.5em",
                    position: "absolute",
                    zIndex: "99",
                }}
            >
                { this.renderSuggestionList() }
            </span>
        </Collapse>
        );
    }

    render() {
        return (
        <form noValidate onSubmit={ this.onSubmit }>
            <div>
                <input 
                    className="form-control"
                    placeholder="Search"
                    onChange={ this.onChange }
                    onFocus={ this.onFocus }
                    onBlur={ this.onBlur }
                    value={ this.state.searchTerm }
                    id="searchTerm"
                    type="text"
                />
                { this.renderSearchSuggestions() }
            </div>
        </form>
        );
    }

}

SearchBar.propTypes = {
    performSearch: PropTypes.func.isRequired,
    search: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    search: state.search
});

const routerSearchBar = withRouter(SearchBar);

export default connect(
    mapStateToProps,
    { performSearch }
)(routerSearchBar);