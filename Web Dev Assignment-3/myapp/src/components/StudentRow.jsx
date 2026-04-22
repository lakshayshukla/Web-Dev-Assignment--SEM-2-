function StudentRow({ student, updateMarks, topperMarks }) {
  const isPass = student.marks >= 40;
  const isTopper = student.marks === topperMarks;

  return (
    <tr className={isTopper ? "topper" : ""}>
      <td>
        {student.name} {isTopper && "🏆"}
      </td>

      <td>
        <input
          type="number"
          value={student.marks}
          onChange={(e) =>
            updateMarks(student.id, e.target.value)
          }
        />
      </td>

      <td>
        <div className="progress-container">
          <div
            className={`progress-bar ${isPass ? "pass-bar" : "fail-bar"}`}
            style={{ width: `${student.marks}%` }}
          >
            {student.marks}
          </div>
        </div>
      </td>

      <td className={isPass ? "pass" : "fail"}>
        {isPass ? "Pass" : "Fail"}
      </td>
    </tr>
  );
}
export default StudentRow;