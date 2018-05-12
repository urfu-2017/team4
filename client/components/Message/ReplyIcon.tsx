import React from 'react';

interface Props {
    className?: string;
}

const ReplyIcon: React.SFC<Props> = ({ className = '' }) => (
    <svg className={className} viewBox="0 0 16 16">
        <path
            fill="currentColor"
            fillRule="evenodd"
            d="M16 8l-6-5v3C5.5 6 2 7 0 12c3-2.5 6-3 10-2v3l6-5zm0 0"
        />
    </svg>
);

export default ReplyIcon;
