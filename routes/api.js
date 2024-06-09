const express = require('express');
const router = express.Router();
const {Edupage} = require('edupage-api');
const edupage = new Edupage();

// This parses the timeline in a way where only the important stuff is left.
function parseTimeline(arr) {
    arr.sort((a, b) => new Date(b.creationDate) - new Date(a.creationDate));
    const slice = arr.slice(0, 25);
    const filter = slice.filter(obj => obj.type !== "homework");
    return filter.map(obj => {
        const merge = {
            type: obj.type,
            title: obj.title,
            text: obj.text,
        }; // I'm aware that a fixed amount of attachments is a bad idea.
        if (obj.attachments[0]) {
            merge.attachmentName = obj.attachments[0].name;
            merge.attachmentSrc = obj.attachments[0].src;
        }
        if (obj.attachments[1]) {
            merge.attachmentName = obj.attachments[1].name;
            merge.attachmentSrc = obj.attachments[1].src;
        }
        if (obj.attachments[2]) {
            merge.attachmentName = obj.attachments[2].name;
            merge.attachmentSrc = obj.attachments[2].src;
        }
        return merge
    })
}

// This sorts the grades into a prettier format.
// Due to EduPage reasons, this does not work with point based (points out of max. points) grade systems.
// Point based systems only return the points you've gotten, not the maximum.
function collectGrades(arr) {
    const grouped = arr.reduce((acc, item) => {
        if (!acc[item.subject.name]) {
            acc[item.subject.name] = [];
        }
        const grade = Number(item.value);
        const weight = Number(item.weight);
        if (!isNaN(grade)) {
            acc[item.subject.name].push({ grade, weight });
        }
        return acc;
    }, {});
    return Object.keys(grouped).map(name => {
        const gradesWithWeights = grouped[name];
        const totalWeightedGrades = gradesWithWeights.reduce((sum, item) => sum + item.grade * item.weight, 0);
        const totalWeights = gradesWithWeights.reduce((sum, item) => sum + item.weight, 0);
        const averageGrade = totalWeights ? totalWeightedGrades / totalWeights : 0;
        const realAvg = averageGrade.toFixed(2);

        return {
            name,
            grades: gradesWithWeights,
            averageGrade: realAvg
        }
    });
}

