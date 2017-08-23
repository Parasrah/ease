import * as React from "react";

export interface IUploadBoxProps {
    onClick(): void;
}

export const UploadBox = (props: IUploadBoxProps) => {

    return (
        <div className="upload-box">
            <div className="upload-here">
                Drop file to upload or click below!
                <br/>
                <button onClick={props.onClick}>
                    Upload
                </button>
            </div>
        </div>
    );
};
