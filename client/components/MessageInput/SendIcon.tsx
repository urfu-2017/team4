import React from 'react';

interface Props {
    className?: string;
}

const SendIcon: React.SFC<Props> = ({ className }) => (
    <svg xmlns="http://www.w3.org/2000/svg" className={className} viewBox="-3 -7 26 26">
        <g>
            <path fill="#999999" d="m1.075374,15.957422l21,-9l-21,-9l0,7l15,2l-15,2l0,7z" />
        </g>
    </svg>
);

export default SendIcon;
