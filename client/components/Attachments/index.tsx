import React from 'react';
import PropTypes from 'prop-types';
import b_ from 'b_';
import { observer } from 'mobx-react';
import { observable, runInAction } from 'mobx';
import Dropzone from 'react-dropzone';

import Button from '../Button';

import './Attachments.css';

const b = b_.with('attachments');

@observer
class Attachments extends React.Component {
    @observable private displayDropzone: boolean = false;
    private dropzone: Dropzone;

    public componentDidMount() {
        let childrenDepth: number = 0;

        window.addEventListener('dragenter',(event) => {
            event.preventDefault();
            childrenDepth++;

            runInAction(() => {
                this.displayDropzone = true;
            })
        });
        window.addEventListener('dragleave', (event) => {
            event.preventDefault();
            childrenDepth--;

            if (childrenDepth === 0) {
                runInAction(() => {
                    this.displayDropzone = false;
                })
            }
        })
    }

    public render() {
        return (
            <div className={b()}>
                <Button onClick={this.dropzoneOpen}/>
                <Dropzone ref={(node) => { this.dropzone = node; }}/>
            </div>
        );
    }

    private dropzoneOpen = (): void => {
        this.dropzone.open()
    };
}

export default Attachments;
