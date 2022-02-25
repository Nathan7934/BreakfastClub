import React from "react";
import { Link } from "react-router-dom";
import Button from "@material-ui/core/Button";
import MainCommands from '../components/MainCommands';
import SearchBar from '../components/SearchBar';
import {getReports, getReportById, deleteReport} from './../actions/report';
import {getUserById} from './../actions/user';


class Reported extends React.Component {
    render () {
        const {app, isRstrnt, isAdmin, users, SetSearchedUser} = this.props;
        const reports = app.state.reported
        if(reports.length == 0){
            return (
            <div>
                <MainCommands app ={app} isRstrnt={isRstrnt} isAdmin={isAdmin}/> <br/>
                <SearchBar users={users} SetSearchedUser = {SetSearchedUser}/>
                <h3>no new reports have been submitted</h3>
            </div>
            )
        }
        else{
            return(
                <div>
                    <MainCommands app ={app} isRstrnt={isRstrnt} isAdmin={isAdmin}/> <br/>
                    <SearchBar users={users} SetSearchedUser = {SetSearchedUser}/>
                    <div className ='Structure'>
                        <h2 className ='header'> Reports</h2>
                        {reports.slice(0).reverse().map((report) =>
                        <ReportTicket
                            userid={report.contentId}
                            repid={report._id}
                            owner ={report.contentOwner}
                            users={users}
                            SetSearchedUser={SetSearchedUser}
                        />
                    )}
                    </div>
                </div>
            )
        }
    }
}

class ReportTicket extends React.Component {
    state ={
        user : ''
    }
    findProfileByUserId = (id, users) => {
        const searchedUser = users.filter((user) => id === user._id)
        this.props.SetSearchedUser(searchedUser[0], searchedUser.length === 1)
    }

    render() {
        const {userid, repid, owner, users, SetSearchedUser} = this.props
        return(
            <div id ='noPost'>
                <h4 onMouseEnter ={()=>this.findProfileByUserId(userid, users)}>
                    <Link to={'./SearchedUser'}>{owner}</Link> 
                    <span><button onClick={()=> deleteReport(repid)}>dismiss</button></span>
                    </h4>
            </div>
        )
    }
}
export default Reported;
