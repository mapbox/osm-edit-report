import React from 'react';

export default function Section({children, title, titleBottom, titleRight, titleRightBottom}) {
    return (
        <div className="flex-parent flex-parent--column mx12 my48 w-full">
            <div className="flex-parent flex--column space-between mx18">
                <div>
                    <h2 className="txt-subhead txt-light"> {title} </h2>
                    <h2 className="txt-l txt-light"> {titleBottom} </h2>
                </div>
                <div className="align-r">
                    <h2 className="txt-l txt-light"> {titleRight} </h2>
                    {titleRightBottom}
                </div>
            </div>
            {children}

        </div>
    )
}