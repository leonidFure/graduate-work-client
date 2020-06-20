import React, {useState} from "react";
import Button from "@material-ui/core/Button";
import CircularProgress from "@material-ui/core/CircularProgress";
import Fade from "@material-ui/core/Fade";

export const FileUploadForm = ({uploadFile, visible}) => {
    const [file, setFile] = useState('')

    const handleChangeFile = e => {
        setFile(e.target.files[0])
    }
    return (
        <React.Fragment>
            <form>
                <div>
                    <input type="file" id={'customFile'} onChange={handleChangeFile}/>
                </div>
                <Button
                    size={"small"}
                    onClick={() => {
                        uploadFile(file)
                    }}
                >
                    Загрузить файл
                </Button>
                <Fade
                    in={visible}
                    style={{
                        transitionDelay: visible ? '800ms' : '0ms',
                    }}
                    unmountOnExit
                >
                    <CircularProgress />
                </Fade>

            </form>
        </React.Fragment>
    )
}