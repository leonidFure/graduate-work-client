import React, {useState} from "react"
import Tabs from "@material-ui/core/Tabs";
import Tab from "@material-ui/core/Tab";
import {Paper} from "@material-ui/core";
import {TabPanel} from "../TabPanel";

export const UserTimetableCard = () => {
    const [tab, setTab] = useState(0)
    const handleChangeTab = (e, newValue) => {
        setTab(newValue)
    }
    return (
        <Paper>
            <Tabs
                value={tab}
                onChange={handleChangeTab}
                indicatorColor="primary"
                variant="fullWidth"
                textColor="primary"
                centered
            >
                <Tab label="Занятия"/>
                <Tab label="Расписание"/>
            </Tabs>
            <TabPanel value={tab} index={0}>
                asdas
            </TabPanel>
            <TabPanel value={tab} index={1}>
                Расписание
            </TabPanel>
        </Paper>
    )
}