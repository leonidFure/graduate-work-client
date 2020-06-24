import React, {useContext, useState} from "react";
import Button from "@material-ui/core/Button";
import Dialog from "@material-ui/core/Dialog";
import DialogTitle from "@material-ui/core/DialogTitle";
import DialogContent from "@material-ui/core/DialogContent";
import TextField from "@material-ui/core/TextField";
import DialogActions from "@material-ui/core/DialogActions";
import Grid from "@material-ui/core/Grid";
import {KeyboardDatePicker} from "@material-ui/pickers";
import MaterialTable from "material-table";
import Autocomplete from "@material-ui/lab/Autocomplete";
import {AlertContext} from "../../context/notify/alertContext";

export const CourseAddDialog = ({open, handleClose, allEducationPrograms, saveCourseAndTimetables}) => {
    const getDate = () => {
        const date = new Date()
        const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date)
        const mo = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(date)
        const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date)
        return `${ye}-${mo}-${da}`
    }
    const [startDate, setStartDate] = useState(getDate())
    const [endDate, setEndDate] = useState(getDate())
    const [educationProgram, setEducationProgram] = useState()
    const [state, setState] = React.useState({
            columns: [
                {
                    title: 'День недели',
                    field: 'dayOfWeek',
                    lookup: {
                        'MONDAY': 'ПН',
                        'TUESDAY': 'ВТ',
                        'WEDNESDAY': 'СР',
                        'THURSDAY': 'ЧТ',
                        'FRIDAY': 'ПТ',
                        'SATURDAY': 'СБ',
                        'SUNDAY': 'ВС'
                    }
                },
                {
                    title: 'Время начала',
                    field: 'startTime',
                },
                {title: 'Время окончания', field: 'endTime'},
                {
                    title: 'Периодичность',
                    field: 'type',
                    lookup: {
                        'EVEN': 'Четные недели',
                        'ODD': 'Нечетные недели',
                        'EVERY_WEEK': 'Каждая неделя'
                    }
                },


            ],
            data: []
        }
    )
    const alert = useContext(AlertContext)


    const handleChangeStartDate = e => {
        const date = e
        const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date)
        const mo = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(date)
        const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date)
        setStartDate(`${ye}-${mo}-${da}`)
    }

    const handleChangeEndDate = e => {
        const date = e
        const ye = new Intl.DateTimeFormat('en', {year: 'numeric'}).format(date)
        const mo = new Intl.DateTimeFormat('en', {month: '2-digit'}).format(date)
        const da = new Intl.DateTimeFormat('en', {day: '2-digit'}).format(date)
        setEndDate(`${ye}-${mo}-${da}`)
    }
    const handleChangeEducationProgram = (e, educationProgram) => {
        setEducationProgram(educationProgram)
    }

    const save = () => {
        let paramsValid = true

        if (startDate >= endDate)
            paramsValid = false

        if (!educationProgram) {
            paramsValid = false
        }

        if (!paramsValid) {
            alert.show('Поля заполнены некоректно', 'error')
        } else {
            const course = {}
            course.startDate = startDate
            course.endDate = endDate
            course.educationProgramId = educationProgram.id
            saveCourseAndTimetables(course, state.data)
            handleClose()
        }
    }


    return (
        <Dialog
            open={open}
            onClose={handleClose}
            aria-labelledby="form-dialog-title"
            fullWidth={true}
            maxWidth={'md'}
        >
            <DialogTitle id="form-dialog-title">Создание нового курса</DialogTitle>
            <DialogContent>
                <Grid container spacing={2}>
                    <Grid item xs={12}>
                        <Grid item xs={12}>
                            {allEducationPrograms && (
                                <Autocomplete
                                    id="combo-box-demo"
                                    options={allEducationPrograms}
                                    getOptionLabel={(option) => option.name}
                                    onChange={handleChangeEducationProgram}
                                    renderInput={(params) => <TextField {...params} label="Программа обучения"
                                                                        variant="outlined"/>}
                                />
                            )}
                        </Grid>
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <KeyboardDatePicker
                            autoOk
                            fullWidth
                            disableToolbar
                            margin="normal"
                            inputVariant="outlined"
                            label="Дата начала начала курса"
                            format="dd MMM yyyy г."
                            value={startDate}
                            onChange={handleChangeStartDate}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>
                    <Grid item xs={12} sm={6}>
                        <KeyboardDatePicker
                            autoOk
                            fullWidth
                            disableToolbar
                            margin="normal"
                            inputVariant="outlined"
                            label="Дата окончания начала курса"
                            format="dd MMM yyyy г."
                            value={endDate}
                            onChange={handleChangeEndDate}
                            KeyboardButtonProps={{
                                'aria-label': 'change date',
                            }}
                        />
                    </Grid>
                    <Grid item xs={12}>
                        <MaterialTableDemo state={state} setState={setState}/>
                    </Grid>
                </Grid>
            </DialogContent>
            <DialogActions>
                <Button onClick={handleClose} color="secondary">
                    Отмена
                </Button>
                <Button color="primary" onClick={save}>
                    Сохранить
                </Button>
            </DialogActions>
        </Dialog>
    );
}


const MaterialTableDemo = ({state, setState}) => {

    return (
        <MaterialTable
            title="Расписание занятий"
            columns={state.columns}
            data={state.data}
            options={{
                search: false
            }}
            editable={{
                onRowAdd: (newData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                            setState((prevState) => {
                                const data = [...prevState.data];
                                data.push(newData);
                                return {...prevState, data};
                            });
                        }, 600);
                    }),
                onRowUpdate: (newData, oldData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                            if (oldData) {
                                setState((prevState) => {
                                    const data = [...prevState.data];
                                    data[data.indexOf(oldData)] = newData;
                                    return {...prevState, data};
                                });
                            }
                        }, 600);
                    }),
                onRowDelete: (oldData) =>
                    new Promise((resolve) => {
                        setTimeout(() => {
                            resolve();
                            setState((prevState) => {
                                const data = [...prevState.data];
                                data.splice(data.indexOf(oldData), 1);
                                return {...prevState, data};
                            });
                        }, 600);
                    }),
            }}
        />
    );
}