// get all route, this fetches all things it can
router.post('/all', async (req, res) => {
    const username = req.body.username;
    const password = req.body.password;
    try {
        if (!username || !password) {
            res.status(400).json({message: `Invalid username or password`});
        }
        try {
            await edupage.login(username, password);
        } catch(error) {
            res.status(400).json({message: `Invalid username or password`});
        }
        const date = new Date();
        const dateTomorrow = new Date(Date.now() + 24 * 60 * 60 * 1000);

        const timetable = edupage.getTimetableForDate(date);
        const timetableTomorrow = edupage.getTimetableForDate(dateTomorrow);
        const gradesRaw = edupage.grades.reverse(); // trust, this is better reversed :P
        const lessons = timetable.lessons;
        const assignmentsRaw = lessons.reduce((arr, lesson) => (arr.push(...lesson.assignments), arr), []);
        const assignments = assignmentsRaw.map(item => ({
            short: item.subject.short,
            name: item.subject.name,
            desc: item.title
        }));
        const lessonsTomorrow = timetableTomorrow.lessons
        const assignmentsRawTomorrow = lessonsTomorrow.reduce((arr, lesson) => (arr.push(...lesson.assignments), arr), []);
        const assignmentsTomorrow = assignmentsRawTomorrow.map(item => ({
            short: item.subject.short,
            name: item.subject.name,
            desc: item.title
        }));
        const timeline = parseTimeline(edupage.timelineItems);
        const grades = collectGrades(gradesRaw);
        res.status(200).json({ // remember how the README said this is not production ready code? i wan't lying :D
            username: username, // for confirmation
            timetable: {
                today: {
                    1:{
                        name: timetable.lessons[0] ? timetable.lessons[0].subject.name : '-',
                        short: timetable.lessons[0] ? timetable.lessons[0].subject.short : '-',
                        time: "8:00"
                    },
                    2:{
                        name: timetable.lessons[1] ? timetable.lessons[1].subject.name : '-',
                        short: timetable.lessons[1] ? timetable.lessons[1].subject.short : '-',
                        time: "8:55"
                    },
                    3:{
                        name: timetable.lessons[2] ? timetable.lessons[2].subject.name : '-',
                        short: timetable.lessons[2] ? timetable.lessons[2].subject.short : '-',
                        time: "9:50"
                    },
                    4:{
                        name: timetable.lessons[3] ? timetable.lessons[3].subject.name : '-',
                        short: timetable.lessons[3] ? timetable.lessons[3].subject.short : '-',
                        time: "10:45"
                    },
                    5:{
                        name: timetable.lessons[4] ? timetable.lessons[4].subject.name : '-',
                        short: timetable.lessons[4] ? timetable.lessons[4].subject.short : '-',
                        time: "11:50"
                    },
                    6:{
                        name: timetable.lessons[5] ? timetable.lessons[5].subject.name : '-',
                        short: timetable.lessons[5] ? timetable.lessons[5].subject.short : '-',
                        time: "12:45"
                    },
                    7:{
                        name: timetable.lessons[6] ? timetable.lessons[6].subject.name : '-',
                        short: timetable.lessons[6] ? timetable.lessons[6].subject.short : '-',
                        time: "14:00"
                    }
                },
                tomorrow: {
                    1:{
                        name: timetableTomorrow.lessons[0] ? timetableTomorrow.lessons[0].subject.name : '-',
                        short: timetableTomorrow.lessons[0] ? timetableTomorrow.lessons[0].subject.short : '-',
                        time: "8:00"
                    },
                    2:{
                        name: timetableTomorrow.lessons[1] ? timetableTomorrow.lessons[1].subject.name : '-',
                        short: timetableTomorrow.lessons[1] ? timetableTomorrow.lessons[1].subject.short : '-',
                        time: "8:55"
                    },
                    3:{
                        name: timetableTomorrow.lessons[2] ? timetableTomorrow.lessons[2].subject.name : '-',
                        short: timetableTomorrow.lessons[2] ? timetableTomorrow.lessons[2].subject.short : '-',
                        time: "9:50"
                    },
                    4:{
                        name: timetableTomorrow.lessons[3] ? timetableTomorrow.lessons[3].subject.name : '-',
                        short: timetableTomorrow.lessons[3] ? timetableTomorrow.lessons[3].subject.short : '-',
                        time: "10:45"
                    },
                    5:{
                        name: timetableTomorrow.lessons[4] ? timetableTomorrow.lessons[4].subject.name : '-',
                        short: timetableTomorrow.lessons[4] ? timetableTomorrow.lessons[4].subject.short : '-',
                        time: "11:50"
                    },
                    6:{
                        name: timetableTomorrow.lessons[5] ? timetableTomorrow.lessons[5].subject.name : '-',
                        short: timetableTomorrow.lessons[5] ? timetableTomorrow.lessons[5].subject.short : '-',
                        time: "12:45"
                    },
                    7:{
                        name: timetableTomorrow.lessons[6] ? timetableTomorrow.lessons[6].subject.name : '-',
                        short: timetableTomorrow.lessons[6] ? timetableTomorrow.lessons[6].subject.short : '-',
                        time: "14:00"
                    }
                },
            },
            timeline,
            assignments: {
                assignments,
                assignmentsTomorrow
            },
            grades
        });
        edupage.exit(); // almost forgot this
    } catch (error) {
        console.error(error);
    }
});

process.on('uncaughtException', (error) => {
    console.log("The node process is now in an undefined state, it can run but it's recommended to restart it, error:\n")
    console.error(error);
});

module.exports = router;