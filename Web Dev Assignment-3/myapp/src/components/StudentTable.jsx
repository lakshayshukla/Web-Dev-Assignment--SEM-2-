import StudentRow from "./StudentRow";

function StudentTable({ students, updateMarks, topperMarks }) {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Marks</th>
          <th>Progress</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        {students.map((stu) => (
          <StudentRow
            key={stu.id}
            student={stu}
            updateMarks={updateMarks}
            topperMarks={topperMarks}
          />
        ))}
      </tbody>
    </table>
  );
}
export default StudentTable;