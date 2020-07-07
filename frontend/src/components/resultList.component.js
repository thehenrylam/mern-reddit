import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import Result from './result.card';

import {
    PROFILE_PAGE_ENDPOINT
} from '../constants';

class ResultList extends Component {

    constructor(props) {
        super(props);

        const results = (Array.isArray(this.props.results)) ? this.props.results : [];

        this.state = {
            results: results,
        };
    }

    componentWillReceiveProps(nextProps) {
        if (!nextProps) {
            return;
        }

        let results = (Array.isArray(nextProps && nextProps.results)) ? nextProps.results : [];
        if ((results.length > 0) && (results != this.state.results)) {
            this.setState({
                results: results
            });
        }
    }

    render() {
        const results = this.state.results;

        return (
        <>{
            results.map((object, i) => {
                return (
                <Result
                    to={PROFILE_PAGE_ENDPOINT + object._id}
                    icon={object.icon}
                    title={object.name}
                    body={object.bio}
                />
                );
            })
        }</>
        );
    }

}

ResultList.propTypes = {
}

const mapStateToProps = state => ({
});

export default connect(
    mapStateToProps,
    {  }
)(ResultList);
