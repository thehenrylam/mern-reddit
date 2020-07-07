import React, { Component } from 'react';
import PropTypes from "prop-types";
import { connect } from "react-redux";

import { removeUser } from "../actions/profile.action";

class DeleteProfile extends Component {

    constructor(props) {
        super(props);

        // Set the callback function (this.onSuccess) 
        // if the prop's function is valid, otherwise, replace it with a dummy function.
        this.onSuccess = this.props.onSuccess ?? (() => false);

        this.onDeleteAccount = this.onDeleteAccount.bind(this);

        this.onChange = this.onChange.bind(this);

        this.state = {
            userInput: "",
            confirmText: this.props.confirmText ? this.props.confirmText : "I understand"
        }
    }

    onDeleteAccount() {
        const userId = this.props.auth.user.id;
        this.props.removeUser(userId, this.onSuccess);
    }

    onChange(e) {
        this.setState({ [e.target.id]: e.target.value });
    }

    render() {
        const enabled = (this.state.userInput === this.state.confirmText);

        return (
        <div style={{textAlign: "left"}}>
            <p>
                Warning: Once you delete your account, you cannot recover the and its data. Please be careful.
                <br />
                To confirm account deletion, please type "<b>{this.state.confirmText}</b>"
            </p>
            
            <div className="form-row">
                <input 
                    type="text" 
                    className="col"
                    placeholder={this.state.confirmText} 
                    onChange={this.onChange}
                    value={this.state.userInput}
                    id="userInput"
                    type="text" 
                />
                <div className="col">
                    <button 
                        onClick={(enabled) ? this.onDeleteAccount : (() => false)}
                        className={"btn" + ((enabled) ? " btn-danger" : " btn-outline-danger") }
                        disabled={!enabled}
                    >
                        Delete Account
                    </button>
                </div>
            </div>

        </div>
        );
    }

}

DeleteProfile.propTypes = {
    removeUser: PropTypes.func.isRequired,
    auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
    auth: state.auth
});

export default connect(
    mapStateToProps,
    { removeUser }
)(DeleteProfile);