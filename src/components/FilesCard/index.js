import React from "react"
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Card from "@material-ui/core/Card";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import Grid from "@material-ui/core/Grid";
import {CardActions} from "@material-ui/core";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
import {isAdmin} from "../../roles";
import {FileUploadForm} from "../FileUploadForm";
import {HtmlTooltip} from "../HtmlTooltip";
import makeStyles from "@material-ui/core/styles/makeStyles";

const url = process.env.REACT_APP_SERVER_URL;

const userId = localStorage.getItem('currentUserId')


const useStyles = makeStyles(theme => ({
    root: {
        flexShrink: 0,
        maxHeight: 300,
        overflow: 'auto',

    },
    headerCard: {
        marginBottom: theme.spacing(1)
    }
}))

export const FilesCard = ({files, creatorId, uploadFile, visible}) => {
    const classes = useStyles()

    return (
        <Card>
            <CardContent>
                <Typography>
                    Приложенные файлы
                </Typography>
                {files && files.length > 0 ? (
                    <div>
                        <List component="nav" dense={true}  className={classes.root}>
                            {files.map(file => (
                                <HtmlTooltip title={
                                    <React.Fragment>
                                        <Typography>
                                            Название файла:
                                        </Typography>
                                        <Typography variant={"body2"}>
                                            {file.name}
                                        </Typography>
                                    </React.Fragment>
                                } key={file.id}>
                                    <ListItem button component={"a"} href={`${url}${file.url}`}>
                                        <Grid container alignItems={"center"}>
                                            <Grid item>
                                                <ListItemAvatar>
                                                    <Avatar>
                                                        <InsertDriveFileIcon/>
                                                    </Avatar>
                                                </ListItemAvatar>
                                            </Grid>
                                            <Grid item xs zeroMinWidth>
                                                <ListItemText
                                                    primary={
                                                        <Typography noWrap>
                                                            {file.name}
                                                        </Typography>
                                                    }
                                                    secondary={new Date(file.uploadingDateTime).toLocaleDateString('ru', {
                                                        day: 'numeric',
                                                        month: 'long',
                                                        year: 'numeric'
                                                    })}
                                                />
                                            </Grid>
                                        </Grid>
                                    </ListItem>
                                </HtmlTooltip>

                            ))
                            }
                        </List>

                    </div>

                ) : (
                    <Typography color={"textSecondary"} align={"center"} variant={"body2"}>
                        Приложеные файлы не найдены
                    </Typography>
                )}
            </CardContent>
            <CardActions>
                {(isAdmin() || creatorId === userId) && (
                    <FileUploadForm uploadFile={uploadFile} visible={visible}/>
                )}
            </CardActions>
        </Card>
    )
}