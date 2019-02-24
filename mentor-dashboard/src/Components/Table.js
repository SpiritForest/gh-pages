import React from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import Paper from '@material-ui/core/Paper';
import data from '../node/result-json/result';
import Typography from '@material-ui/core/Typography';

const CustomTableCell = withStyles(theme => ({
  head: {
    backgroundColor: theme.palette.common.black,
    color: theme.palette.common.white,
  },
  body: {
    fontSize: 14,
  },
}))(TableCell);

const styles = theme => ({
  root: {
    width: '100%',
    marginTop: theme.spacing.unit * 3,
    overflowX: 'auto',
  },
  table: {
    minWidth: 700,
  },
  green: {
      backgroundColor: 'green'
  },
  red: {
      backgroundColor: 'red'
  },
  gray: {
    backgroundColor: 'gray'
  },
  pink: {
    backgroundColor: 'pink'
  },
  yellow: {
    backgroundColor: 'yellow'
  }
});

function getStudentName(mentorName) {
  const students = [];
  for (let key in data[mentorName].students) {
    students.push(key);
  }
  return students; 
}

function getListOfTasks() {
  const tasks = [];
for (let key in data) {
    const studentsObj = data[key].students;
    for (let student in studentsObj) {
        const task = studentsObj[student].tasks;
        for (let tsk in task) {
            tasks.push(tsk);
        }
        break;
    }
    break;
}
return tasks;
}

function getStudentsInfo(tasks, mentorName){
  const arr = [];
  for (let i = 0; i < tasks.length; i += 1) {
    const obj = {};
    obj.taskName = tasks[i];
    for (let key in data[mentorName].students) {
      obj[key] = {
        color: data[mentorName].students[key].tasks[tasks[i]].color,
        score: (function(){
          return data[mentorName].students[key].tasks[tasks[i]].score === 'undefined' 
          ? "0" 
          : data[mentorName].students[key].tasks[tasks[i]].score
        }())
      }
    }
    arr.push(obj);
  }
return arr;
}

const tasks = getListOfTasks();

const getData = mentorName => {
  if (!mentorName) {
    return {};
  }
  const keys = Object.keys(data);
  if (!keys.includes(mentorName)) {
    return {};
  }
  const studentsName = getStudentName(mentorName);
  const studentInfo = getStudentsInfo(tasks, mentorName);

  return {
    studentsName,
    studentInfo
  };
}

function CustomizedTable(props) {
  const { classes, mentorName } = props;
  const { studentsName = [], studentInfo = [] } = getData(mentorName);

  return (
    <Paper className={classes.root}>
      <Typography variant="h5">Current mentor: {mentorName}</Typography>
      <Table className={classes.table}>
      <TableHead>
          <TableRow>
            <CustomTableCell>Tasks / Students</CustomTableCell>
            {studentsName.map(student => (
              <CustomTableCell key={student.score} align="right">{student}</CustomTableCell>
            ))}
          </TableRow>
        </TableHead>
        <TableBody>
          {studentInfo.map(task => (
            <TableRow>
              <CustomTableCell component="th" scope="row">{task.taskName}</CustomTableCell>
              {studentsName.map(name => (
                <CustomTableCell className={classes[task[name].color]} align="right">{task[name].score}</CustomTableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
      <Table className={classes.table}>
        <TableHead>
          <TableRow>
            <CustomTableCell>Color definition:</CustomTableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          <TableRow>
            <CustomTableCell className={classes.green}>Checked by mentor</CustomTableCell>
          </TableRow>
          <TableRow>
            <CustomTableCell className={classes.red}>Time for checking is gone and no mark from mentor</CustomTableCell>
          </TableRow>
          <TableRow>
            <CustomTableCell className={classes.yellow}>Students working on that task now</CustomTableCell>
          </TableRow>
          <TableRow>
            <CustomTableCell className={classes.pink}>Need to check</CustomTableCell>
          </TableRow>
          <TableRow>
            <CustomTableCell className={classes.gray}>Task in todo state</CustomTableCell>
          </TableRow>
        </TableBody>
      </Table>
    </Paper>
  );
}

CustomizedTable.propTypes = {
  classes: PropTypes.object.isRequired,
};

export default withStyles(styles)(CustomizedTable);
