import initialize from './config/firebase.js';
import { login, register } from './authentication.js';
import { dashboard, classroom, subject } from './menu.js';
import { examStudent } from './exam.js';
import student from './student.js';
import scoring from './scoring.js';
import exam from './exam.js';
import displayLogo from './authentication.js';
// * Menyingkat function document.body.id menjadi page, digunakan untuk,
// * mengambil nama page yang ada di element body
const page = document.body.id;
// * Username variable, mengambil element div username di page dashboard, dan,
// * untuk input hidden di page classroom dan subject.
const usernames = document.getElementById('usernames');

// * List of pages, codes are only executed when the page is shown.
switch (page) {
  case login.page: // Login App
    const btnLogin = document.getElementById('btnLogin');
    displayLogo();
    login.sessionCheck();

    btnLogin.addEventListener('click', () => {
      login.init();
    });
    break;

  case register.page:// Register App
    const btnRegister = document.getElementById('btnRegister');
    displayLogo();

    btnRegister.addEventListener('click', () => {
      // * Function registrasi sebuah akun, terdapat di dalam file ./js/authentication.js
      // * dengan object bernama register dan function init()
      register.init();
    });
    break;

  case dashboard.page:
    const date = new Date();
    const btnLogout = document.getElementById('btnLogout');
    const requestTime = date.getTime();
    /** 
     * * function displayProfile -> mengambil avatar pada firebase storage,
     * * ditampilkan pada page dashboard dengan tag img
     * * function sessionCheck -> melihat session dari sebuah otentikasi, jika user,
     * * masih login ke dalam sisterm, halaman akan diredirect ke menu.html
     */
    dashboard.displayProfile();
    dashboard.sessionCheck(usernames, requestTime);

    btnLogout.addEventListener('click', () => {
      dashboard.logout();
    });
    break;

  case classroom.page:
    const btnClass = document.getElementById('btnClass');
    const btnEditClass = document.getElementById('btnEditClass');
    classroom.sessionCheck(usernames);

    btnEditClass.addEventListener('click', () => {
      const id = document.getElementById('modal-classid');
      const fill = document.getElementById('modal-classname');

      document.getElementById('showClass').innerHTML = '';
      classroom.editClass(usernames.value, id.value, fill.value);
    });

    btnClass.addEventListener('click', () => {
      // * Mengambil value dari prompt yang sudah diisi, data lalu disimpan dalam variable fill
      const fill = prompt('Please enter the name of the class.', '');

      if (fill == null || fill === '') {

      } else {
        document.getElementById('showClass').innerHTML = '';
        // * function addClass -> melakukan create ke dalam firebase realtime database (child classroom),
        // * memiliki 2 parameter yang dikirimkan yaitu, username itu sendiri dan primary key
        classroom.addClass(usernames.value, fill);
      }
    });
    break;

  case subject.page:
    const btnSubject = document.getElementById('btnSubject');
    const btnEditSubject = document.getElementById('btnEditSubject');
    const btnDelSubject = document.getElementById('btnDelSubject');
    subject.sessionCheck(usernames);

    btnEditSubject.addEventListener('click', () => {
      const id = document.getElementById('modal-subjectid');
      const fill = document.getElementById('modal-subjectname');

      document.getElementById('showSubject').innerHTML = '';
      subject.editSubject(usernames.value, id.value, fill.value);
    });

    btnDelSubject.addEventListener('click', () => {
      const confirmation = document.getElementById('modal-subjectC');
      const id = document.getElementById('modal-subjectdelid');

      if (confirmation.value === 'delete') {
        document.getElementById('showSubject').innerHTML = '';
        subject.deleteSubject(usernames.value, id.value);
      } else {
        console.log('Data tidak terhapus');
      }
    });

    btnSubject.addEventListener('click', () => {
      const fill = prompt('Please enter the subject.', '');
      if (fill == null || fill === '') {

      } else {
        document.getElementById('showSubject').innerHTML = '';
        // * function addSubject -> melakukan create ke dalam firebase realtime database (child subject),
        // * memiliki 2 parameter yang dikirimkan yaitu, username itu sendiri dan primary key
        // * yang digenerate otomatis oleh firebase database
        subject.addSubject(usernames.value, fill);
      }
    });
    break;

  case student.page:
    const btnStudent = document.getElementById('btnStudent');
    const btnEditStudent = document.getElementById('btnEditStudent');
    const btnDelStudent = document.getElementById('btnDelStudent');
    const queryString = window.location.search;
    const urlParams = new URLSearchParams(queryString);
    const idClass = urlParams.get('id');
    student.sessionCheck(usernames, idClass);

    btnEditStudent.addEventListener('click', () => {
      const id = document.getElementById('modal-studentid');
      const fill = document.getElementById('modal-studentname');
      document.getElementById('showStudent').innerHTML = '';
      student.editStudent(usernames.value, idClass, id.value, fill.value);
    });

    btnDelStudent.addEventListener('click', () => {
      const confirmation = document.getElementById('modal-studentC');
      const id = document.getElementById('modal-studentdelid');

      if (confirmation.value === 'delete') {
        document.getElementById('showStudent').innerHTML = '';
        student.deleteStudent(usernames.value, idClass, id.value);
      } else {
        console.log('Data siswa tidak dapat dihapus');
      }
    });

    btnStudent.addEventListener('click', () => {
      const fill = prompt('Please enter the name of a student.', '');
      if (fill == null || fill === '') {

      } else {
        document.getElementById('showStudent').innerHTML = '';
        student.addStudent(usernames.value, idClass, fill);
      }
    });
    break;


  case exam.page:
    const btnAddExam = document.getElementById('btnAddExam');
    const btnAnswerKey = document.getElementById('btnAnswerKey');
    const btnEditKey = document.getElementById('btnEditKey');
    const totalQuestion = document.getElementById('total_q');
    const totalQuestionEdited = document.getElementById('total_qs');
    const examidEdited = document.getElementById('examids');
    const examid = document.getElementById('examid');
    const examname = document.getElementById('modal-examname');
    const examclass = document.getElementById('modal-examclass');
    const examsubject = document.getElementById('modal-examsubject');
    exam.sessionCheck(usernames);

    btnAddExam.addEventListener('click', () => {
      document.getElementById('showExam').style.display = 'none';
      exam.addExam(usernames.value, examname.value, examclass.value, examsubject.value);
    });

    btnAnswerKey.addEventListener('click', () => {
      let answerKey = [];

      for (let i = 1; i <= totalQuestion.value; i++) {
        answerKey.push(document.getElementById('q' + i).value.toLowerCase());
      }
      document.getElementById('showExam').style.display = 'none';
      exam.addAnswerKey(usernames.value, examid.value, answerKey);
    });

    btnEditKey.addEventListener('click', () => {
      let editedKey = [];

      document.getElementById('showExam').innerHTML = '';
      for (let i = 1; i <= totalQuestionEdited.textContent; i++) {
        editedKey.push(document.getElementById('qe' + i).value.toLowerCase());
      }
      document.getElementById('showExam').style.display = 'none';
      exam.editAnswerKey(usernames.value, examidEdited.value, editedKey);
    });

    break;
  case examStudent.page:
    const queryExam = window.location.search;
    const examParams = new URLSearchParams(queryExam);
    const btnDeleteAnswer = document.getElementById('btnDeleteAnswer');
    const btnCaptureImage = document.getElementById('btnCaptureImage');
    const btnUploadImage = document.getElementById('btnUploadImage');
    const btnHighlight = document.getElementById('btnHighlight');
    const btnUpdateAnswer = document.getElementById('btnUpdateAnswer');
    const progressBar = document.getElementById('progressBar');
    const idStudent = document.getElementById('modal-estudentid');
    const idExam = examParams.get('id');
    const idClassStudent = examParams.get('classid');
    document.getElementById('btnSubmitScan').style.visibility = 'hidden';
    let imageBlob = [];
    examStudent.sessionCheck(usernames, idClassStudent, idExam);

    btnUpdateAnswer.addEventListener('click', (event) => {
      let editedAnswer = [];

      let checkAnswer = document.querySelectorAll('.inputan');
      checkAnswer.forEach((e) => {
        editedAnswer.push(e.value);
      });

      examStudent.editStudentAnswer(usernames.value, idExam, idStudent.value, editedAnswer);
    });

    btnDeleteAnswer.addEventListener('click', (event) => {
      const studentanswer = document.getElementById('modal-studentidExam');
      const confirmation = document.getElementById('modal-studentAnsC');

      if (confirmation.value === 'delete') {
        document.getElementById('showExamStudent').innerHTML = '';
        examStudent.deleteStudentAnswer(usernames.value, idExam, studentanswer.value);
        location.reload();
      } else {  
        console.log('Data tidak terhapus');
      }
    });

    btnHighlight.addEventListener('click', (event) => {
      let editedAnswer = [];

      let checkAnswer = document.querySelectorAll('.inputan');
      checkAnswer.forEach((e) => {
        editedAnswer.push(e.value);
      });

      examStudent.highlight(usernames.value, idExam, editedAnswer);
    });

    btnCaptureImage.addEventListener('change', (e) => {
      const file = e.target.files[0];
      imageBlob.length = 0;
      imageBlob.push(file);
    });

    btnUploadImage.addEventListener('click', (e) => {
      const studentID = document.getElementById('modal-studentid').value;
      if (imageBlob.length == 0) {
        alert('Please select an image to continue the progress');
      } else {
        if (imageBlob[0].size <= 1024000) {
          scoring.uploadImageToStorage(usernames.value, imageBlob[0], progressBar, idExam, studentID);
        } else {
          alert('Image size exceeds maximum allowable size (1 MB)');
        }
      }
    });
    break;
}
