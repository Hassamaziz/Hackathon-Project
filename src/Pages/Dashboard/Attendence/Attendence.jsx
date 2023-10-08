import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  updateDoc,
} from 'firebase/firestore';
import { firestore } from '../../../Config/Firebase';

const Attendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attendanceStatus, setAttendanceStatus] = useState({});

  useEffect(() => {
    const fetchStudents = async () => {
      const querySnapshot = await getDocs(collection(firestore, 'student'));
      const studentList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setStudents(studentList);
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    const fetchAttendanceRecords = async () => {
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const attendanceQuery = query(
        collection(firestore, 'attendance'),
        where('date', '==', formattedDate)
      );
      const querySnapshot = await getDocs(attendanceQuery);
      const attendanceList = {};
      querySnapshot.docs.forEach((doc) => {
        const data = doc.data();
        attendanceList[data.studentId] = data.status;
      });
      setAttendanceRecords(attendanceList);
    };

    fetchAttendanceRecords();
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleAttendanceChange = async (studentId, status) => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const attendanceRef = doc(firestore, 'attendance', `${formattedDate}-${studentId}`);

    try {
      if (attendanceRecords[studentId]) {
        // Update the existing attendance record
        await updateDoc(attendanceRef, {
          status,
        });
      } else {
        // Create a new attendance record
        await setDoc(attendanceRef, {
          studentId,
          date: formattedDate,
          status,
        });
      }
      setAttendanceStatus({
        ...attendanceStatus,
        [studentId]: status,
      });
    } catch (error) {
      console.error('Error updating attendance: ', error);
    }
  };

  return (
    <main>
      <div className="container mt-5">
        <div className="row section-title text-center">
          <h2>Student Attendance</h2>
          <div className="form-group">
            <input
              type="date"
              id="date"
              className="form-control"
              value={selectedDate.toISOString().split('T')[0]}
              onChange={handleDateChange}
            />
          </div>
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Course Name</th>
                <th>Attendance</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.coursename}</td>
                  <td>
                    <select
                      value={attendanceStatus[student.id] || 'absent'}
                      onChange={(e) =>
                        handleAttendanceChange(student.id, e.target.value)
                      }
                    >
                      <option value="present">Present</option>
                      <option value="absent">Absent</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </main>
  );
};

export default Attendance;
