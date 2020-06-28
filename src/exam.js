import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

let exam = {
  page: 'indexExam',
  sessionCheck: function (tag) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const username = user.email.split('@');
        tag.value = username[0];
        this.readExam(username[0]);
        this.classIntoDropdown(username[0]);
        this.subjectIntoDropdown(username[0]);
      } else {
        window.location.href = 'index.html';
      }
    });
  },
  addExam: function (u, name, classes, subject) {
    const userRef = firebase.database().ref().child('examlist');
    userRef.child(u).push().set({
      'name': name,
      'class': classes,
      'subject': subject,
      'status': 'empty'
    })
      .then(() => { console.log('Examlist berhasil dibuat'); location.reload(); })
      .catch(err => console.log(err.code));
  },
  addAnswerKey: function (u, examkey, answerkey) {
    const userRef = firebase.database().ref().child('examlist');
    for (let i = 0; i < answerkey.length; i++) {
      let number = i + 1;
      userRef.child(u).child(examkey).child('answerkey').update({
        [number]: answerkey[i]
      })
        .then(() => {
          userRef.child(u).child(examkey).update({
            'total_q': answerkey.length,
            'status': 'filled'
          })
          location.reload();
        })
        .catch(err => {
          console.log(err.code)
        });
    }
  },
  editAnswerKey: function (u, examkey, answerkey) {
    const userRef = firebase.database().ref().child('examlist');
    for (let i = 0; i < answerkey.length; i++) {
      let number = i + 1;
      userRef.child(u).child(examkey).child('answerkey').update({
        [number]: answerkey[i]
      })
        .then(() => {
          location.reload();
        })
        .catch(err => console.log(err.code));
    }
  },
  readExam: function (tag) {
    const userRef = firebase.database().ref().child('examlist');
    const classRef = firebase.database().ref().child('classroom');
    const subjectRef = firebase.database().ref().child('subject');
    userRef.child(tag).on('child_added', function (snapshot) {
      subjectRef.child(tag).child(snapshot.val().subject).once('value').then(snapSubject => {
        classRef.child(tag).child(snapshot.val().class).on('value', snapClass => {
          if (snapshot.val().status === 'empty') {
            document.getElementById('showExam').innerHTML +=
              `<li class='list-group-item list-group-item-action'>
            <a href='exam.html?id=${snapshot.key}&classid=${snapshot.val().class}'>
            ${snapClass.val().name} - ${snapSubject.val().subject} - 
            ${snapshot.val().name}</a>
            <button type="button" id="btn-answer" data-examx="${snapshot.key}"
            class="badge badge-primary edit" data-toggle="modal" data-target="#modal-answers">Answer Key</button>
            </li>`;
          } else if (snapshot.val().status === 'filled') {
            let itsKey = [];
            snapshot.child('answerkey').forEach((data) => {
              itsKey.push(data.val());
            });
            document.getElementById('showExam').innerHTML +=
              `<li class='list-group-item list-group-item-action'>
            <a href='exam.html?id=${snapshot.key}&classid=${snapshot.val().class}'>
            ${snapClass.val().name} - ${snapSubject.val().subject} - 
            ${snapshot.val().name}</a>
            <button type="button" id="btn-edit" data-examx="${snapshot.key}"
            data-qkey="${itsKey}"
            data-totalqs="${snapshot.val().total_q}" class="badge badge-warning edit" 
            data-toggle="modal" data-target="#modal-edit">
            Edit</button>
            </li>`;
          }
        })
      });
    });
  },
  classIntoDropdown: function (tag) {
    const userRef = firebase.database().ref().child('classroom');
    userRef.child(tag).once('value', function (snapshot) {
      snapshot.forEach((child) => {
        document.getElementById('modal-examclass').innerHTML +=
          `<option value='${child.key}'>${child.val().name}</option>`;
      });
    });
  },
  subjectIntoDropdown: function (tag) {
    const userRef = firebase.database().ref().child('subject');
    userRef.child(tag).once('value', function (snapshot) {
      snapshot.forEach((child) => {
        document.getElementById('modal-examsubject').innerHTML +=
          `<option value='${child.key}'>${child.val().subject}</option>`
      });
    });
  }
}

