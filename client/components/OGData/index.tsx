import React from 'react';

import ogStore from '../../domain/og-store';
import './OGData.css';

interface Props {
    isInMessage: boolean;
    image: string;
    url: string;
    title: string;
    description: string;
}

class OGData extends React.Component<Props> {
    public render() {
        return (
            <section className={`og-data ${this.props.isInMessage ? 'og-data_inMessage' : ''}`}>
                {this.props.image && (
                    <a href={this.props.url} className="og-data__image-link">
                        <img
                            className="og-data__image"
                            src={this.props.image}
                            alt={this.props.title}
                        />
                    </a>
                )}
                <div className="og-data__info">
                    <h2 className="og-data__title">
                        <a href={this.props.url}>{this.props.title}</a>
                    </h2>
                    <p className="og-data__description">
                        {this.props.description || 'Описание не указано'}
                    </p>
                </div>
                {!this.props.isInMessage && (
                    <button className="og-data__close" title="Открепить" onClick={ogStore.clear} />
                )}
            </section>
        );
    }
}

export default OGData;
