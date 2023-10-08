import React from "react";

import { useState } from "react";
import { useEffect } from "react";
import {
  collection,
  getDocs,
  setDoc,
  doc,
  deleteDoc,
  onSnapshot,
  updateDoc,
} from "firebase/firestore";
import { firestore } from "../../Config/Firebase";

const initialState = { name: "", phonenumber: "", coursename: "" };

const AddStudent = () => {
  const [state, setState] = useState(initialState);
  const [isLoading, setIsLoading] = useState(false);
  const [student, setStudent] = useState([]);
  const [studentForedit, setStudentForedit] = useState({});
  const [user, setUser] = useState({});
  const [search, setSearch] = useState("");
  const [sortByAgeAsc, setSortByAgeAsc] = useState(true);

  const [courses, setCourses] = useState([]);
  

  const onReadCourse = async () => {
    const array = [];
    const querySnapshot = await getDocs(collection(firestore, "course"));
    querySnapshot.forEach((doc) => {
      // console.log(`${doc.id} => ${doc.data()}`);
      const data = doc.data();
      array.push(data);
      data["id"] = doc.id;
      console.log(data);
     
    });
    setCourses(array);
    console.log(typeof state);
    console.log(courses.courseId);
    console.log(courses.coursename);

    
    
  };

  useEffect(() => {
    onReadCourse();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();

    let { name, phonenumber, coursename } = state;

    name = name.trim();
    coursename = coursename.trim();
    phonenumber = Number(phonenumber);

    if (name.length < 4) {
      window.toastify(`Name length is short`, "error");
      return;
    }
    if (coursename.length < 2) {
      window.toastify(`Enter Correct Course Name`, "error");
      return;
    }
    if (phonenumber < 11) {
      window.toastify(`Invalid PhoneNumber Entered`, "error");
      return;
    }
    setIsLoading(true);
    let studentsId = Math.random().toString(36).slice(2);
    let formData = { name, coursename, phonenumber, studentsId };

    try {
      await setDoc(doc(firestore, "student", studentsId), formData);
      console.log("Document written with ID: ", studentsId);
      window.toastify(`Document written with ID: ${studentsId}`, "success");
    } catch (e) {
      console.error("Error adding document: ", e);
      window.toastify(`Error adding document: ${e.message}`, "error");
    }
    setIsLoading(false);

    setState(...studentsId, formData);

    resetForm();
  };
  const resetForm = () => {
    setState(initialState);
  };

  const handleChange = (e) => {
    setState({ ...state, [e.target.name]: e.target.value });
  };
  return (
    <>
      <main>
        <section id="facts" class="facts">
          <div class="container">
            <div class="section-title text-center">
              <button
                className="btn btn-sm btn-info "
                data-bs-toggle="modal"
                data-bs-target="#studentModal"
              >
                Add Student
              </button>
            </div>
          </div>
        </section>
      </main>

      {/*Student Modal */}
      <div className="modal fade" id="studentModal">
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header">
              <h5 className="modal-title">Add Student</h5>

              <button
                type="button"
                className="btn-close"
                data-bs-dismiss="modal"
                aria-label="Close"
              ></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="row mb-3">
                <div className="col">
                  <input
                    type="text"
                    className="form-control"
                    placeholder="Name"
                    name="name"
                    value={state.name}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <input
                    type="number"
                    className="form-control"
                    placeholder="PhoneNumber"
                    name="phonenumber"
                    value={state.phonenumber}
                    onChange={handleChange}
                  />
                </div>
              </div>
              <div className="row mb-3">
                <div className="col">
                  <select
                    onChange={handleChange}
                    name="coursename"
                    required
                    class="form-select"
                    aria-label="Courses"
                  >
                    <option selected>Select Course</option>
                    {courses.map((course, i) => {
                      return (
                        <option value={course.coursename}>
                          {course.coursename}
                        </option>
                      );
                    })}
                    
                  </select>
                </div>
              </div>

              <div className="row">
                <div className="col text-center">
                  <button className="btn btn-success w-50">
                    {!isLoading ? (
                      <span>Add Student</span>
                    ) : (
                      <div className="text-center">
                        <div className="spinner-border "></div>
                      </div>
                    )}
                  </button>
                </div>
              </div>
            </form>

            <div className="modal-footer"></div>
          </div>
        </div>
      </div>
    </>
  );
};

export default AddStudent;
