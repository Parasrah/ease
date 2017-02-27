import * as React from "react";

export interface IUploadBoxProps {
    onClick: () => void;
}

export const UploadBox = (props: IUploadBoxProps) => {

    return (
        <div className="upload-box">
            <span className="upload-here">
            	Drop file to upload or click below! <br />
            	<button onClick={props.onClick}>
            		Upload
            		</button></span>
        </div>
    );
};
