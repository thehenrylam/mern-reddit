import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { performSearch } from '../actions/search.action';

import ResultList from './resultList.component';

class SearchResult extends Component {

    constructor(props) {
        super(props);

        this.search = this.search.bind(this);

        this.state = {
            searchResults: []
        };
    }

    componentDidMount() {
        this.search();
    }

    componentWillReceiveProps(newProps) {
        if (!newProps) { return; }

        const searchTerm = this.props.match.params.searchTerm;

        const query = {
            searchTerm: searchTerm
        };

        if (JSON.stringify(query) === JSON.stringify(newProps.search.query)) {
            if (JSON.stringify(newProps.search.result) !== JSON.stringify(this.state.searchResults)) {
                this.setState({ searchResults: newProps.search.result });
            }
        } else {
            try {
                this.props.performSearch(
                    query,
                    ((args) => {
                        let {sQuery, sResult} = args;
                        if (JSON.stringify(query) === JSON.stringify(sQuery)) {
                            this.setState({ searchResults: sQuery });
                        }
                    }),
                    false
                );
            } catch (e) {
                console.log('Error occurred on search');
            }
        }
    }

    search() {
        const searchTerm = this.props.match.params.searchTerm;

        const query = {
            searchTerm: searchTerm
        };

        if (JSON.stringify(query) === JSON.stringify(this.props.search.query)) {
            if (JSON.stringify(this.state.searchResults) !== JSON.stringify(this.props.search.result)) {
                this.setState({ searchResults: this.props.search.result });
            }

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
    }

    render() {
        const searchTerm = this.props.match.params.searchTerm;
        const searchResults = this.state.searchResults;

        return (
        <div>
            <h1 style={{textAlign: "left"}}>Results for <b>'{searchTerm}'</b></h1>
            
            <hr />

            <div className="container">
                <ResultList results={searchResults} />
            </div>

        </div>
        );
    }

}

SearchResult.propTypes = {
    performSearch: PropTypes.func.isRequired,
    search: PropTypes.object.isRequired
}

const mapStateToProps = state => ({
    search: state.search
});

const routerSearchResult = withRouter(SearchResult);

export default connect(
    mapStateToProps,
    { performSearch }
)(routerSearchResult);