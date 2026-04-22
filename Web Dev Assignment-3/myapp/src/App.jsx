import { useState } from "react";
import "./App.css";
import Header from "./components/Header";
import AddStudentForm from "./components/AddStudentForm";
import StudentTable from "./components/StudentTable";

function App() {
  const [students, setStudents] = useState([
    { id: 1, name: "Lakshay", marks: 80 },
    { id: 2, name: "Faizan", marks: 85 },
    { id: 3, name: "Anuroop", marks: 100 },
    { id: 4, name: "Akshit", marks: 69 },
    { id: 5, name: "Gaurav", marks: 30 }

  ]);

  const addStudent = (name, marks) => {
    const newStudent = {
      id: Date.now(),
      name,
      marks: Number(marks)
    };
    setStudents([...students, newStudent]);
  };

  const updateMarks = (id, newMarks) => {
    const updated = students.map((stu) =>
      stu.id === id ? { ...stu, marks: Number(newMarks) } : stu
    );
    setStudents(updated);
  };

  const total = students.reduce((sum, s) => sum + s.marks, 0);
  const average = students.length ? (total / students.length).toFixed(2) : 0;
  const passed = students.filter((s) => s.marks >= 40).length;
  const failed = students.length - passed;

  const topperMarks =
    students.length > 0
      ? Math.max(...students.map((s) => s.marks))
      : 0;

  return (
    <div className="container">
      <Header />

      <div className="card">
        <AddStudentForm addStudent={addStudent} />
      </div>

      <div className="stats">
        <div className="stat-box">Total: {total}</div>
        <div className="stat-box">Avg: {average}</div>
        <div className="stat-box pass">Passed: {passed}</div>
        <div className="stat-box fail">Failed: {failed}</div>
      </div>

      <div className="card">
        <StudentTable
          students={students}
          updateMarks={updateMarks}
          topperMarks={topperMarks}
        />
      </div>
    </div>
  );
}

export default App;