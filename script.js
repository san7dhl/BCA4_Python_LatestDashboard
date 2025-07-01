fetch("students.json")
  .then((response) => response.json())
  .then((data) => {
    window.students = data;
    populateDropdown(data);
  })
  .catch((err) => console.error("Error loading student data", err));

function populateDropdown(students) {
  const studentSelect = document.getElementById("studentSelect");
  students.forEach((s) => {
    const option = document.createElement("option");
    option.value = s.id;
    option.textContent = s.name;
    studentSelect.appendChild(option);
  });
}

function getProgressColor(percent) {
  if (percent >= 75) return "#4caf50"; // Green
  if (percent >= 50) return "#ffb300"; // Amber
  return "#e53935"; // Red
}

function generateActionSteps(student) {
  let strengths = [];
  let improve = [];
  let todo = [];

  // Strengths
  if (student.attConcept >= 75)
    strengths.push(
      "Your Concept Attendance is excellent. Keep attending regularly."
    );
  if (student.attApplied >= 75)
    strengths.push("Your Applied Attendance is consistent. Good effort.");
  if (student.marksConcept >= 30)
    strengths.push("Your Concept Marks show satisfactory understanding.");
  if (student.marksApplied >= 30)
    strengths.push("Your Applied Marks indicate good application of concepts.");

  // Areas to Improve
  if (student.attConcept < 75)
    improve.push(
      "Your Concept Attendance is below recommended level. This can affect understanding."
    );
  if (student.attApplied < 75)
    improve.push(
      "Your Applied Attendance is low. Missing sessions affects practical learning."
    );
  if (student.marksConcept < 30)
    improve.push(
      "Your Concept Marks need improvement. Theory exams depend on this."
    );
  if (student.marksApplied < 30)
    improve.push(
      "Your Applied Marks suggest you need more practice with application problems."
    );

  // To-Do Now
  if (student.attConcept < 75)
    todo.push(
      "Attend all Concept sessions regularly to strengthen your basics."
    );
  if (student.attApplied < 75)
    todo.push("Be consistent with Applied sessions. Practice is key.");
  if (student.marksConcept < 30)
    todo.push(
      "Spend at least 30 minutes daily revising Concept topics. You can ask your faculty for extra time if needed."
    );
  if (student.marksApplied < 30)
    todo.push(
      "Attempt Applied practice questions regularly to boost your marks."
    );

  todo.push(
    "Make use of platforms like HackerRank or LeetCode to sharpen your programming skills."
  );
  todo.push(
    "Prepare well for the upcoming theory exams. Clear presentation helps improve marks."
  );

  let html = `
        <strong>Strengths:</strong><ul>${strengths
          .map((s) => `<li>${s}</li>`)
          .join("")}</ul>
        <strong>Areas to Improve:</strong><ul>${improve
          .map((s) => `<li>${s}</li>`)
          .join("")}</ul>
        <strong>To-Do Now:</strong><ul>${todo
          .map((s) => `<li>${s}</li>`)
          .join("")}</ul>
    `;

  return html;
}

function showStudent() {
  const id = document.getElementById("studentSelect").value;
  const student = window.students.find((s) => s.id == id);
  const content = document.getElementById("dashboardContent");

  if (!student) {
    content.innerHTML =
      "<p>Please select a student to view their dashboard.</p>";
    return;
  }

  content.innerHTML = `
        <h2>Welcome, ${student.name}</h2>
        
        <div class="summary-cards">
            <div class="card"><h3>Concept Attendance</h3>${
              student.attConcept
            }%</div>
            <div class="card"><h3>Applied Attendance</h3>${
              student.attApplied
            }%</div>
            <div class="card"><h3>Concept Marks</h3>${
              student.marksConcept
            }/50</div>
            <div class="card"><h3>Applied Marks</h3>${
              student.marksApplied
            }/50</div>
        </div>

        <h3>Progress</h3>
        <div class="progress-container">
            <div class="progress-bar" style="width:${
              student.attConcept
            }%; background:${getProgressColor(student.attConcept)}">
                ${student.attConcept}% Concept Attendance
            </div>
        </div>
        <div class="progress-container">
            <div class="progress-bar" style="width:${
              student.attApplied
            }%; background:${getProgressColor(student.attApplied)}">
                ${student.attApplied}% Applied Attendance
            </div>
        </div>
        <div class="progress-container">
            <div class="progress-bar" style="width:${
              (student.marksConcept / 50) * 100
            }%; background:${getProgressColor(
    (student.marksConcept / 50) * 100
  )}">
                ${student.marksConcept} Concept Marks
            </div>
        </div>
        <div class="progress-container">
            <div class="progress-bar" style="width:${
              (student.marksApplied / 50) * 100
            }%; background:${getProgressColor(
    (student.marksApplied / 50) * 100
  )}">
                ${student.marksApplied} Applied Marks
            </div>
        </div>

        <div class="charts">
            <div class="chart-box">
                <h3>Overall Performance (Radar Chart)</h3>
                <div id="radarChart"></div>
            </div>
            <div class="chart-box">
                <h3>Attendance Comparison</h3>
                <div id="attendanceChart"></div>
            </div>
        </div>

        <div class="action-steps">
            <h3>Recommended Actions</h3>
            ${generateActionSteps(student)}
        </div>
    `;

  Plotly.newPlot(
    "radarChart",
    [
      {
        type: "scatterpolar",
        r: [
          student.attConcept,
          student.attApplied,
          (student.marksConcept / 50) * 100,
          (student.marksApplied / 50) * 100,
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
    ],
    {
      polar: { radialaxis: { visible: true, range: [0, 100] } },
      showlegend: false,
    }
  );

  Plotly.newPlot(
    "attendanceChart",
    [
      {
        x: ["Concept Attendance", "Applied Attendance"],
        y: [student.attConcept, student.attApplied],
        type: "bar",
        marker: { color: ["#00acc1", "#4caf50"] },
      },
    ],
    {
      yaxis: { title: "Percentage", range: [0, 100] },
      title: "Attendance Comparison",
    }
  );
}
