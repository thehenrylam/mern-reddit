import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import Result from "./result.card";
import Item from "./item.card";

import icon from '../icon.png';

class Test extends Component {

    constructor(props) {
        super(props);

        this.renderCardUserBody = this.renderCardUserBody.bind(this);
        this.renderCardUser = this.renderCardUser.bind(this);

        this.renderCardIcon = this.renderCardIcon.bind(this);
        this.renderCard = this.renderCard.bind(this);
    }

    renderCardIcon() {
        return (
        <img 
            src={ icon }
            className="rounded"
            style={{
                height: "5em",
                width: "5em"
            }}
        />
        );
    }

    renderCard(renderLeft, renderRight) {

        renderLeft = (renderLeft) ? renderLeft : (() => false);
        renderRight = (renderRight) ? renderRight : (() => false);

        return (
        <Link 
            to={"#"}
            className="btn card"
            style={{padding: '0.5em', marginTop: '0.5em', marginBottom: '0.5em'}}
        >
            <div className="row no-gutters">

                <div>{ renderLeft() }</div>

                <div className="col">
                    { renderRight() }
                </div>

            </div>
        </Link>
        );
    }

    renderCardUserBody() {
        return (
        <div className="row" style={{ width: "100%", height: "5em", paddingLeft: "0.5em", textAlign: "left", margin: '0' }}>

            <div className="col-4">
                <div className="row">
                    <h4>{'Username'}</h4>
                </div>
                <div className="row small">
                    {'12,300 followers'}
                </div>
                <div className="row small">
                    {'10,234 following'}
                </div>
            </div>

            <div className="col"></div>

            <div className="col-4" style={{ maxHeight: "4.75em", overflow: "hidden"}}>
                <p>{'This is a very very very very very very very very very very very long biography that describes a user'}</p>
            </div>
            
            <div className="col-1" style={{display: 'flex', alignItems: "center", minWidth: "10em"}}>
                <button className="btn btn-primary btn-block">Follow</button>
            </div>
            
        </div>
        );
    }

    renderCardUser() {
        return this.renderCard(this.renderCardIcon, this.renderCardUserBody);
    }

    renderCardHubBody() {
        return (
        <div className="row" style={{ width: "100%", height: "5em", paddingLeft: "0.5em", textAlign: "left", margin: '0' }}>
            
            <div className="col-4">
                <div className="row">
                    <h4>{'Hubname'}</h4>
                </div>
                <div className="row small text-muted">
                    {'Created on Sept 2, 2020'}
                </div>
                <div className="row small">
                    {'20,000 subscribers'}
                </div>
            </div>

            <div className="col"></div>

            <div className="col-4" style={{ maxHeight: "4.75em", overflow: "hidden"}}>
                <p>{'This is a very very very very very very very very very very very long description that describes a hub'}</p>
            </div>
            
            <div className="col-1" style={{display: 'flex', alignItems: "center", minWidth: "10em"}}>
                <button className="btn btn-primary btn-block">Subscribe</button>
            </div>

        </div>
        );
    }

    renderCardHub() {
        return this.renderCard(this.renderCardIcon, this.renderCardHubBody);
    }

    renderCardPostBody() {
        return (
        <div className="row" style={{ width: "100%", height: "5em", paddingLeft: "0.5em", textAlign: "left", margin: '0' }}>

            <div className="col-4">
                <div className="row">
                    <h4>{'Postname'}</h4>
                </div>
                <div className="row small text-muted">
                    {'Created on Sept 9, 2020'}
                </div>
                <div className="row small">
                    {'561 likes'}
                </div>
            </div>

            <div className="col"></div>

            <div className="col-4" style={{ maxHeight: "4.75em", overflow: "hidden"}}>
                <p>{'This is a very very very very very very very very very very very very very very very very very long description that describes a post'}</p>
            </div>
            
            <div className="col-1" 
                style={{
                    display: 'flex', 
                    flexDirection: 'column', 
                    alignItems: "center", 
                    minWidth: "10em", 
                    paddingTop: "0.25em", 
                    paddingBottom: "0.25em"
                }}
            >
                <button className="btn btn-primary btn-block btn-sm">Like</button>
                <button className="btn btn-primary btn-block btn-sm">Dislike</button>
            </div>

        </div>
        );
    }

    renderCardPost() {
        return this.renderCard(this.renderCardIcon, this.renderCardPostBody);
    }

    renderCardTitle() {
        // This is static
        return (<h4>{'Card name'}</h4>);
    }

    renderCardInfo() {
        // This is variable.
        return (
        <div style={{display: 'flex', flexDirection: "column"}}>
            <span className="small text-muted">{'Created on Sept 9, 2020'}</span>
            <span className="small">{'561 likes'}</span>
        </div>
        );
    } 

    renderCardSummary() {
        // This is static
        return (
        <>
            <div className="row">{ this.renderCardTitle() }</div>
            <div className="row">{ this.renderCardInfo() }</div>
        </>
        );
    }

    renderCardDescription() {
        // This is static
        return (
        <p style={{ maxHeight: '4.75em', overflow: 'hidden' }}>
            {'This is a very very very very very very very very very very very very very very very very very long description that describes a post'}
        </p>
        );
    }

    renderCardInteractables() {
        // This is variable.
        return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <button className="btn btn-sm btn-outline-primary btn-block">Like</button>
            <button className="btn btn-sm btn-outline-primary btn-block">Dislike</button>
        </div>
        );
    }

    renderCardBody() {
        return (
        <div 
            className="row" 
            style={{ 
                width: "100%", 
                height: "5em", 
                paddingLeft: "0.5em", 
                textAlign: "left", 
                margin: '0' 
            }}
        >

            <div className="col-4">{ this.renderCardSummary() }</div>

            <div className="col" />

            <div className="col-4">{ this.renderCardDescription() }</div>

            <div className="col-1" style={{minWidth: "10em"}}>{ this.renderCardInteractables() }</div>

        </div>
        );
    }

    renderCardNew() {
        return (
        <Link 
            to={"#"}
            className="btn card"
            style={{padding: '0.5em', marginTop: '0.5em', marginBottom: '0.5em'}}
        >
            <div className="row no-gutters">

                <div>{ this.renderCardIcon() }</div>

                <div className="col">{ this.renderCardBody() }</div>

            </div>
        </Link>
        );
    }

    render() {
        return (
        <div>
            <h1 style={{textAlign: "left"}}>Test Page</h1>

            <hr />
            <hr />

            <div className="container">

                <Result title="Result Title" body="Result Body" destination="#" />

                { this.renderCardUser() }

                { this.renderCardHub() }

                { this.renderCardPost() }

                { this.renderCardNew() }

                <Item variant={'user'} />
                <Item variant={'user2'} />

                <div>This is the container.</div>

            </div>
        </div>
        );
    }

}

Test.propTypes = {
}

const mapStateToProps = state => ({
});

const routerTest = withRouter(Test);

export default connect(
    mapStateToProps,
    { }
)(routerTest);