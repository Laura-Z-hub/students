const studentsDiv = document.getElementById("students");

async function loadStudents() {
  studentsDiv.innerHTML = "Duke u ngarkuar...";

  try {
    const response = await fetch("/api/students");

    if (!response.ok) {
      throw new Error("Nuk u moren te dhenat");
    }

    const students = await response.json();

    if (students.length === 0) {
      studentsDiv.innerHTML = "Nuk ka studente ne databaze.";
      return;
    }

    studentsDiv.innerHTML = students
      .map(
        (student) => `
          <div class="student">
            <h3>${student.name}</h3>
            <p>Mosha: ${student.age} vjeç</p>
          </div>
        `
      )
      .join("");
  } catch (error) {
    studentsDiv.innerHTML = `
      <div class="error">
        Gabim gjatë marrjes së të dhënave nga databaza.
      </div>
    `;
  }
}

loadStudents();