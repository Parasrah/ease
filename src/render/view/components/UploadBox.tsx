import * as React from "react";

export interface IUploadBoxProps {
    onClick(): void;
}

export const UploadBox = (props: IUploadBoxProps) => {

    return (
        <div className="upload-box">
            <span className="upload-here"><button className="pure-button pure-button-primary upload-click" onClick={props.onClick}>Click Here</button> or drag to upload</span>
        </div>
    );
};
