import React from 'react';
import PropTypes from 'prop-types';

import './itemDialog.css';
import messages from './messages.json';

class ItemDialog extends React.Component {
    render() {
        const { name, messagesIds } = this.props;

        return (
            <div className="dialog-list__item">
                <img
                    src="https://imagineacademy.microsoft.com/content/images/microsoft-img.png"
                    alt=""
                    className="dialog-list__dialog-image"
                />
                <div className="dialog-list__dialog-name">{name}</div>
                <div className="dialog-list__last-msg">{messages.find(msg => msg.id === messagesIds).text}</div>
                <div className="dialog-list__last-msg-date">{messages.find(msg => msg.id === messagesIds).date}</div>
            </div>
        );
    }
}

ItemDialog.propTypes = {
    name: PropTypes.string.isRequired,
    messagesIds: PropTypes.string.isRequired
};

export default ItemDialog;
