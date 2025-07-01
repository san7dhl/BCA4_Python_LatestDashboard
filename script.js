let students = [];
const studentList = document.getElementById("studentList");
const dashboard = document.getElementById("dashboardContent");

// Fetch student data from students.json
fetch("students.json")
  .then((response) => response.json())
  .then((data) => {
    students = data;
    populateStudentList();
  })
  .catch((error) => console.error("Error loading student data:", error));

// Populate the student list
function populateStudentList() {
  studentList.innerHTML = "";
  students.forEach((student) => {
    const li = document.createElement("li");
    li.textContent = student.name;
    li.style.padding = "8px";
    li.style.cursor = "pointer";
    li.style.borderBottom = "1px solid #ccc";
    li.onclick = () => showStudent(student.id);
    studentList.appendChild(li);
  });
}

function filterStudents() {
  const search = document.getElementById("studentSearch").value.toLowerCase();
  const lis = studentList.getElementsByTagName("li");
  Array.from(lis).forEach((li) => {
    li.style.display = li.textContent.toLowerCase().includes(search)
      ? ""
      : "none";
  });
}

function showStudent(studentId) {
  const student = students.find((s) => s.id === studentId);
  if (!student) return;

  dashboard.innerHTML = `
        <h2>${student.name}'s Dashboard</h2>

        <div class="summary-cards">
            <div class="card">
                <h3>Concept Attendance</h3>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${
                      student.attConcept
                    }%; background: ${getColor(student.attConcept)};">
                        ${student.attConcept}%
                    </div>
                </div>
            </div>
            <div class="card">
                <h3>Applied Attendance</h3>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${
                      student.attApplied
                    }%; background: ${getColor(student.attApplied)};">
                        ${student.attApplied}%
                    </div>
                </div>
            </div>
            <div class="card">
                <h3>Concept Marks</h3>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${
                      student.marksConcept * 2
                    }%; background: ${getColor(student.marksConcept * 2)};">
                        ${student.marksConcept}/50
                    </div>
                </div>
            </div>
            <div class="card">
                <h3>Applied Marks</h3>
                <div class="progress-container">
                    <div class="progress-bar" style="width: ${
                      student.marksApplied * 2.5
                    }%; background: ${getColor(student.marksApplied * 2.5)};">
                        ${student.marksApplied}/40
                    </div>
                </div>
            </div>
        </div>

        <div class="charts">
            <div class="chart-box">
                <h4>Radar Chart - Overall Comparison</h4>
                <div id="radarChart"></div>
            </div>
            <div class="chart-box">
                <h4>Attendance Comparison</h4>
                <div id="attendanceChart"></div>
            </div>
        </div>
    `;

  // Recommended Actions Based on Concept Marks
  if (student.marksConcept < 25) {
    showActions(
      `Your Concept Marks show that you need to strengthen your basics. Don’t worry, with consistent effort you will improve.`,
      [
        "Revise Python fundamentals daily for 30 minutes.",
        "Watch beginner-friendly videos like Python for Beginners by Mosh.",
        "Practice small coding examples after studying concepts.",
        "Attempt all quizzes and practice tests — they help reinforce your understanding.",
        "Ask me for extra explanation anytime — I am happy to help.",
        "Discuss concepts with classmates to build confidence.",
      ]
    );
  } else if (student.marksConcept < 35) {
    showActions(
      `You have some understanding of concepts, but more consistent practice will help you improve your confidence and marks.`,
      [
        "Spend 20 to 30 minutes daily on short quizzes and exercises.",
        "Revise key topics like loops, conditions, and functions.",
        "Work on your presentation in tests — structure your answers.",
        "Identify weak areas from past quizzes and ask me for help.",
        "Participate actively in class and ask doubts freely.",
      ]
    );
  } else if (student.marksConcept < 45) {
    showActions(
      `Good progress! You understand the concepts reasonably well. Now is the time to polish your skills and aim higher.`,
      [
        "Revise advanced topics like error handling, file operations, and functions.",
        "Attempt slightly more challenging coding problems.",
        "Focus on writing neat, well-presented answers in exams.",
        "Join peer discussions to sharpen your understanding.",
        "Review small mistakes in past assessments to avoid them.",
      ]
    );
  } else {
    showActions(
      `Excellent work! Your Concept Marks reflect a strong understanding. Keep practicing to stay consistent and aim for full marks.`,
      [
        "Keep revising all topics regularly to stay confident.",
        "Attempt higher-level coding challenges from platforms like HackerRank.",
        "Help classmates if possible — explaining to others strengthens your own concepts.",
        "Focus on applying concepts in projects or real-world problems.",
        "Prepare well for theory exams to convert your understanding into full marks.",
      ]
    );
  }

  renderRadarChart(student);
  renderAttendanceChart(student);
}

function showActions(intro, steps) {
  let actionsHTML = `
        <div class="action-steps">
            <h3>Recommended Actions for You</h3>
            <p>${intro}</p>
            <ul>
    `;
  steps.forEach((step) => {
    actionsHTML += `<li>${step}</li>`;
  });
  actionsHTML += `</ul></div>`;
  dashboard.innerHTML += actionsHTML;
}

function getColor(percent) {
  if (percent >= 75) return "#4caf50";
  if (percent >= 50) return "#ffb300";
  return "#e53935";
}

function renderRadarChart(student) {
  const data = [
    {
      type: "scatterpolar",
      r: [
        student.attConcept,
        student.attApplied,
        student.marksConcept * 2,
        student.marksApplied * 2.5,
      ],
      theta: [
        "Concept Attendance",
        "Applied Attendance",
        "Concept Marks",
        "Applied Marks",
      ],
      fill: "toself",
      name: student.name,
    },
  ];

  const layout = {
    polar: { radialaxis: { visible: true, range: [0, 100] } },
    showlegend: false,
    margin: { t: 20, b: 20 },
  };

  Plotly.newPlot("radarChart", data, layout, { displayModeBar: false });
}

function renderAttendanceChart(student) {
  const data = [
    {
      x: ["Concept", "Applied"],
      y: [student.attConcept, student.attApplied],
      type: "bar",
      marker: { color: ["#00acc1", "#00acc1"] },
    },
  ];

  const layout = {
    yaxis: { title: "Attendance %", range: [0, 100] },
    margin: { t: 20, b: 50 },
  };

  Plotly.newPlot("attendanceChart", data, layout, { displayModeBar: false });
}
