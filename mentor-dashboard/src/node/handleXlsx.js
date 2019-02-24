const fs = require('fs');
const xlsx = require('xlsx');
const nxlsx = require('node-xlsx');

const pathRead = {
  mentorScore: `../data/Mentor score.xlsx`,
  pairs:  `../data/Mentor-students pairs.xlsx`,
  tasks: `../data/Tasks.xlsx`
}

//function reads file as arg and parse it to an object
function getObjectFromSheet(path) {
  return obj = nxlsx.parse(path);
}

//function gets tasks from sheet and their status
function getTaskAndStatus() {
  const obj = getObjectFromSheet(pathRead.tasks);
  const tasks = {};
  const sheet1 = obj[0].data;

  for (let i = 1, len = sheet1.length; i < len; i += 1) {
    const taskName = sheet1[i][0];
    const taskStatus = sheet1[i][2];
    tasks[taskName] = {
      status: taskStatus
    };
  }
  return tasks;
}

//function merges mentors with their students
function mergeStudentWithMentors() {
  const obj = getObjectFromSheet(pathRead.pairs);
  const sheet1 = obj[0].data;
  const mentors = {};

  for (let i = 1, len = sheet1.length; i < len; i += 1) {
    const mentorName = sheet1[i][0];
    const studentName = sheet1[i][1];
    if (mentorName) {
      if (!(mentors.hasOwnProperty(mentorName))) {
        mentors[mentorName] = {
          github: 'undefined',
          students: {}
        };
        mentors[mentorName]['students'][studentName] = {
          tasks: {},
          github: `https://github.com/${studentName}`
        };
      }
      else {
        mentors[mentorName]['students'][studentName] = {
          tasks: {},
          github: `https://github.com/${studentName}`
        };
      }
    } 
  }
  // fs.writeFile('pairs.json', JSON.stringify(mentors, 0, 4), ()=>{});
  return mentors;
}

//function adds to mentors link to the gitHub accaunt 
function addGithubForMentor() {
  const obj = getObjectFromSheet(pathRead.pairs);
  const mentors = mergeStudentWithMentors();
  const sheet2 = obj[1].data;
  for (let i = 1, len = sheet2.length; i < len; i += 1) {
    const fullName = `${sheet2[i][0]} ${sheet2[i][1]}`;
    const ghLink = sheet2[i][4];
    if (mentors.hasOwnProperty(fullName)) {
      mentors[fullName].github = ghLink.toLowerCase();
    }
  }
  return mentors;
}

//function adds tasks and their score to students
function handleMentorScore() {
  const obj = getObjectFromSheet(pathRead.mentorScore);
  const mentorScore = obj[0].data;
  const mentors = addGithubForMentor();
  const tasks = getTaskAndStatus();
  for (let i = 1, len = mentorScore.length; i < len; i += 1) {
    const mentorGit = mentorScore[i][1].toLowerCase();
    const studentGit = mentorScore[i][2].toLowerCase();
    const taskName = mentorScore[i][3];
    const taskScore = mentorScore[i][5];
    for (let mentorName in mentors) {
      if (mentorGit === mentors[mentorName].github) { 
        for (let studentName in mentors[mentorName].students) {
          const studentObj = mentors[mentorName].students[studentName];
          for (let task in tasks) {
            if (!(studentObj.tasks[task])) {
              studentObj.tasks[task] = {
                score: "undefined",
                color: "undefined"
                }
              }
            }
          if (studentGit === studentObj.github) {
            const studentTask = studentObj.tasks[taskName];
            studentTask.score = taskScore;
            studentTask.color = "green";
          }
        }
      } else {
        const studentObj = mentors[mentorName].students;
        for (let key in studentObj) {
          for (let task in tasks) {
            if (!(studentObj[key].tasks[task])) {
              studentObj[key].tasks[task] = {
                score: "undefined",
                color: "undefined"
                }
              }
            }
        }
      }
    }
  }
  return mentors;
}

// function adds property "color" to each student dependently of task status
function getColorForDraw(){
  const mentors = handleMentorScore();
  const tasks = getTaskAndStatus();
  for (let key in mentors) {
    const student = mentors[key].students;
    for (let person in student) {
      const studentTask = student[person].tasks;
      for (let taskName in studentTask) {
        const score = studentTask[taskName].score;
        const status = tasks[taskName].status;
        if (score === "undefined" && status === "ToDo") {
          studentTask[taskName].color = "gray";
        }
        else if (score === "undefined" && status === "In Progress") {
          studentTask[taskName].color = "yellow";
        }
        else if (score === "undefined" && status === "Checking") {
          studentTask[taskName].color = "pink";
        }
        else if (score === "undefined" && status === "Checked") {
          studentTask[taskName].color = "red";
        }
      }
    }
  }
  return mentors;
}

fs.writeFile('./result-json/result.json', JSON.stringify(getColorForDraw(), 0, 2), function(){});