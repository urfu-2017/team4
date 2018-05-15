import React from 'react';
import b_ from 'b_';

import uiStore from '../../domain/ui-store';

import './OGData.css';
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
        const { image, url, description, title } = this.props;
        const dark = uiStore.isDark;

        if (!title && !image) {
            return null;
        }

        return (
            <section className={b({ 'in-message': true, dark })}>
                {image && (
                    <a href={url} target="_blank" className={b('image-link')}>
                        <img className={b('image')} src={image} alt="" />
                    </a>
                )}
                <div className={b('info')}>
                    <h2 className={b('title')}>
                        <a href={url} target="_blank">
                            {title}
                        </a>
                    </h2>
                    <p className={b('description')}>{description || 'Описание не указано'}</p>
                </div>
            </section>
        );
    }
}

export default OGData;
