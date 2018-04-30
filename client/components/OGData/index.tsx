import React from 'react';
import b_ from 'b_';

import './OGData.css';

import ogStore from '../../domain/og-store';

const b = b_.with('og-data');

interface Props {
    isInMessage: boolean;
    image?: string;
    url: string;
    title: string;
    description?: string;
}

class OGData extends React.Component<Props> {
    public render() {
        return (
            <section className={b({ 'in-message': this.props.isInMessage })}>
                {this.props.image && (
                    <a href={this.props.url} className={b('image-link')}>
                        <img
                            className={b('image')}
                            src={this.props.image}
                            alt={this.props.title}
                        />
                    </a>
                )}
                <div className={b('info')}>
                    <h2 className={b('title')}>
                        <a href={this.props.url}>{this.props.title}</a>
                    </h2>
                    <p className={b('description')}>
                        {this.props.description || 'Описание не указано'}
                    </p>
                </div>
                {!this.props.isInMessage && (
                    <button className={b('close')} title="Открепить" onClick={ogStore.clear} />
                )}
            </section>
        );
    }
}

export default OGData;
