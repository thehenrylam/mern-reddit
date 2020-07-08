import React, { Component } from 'react';
import { withRouter, Link } from 'react-router-dom';
import { connect } from 'react-redux';

import icon from '../icon.png';

class Item extends Component {

    constructor(props) {
        super(props);

        this.selectVariant = this.selectVariant.bind(this);


        this.extractIconInfo = this.extractIconInfo.bind(this);
        this.extractSummaryInfo = this.extractSummaryInfo.bind(this);
        this.extractDescriptionInfo = this.extractDescriptionInfo.bind(this);
        this.extractActionsInfo = this.extractActionsInfo.bind(this);


        this.renderCardTitle = this.renderCardTitle.bind(this);
        this.renderCardInfo = this.renderCardInfo.bind(this);

        this.renderCardSummary = this.renderCardSummary.bind(this);
        this.renderCardDescription = this.renderCardDescription.bind(this);
        this.renderCardActions = this.renderCardActions.bind(this);

        this.renderIcon = this.renderIcon.bind(this);
        this.renderBody = this.renderBody.bind(this);

        this.state = {
            variant: this.selectVariant(this.props.variant),
            data: {}
        }
    }

    selectVariant(variant) {
        if (typeof(variant) !== 'string') {
            return null;
        }

        const variantList = new Set([
            'user',
            'hub',
            'post',
        ]);

        variant = (variantList.has(variant)) ? variant : null;

        return variant;
    }

    extractIconInfo(data) {
        return icon;
    }

    extractSummaryInfo(data) {
        return {
        };
    }

    extractDescriptionInfo(data) {
        return 'Description';
    }

    extractActionsInfo(data) {
        return {};
    }

    renderCardTitle() {
        return (<h4>{'Card name'}</h4>);
    }

    renderCardInfo() {
        return (
        <div style={{display: 'flex', flexDirection: 'column'}}>
            <span className='small text-muted'>{'Created on Sept 9, 2020'}</span>
            <span className='small'>{'561 likes'}</span>
        </div>
        );
    }

    renderCardSummary() {
        return (
        <>
            <div className="row">{ this.renderCardTitle() }</div>
            <div className="row">{ this.renderCardInfo() }</div>
        </>
        );
    }

    renderCardDescription() {
        return (
        <p style={{maxHeight: '4.75em', overflow: 'hidden'}}>
            {'This is a very very very long description.'}
        </p>
        );
    }

    renderCardActions() {
        return (
        <div
            style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
            }}
        >
            <button className='btn btn-sm btn-outline-primary btn-block'>Like</button>
            <button className='btn btn-sm btn-outline-primary btn-block'>Dislike</button>
        </div>
        );
    }

    renderIcon() {
        const icon = this.extractIconInfo(this.state.data);
        return (<img src={ icon } className='rounded' style={{height: '5em'}} />);
    }

    renderBody() {
        const summaryInfo = this.extractSummaryInfo(this.state.data);
        const descriptionInfo = this.extractDescriptionInfo(this.state.data);
        const actionsInfo = this.extractActionsInfo(this.state.data);

        return (
        <div
            className="row"
            style={{
                width: '100%',
                height: '5em',
                paddingLeft: '0.5em',
                textAlign: 'left',
                margin: '0'
            }}
        >
            <div className='col-4'>{ this.renderCardSummary() }</div>
            <div className='col' />
            <div className='col-4'>{ this.renderCardDescription() }</div>
            <div className='col-1' style={{minWidth: '10em'}}>{ this.renderCardActions() }</div>
        </div>
        );
    }

    render() {
        return (
        <Link
            to={'#'}
            className="btn card"
            style={{padding: '0.5em', marginTop: '0.5em', marginBottom: '0.5em'}}
        >
            <div className='row no-gutters' style={{maxHeight: '5em'}}>

                <div>{ this.renderIcon() }</div>
                <div className="col">{ this.renderBody() }</div>

            </div>
        </Link>
        );
    }

}

export default connect()(Item);