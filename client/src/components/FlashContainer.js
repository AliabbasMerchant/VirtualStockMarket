import React from 'react';
import FlashChange from '@avinlab/react-flash-change';

const FlashContainer = ({ value }) => {
    return <FlashChange
        value={value}
        flashClassName="flashing"
        flashDuration="500"
        className="flashContainer"
        outerElementType="span"
        compare={(prevProps, newProps) => {
            return newProps.value !== prevProps.value;
        }}
    >
        <span>{value}</span>
    </FlashChange>;
}

export default FlashContainer;