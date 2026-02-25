import type Student from "../types/studentType";

const fakeDelay = (ms: number) =>
  new Promise(resolve => setTimeout(resolve, ms));

const dummyStudents: Student[] = [
  { nisn: "20240012", name: "Ahmad Fauzan", class: "TI-2A", attendance: false },
  { nisn: "20240055", name: "Budi Hartono", class: "TK-3B", attendance: false },
  { nisn: "20240098", name: "Citra Lestari", class: "AK-1C", attendance: false },
];

export const attendanceService = {
  async checkAttendance(students: Student[], nisn: string): Promise<{
    status: "NOT_FOUND" | "ALREADY_ATTEND" | "SUCCESS";
    student?: Student;
    updatedStudents?: Student[];
  }> {

    await fakeDelay(800);

    const foundStudent = students.find(s => s.nisn === nisn);

    if (!foundStudent) {
      return { status: "NOT_FOUND" };
    }

    if (foundStudent.attendance) {
      return { status: "ALREADY_ATTEND", student: foundStudent };
    }

    const updatedStudents = students.map(student =>
      student.nisn === nisn
        ? { ...student, attendance: true }
        : student
    );

    return {
      status: "SUCCESS",
      student: foundStudent,
      updatedStudents
    };
  },

  async getStudents(): Promise<Student[]> {
    await fakeDelay(500);
    return JSON.parse(JSON.stringify(dummyStudents));
  }

};