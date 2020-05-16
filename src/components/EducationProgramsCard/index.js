import React from "react"
import CardContent from "@material-ui/core/CardContent";
import Typography from "@material-ui/core/Typography";
import Card from "@material-ui/core/Card";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import {CardActions, ListItemText} from "@material-ui/core";
import Divider from "@material-ui/core/Divider";
import Button from "@material-ui/core/Button";

const descriptionCropLength = 50

export const EducationProgramsCard = ({educationPrograms, educationsProgramsCount}) => {

    const getCropDescription = description => {
        return `${description.substring(0, descriptionCropLength)}${description.length > descriptionCropLength ? '...' : ''}`
    }

    return (
        <Card>
            <CardContent>
                <Typography>
                    Программы обучения
                </Typography>
                {educationPrograms && educationPrograms.length > 0 ? (
                    <List component="nav">
                        {educationPrograms.map(educationProgram => (
                            <div key={educationProgram.id}>
                                <ListItem button>
                                    <ListItemText
                                        primary={educationProgram.name}
                                        secondary={getCropDescription(educationProgram.description)}
                                    />
                                </ListItem>

                            </div>
                        ))}
                    </List>
                ) : 'Програм обучения нет'}
            </CardContent>
            {educationPrograms && educationPrograms.length > 0 && (
                <CardActions>
                    <Button>{`Все программы обучения (${educationsProgramsCount})`}</Button>
                </CardActions>
            )}
        </Card>
    )
}