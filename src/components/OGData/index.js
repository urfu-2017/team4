import React from 'react';
import PropTypes from 'prop-types';

import './OGData.css';

class OGData extends React.Component {
    render() {
        return (
            <section className="og-data">
                {
                    this.props.image &&
                    <a href={this.props.url} className="og-data__image-link">
                        <img
                            className="og-data__image"
                            src={this.props.image}
                            alt={this.props.title}
                        />
                    </a>
                }
                <div className="og-data__info">
                    <h2 className="og-data__title">
                        <a href={this.props.url}>{this.props.title}</a>
                    </h2>
                    <p className="og-data__description">
                        { this.props.description || 'Описание не указано'}
                    </p>
                </div>
                <button className="og-data__close" title="Открепить"/>
            </section>
        );
    }
}

OGData.propTypes = {
    image: PropTypes.string,
    description: PropTypes.string,
    title: PropTypes.string,
    url: PropTypes.string.isRequired
};

OGData.defaultProps = {
    image: '',
    description: '',
    title: ''
};

export default OGData;
