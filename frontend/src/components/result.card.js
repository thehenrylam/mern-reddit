import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import icon from "../icon.png";

class Result extends Component {

    constructor(props) {
        super(props);

        this.renderCardImage = this.renderCardImage.bind(this);
        this.renderCardBody = this.renderCardBody.bind(this);

        this.state = {
            icon: (this.props.icon) ? this.props.icon : null,
            title: (typeof(this.props.title) === 'string') ? this.props.title : null,
            body: (typeof(this.props.body) === 'string') ? this.props.body : null,
            destination: (typeof(this.props.to) === 'string') ? this.props.to : "#",
        };
    }


    renderCardImage(image) {
        return (
        <img 
            src={ (image) ? image : icon }
            className="rounded"
            style={{
                height: "5em",
                width: "5em"
            }}
        />
        );
    }

    renderCardBody(title, body) {
        return (
        <div style={{ paddingLeft: "0.5em", textAlign: "left" }}>
            <h5 className="card-title" style={{ marginBottom: "0.25em" }}>
                { (title) ? title : <i>No title available.</i> }
            </h5>
            <p className="card-text">
                { (body) ? body : <i>No description available.</i> }
            </p>
        </div>
        );
    }

    renderResultCard(link, icon, title, body) {
        return (
        <Link
            to={ (link) ? link : "#" }
            className="btn card"
            style={{padding: '0.5em', marginTop: '0.5em', marginBottom: '0.5em'}}
        >
            <div className="row no-gutters">
                
                <div>{ this.renderCardImage( icon ) }</div>

                <div className="col-md-8">
                    { this.renderCardBody( title, body ) }
                </div>

            </div>
        </Link>
        );
    }

    render() {
        let {
            destination, 
            icon, 
            title, 
            body
        } = this.state;

        return this.renderResultCard(destination, icon, title, body);

    }

}

export default connect()(Result);