let examStudent = {
  page: 'indexExamStudent',
  sessionCheck: function (tag, classid, examid) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const username = user.email.split('@');
        tag.value = username[0];
        this.readStudent(username[0], classid, examid);
      } else {
        window.location.href = 'index.html';
      }
    });
  },

  readStudent: function (tag, classid, examid) {
    const imageRef = firebase.database().ref().child('examlist');
    const userRef = firebase.database().ref().child('classroom');
    userRef.child(tag).child(classid).child('student').on('child_added', function (snapshot) {
      imageRef.child(tag).child(examid).child('student').child(snapshot.key).once('value', function (imageSnap) {
        let theAnswer = new Array();
        for (let n in imageSnap.val()) {
          theAnswer.push(imageSnap.val()[n]);
        }
        if (imageSnap.val() == null) {
          document.getElementById('showExamStudent').innerHTML +=
            `<li class='list-group-item list-group-item-action'>${snapshot.val().name} 
          <button type="button" id="btn-scan" data-studentname="${snapshot.val().name}"
          data-studentx="${snapshot.key}"
          class="badge badge-warning edit" data-toggle="modal" data-target="#modal-scan">
          Scan</button>
          </li>`;
        } else {
          document.getElementById('showExamStudent').innerHTML +=
            `<li class='list-group-item list-group-item-action'>${snapshot.val().name} 
          <button type="button" id="btn-edit" data-eanswer="${theAnswer}" data-estudentname="${snapshot.val().name}"
          data-estudentx="${snapshot.key}" data-url=${imageSnap.val().info.url}
          class="badge badge-success edit" data-toggle="modal" data-target="#modal-editljk">
          Edit</button> 
          <button type="button" id="btn-delete" data-studentname="${snapshot.val().name}"
          data-studentx="${snapshot.key}"
          class="badge badge-danger edit" data-toggle="modal" data-target="#modal-delete">Delete</button>
          Score: ${imageSnap.val().info.score}
          </li>

          </li>`;
        }
      });
    });
  },

  deleteStudentAnswer: function (tag, examid, studentid) {
    // console.log(tag, examid, studentid);
    const userRef = firebase.database().ref().child('examlist').child(tag);
    userRef.child(examid).child('student').child(studentid).remove().then(() => {
      console.log('Jawaban siswa telah berhasil dihapus');
    })
      .catch(err => console.log(err.code));
  },

  editStudentAnswer: function (tag, examid, studentid, studentanswer) {
    const userRef = firebase.database().ref().child('examlist');
    console.log(studentid);

    userRef.child(tag).child(examid).child('answerkey').once('value', function (snapshot) {
      let realkey = [];
      let correctAnswer = 0;
      snapshot.forEach(e => {
        realkey.push(e.val());
      });

      realkey.forEach((e, index) => {
        if (e == studentanswer[index]) {
          correctAnswer += 1;
        } else {
          correctAnswer += 0;
        }

        userRef.child(tag).child(examid).child('student').child(studentid).update({
          [index + 1]: studentanswer[index]
        }).then().catch(e => console.log(e.code));
      });
      let score = (correctAnswer / realkey.length) * 100;

      userRef.child(tag).child(examid).child('student').child(studentid).child('info').update({
        score: Math.round(score),
        state: 'corrected'
      }).then(() => { location.reload(); }).catch(e => console.log(e.code));
    });
  },

  highlight: function (tag, examid, studentanswer) {
    const userRef = firebase.database().ref().child('examlist');

    userRef.child(tag).child(examid).child('answerkey').once('value', function (snapshot) {
      let realkey = [];
      snapshot.forEach(e => {
        realkey.push(e.val());
      });

      realkey.forEach((e, index) => {
        let box = document.querySelector('#ae' + [index + 1]);
        if (e == studentanswer[index]) {
          box.style.color = 'black';
          box.style.backgroundColor = '#B2FF66';
        } else {
          box.style.color = 'black';
          box.style.backgroundColor = '#FF6666';
        }
      });
    });
  }
}

export default exam;
export { examStudent }; 
