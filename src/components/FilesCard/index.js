import React from "react"
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import Card from "@material-ui/core/Card";
import ListItemAvatar from "@material-ui/core/ListItemAvatar";
import Avatar from "@material-ui/core/Avatar";
import TodayIcon from "@material-ui/icons/Today";
import Grid from "@material-ui/core/Grid";
import Button from "@material-ui/core/Button";
import {CardActions} from "@material-ui/core";
import InsertDriveFileIcon from '@material-ui/icons/InsertDriveFile';
const url = process.env.REACT_APP_SERVER_URL;

export const FilesCard = ({files, count}) => {
    return (
        <Card>
            <CardContent>
                <Typography>
                    Приложенные файлы
                </Typography>
                {files && count > 0 ? (
                    <div>
                        <List component="nav" dense={true}>
                            {files.map(file => (
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
                            ))
                            }
                        </List>
                        {files.length < count && (
                            <CardActions>
                                <Button>{`Все файлы (${count})`}</Button>
                            </CardActions>
                        )}
                    </div>

                ) : (
                    <Typography color={"textSecondary"} align={"center"} variant={"body2"}>
                        Приложеные файлы не найдены
                    </Typography>
                )}
            </CardContent>
        </Card>
    )
}