import React, { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  setDoc,
  deleteDoc,
} from 'firebase/firestore';
import { firestore } from '../../../Config/Firebase';

const ShowAttendance = () => {
  const [students, setStudents] = useState([]);
  const [attendanceRecords, setAttendanceRecords] = useState([]);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [isLoading, setIsLoading] = useState(false);

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
      setIsLoading(true);
      const formattedDate = selectedDate.toISOString().split('T')[0];
      const attendanceQuery = query(
        collection(firestore, 'attendance'),
        where('date', '==', formattedDate)
      );
      const querySnapshot = await getDocs(attendanceQuery);
      const attendanceList = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setAttendanceRecords(attendanceList);
      setIsLoading(false);
    };

    fetchAttendanceRecords();
  }, [selectedDate]);

  const handleDateChange = (e) => {
    setSelectedDate(new Date(e.target.value));
  };

  const handleToggleAttendance = async (studentId, isChecked) => {
    const formattedDate = selectedDate.toISOString().split('T')[0];
    const attendanceRef = doc(firestore, 'attendance', `${formattedDate}-${studentId}`);

    if (isChecked) {
      try {
        await setDoc(attendanceRef, {
          studentId,
          date: formattedDate,
        });
      } catch (error) {
        console.error('Error marking attendance: ', error);
      }
    } else {
      // If the checkbox is unchecked, delete the attendance record
      try {
        await deleteDoc(attendanceRef);
      } catch (error) {
        console.error('Error deleting attendance record: ', error);
      }
    }
  };

  const getAttendanceStatus = (studentId) => {
    return attendanceRecords.some((record) => record.studentId === studentId)
      ? 'Present'
      : 'Absent';
  };

  return (
    <div>
      <main className='section-title text-center'>
        <h2>Student Attendance Details</h2>
        <div className="form-group">
          <input
            type="date"
            id="date"
            className="form-control"
            value={selectedDate.toISOString().split('T')[0]}
            onChange={handleDateChange}
          />
        </div>
        {isLoading ? (
          <p>Loading...</p>
        ) : (
          <table className="table table-striped">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Course Title</th>
                <th>Attendance Status</th>
              </tr>
            </thead>
            <tbody>
              {students.map((student) => (
                <tr key={student.id}>
                  <td>{student.name}</td>
                  <td>{student.coursename}</td>
                  <td>{getAttendanceStatus(student.id)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </main>
    </div>
  );
};

export default ShowAttendance;
