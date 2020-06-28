import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';

let student = {
  page: 'indexStudentList',
  sessionCheck: function (tag, id) {
    firebase.auth().onAuthStateChanged((user) => {
      if (user) {
        const username = user.email.split('@');
        tag.value = username[0];
        this.countStudent(username[0], id);
        this.readStudent(username[0], id);
      } else {
        window.location.href = 'index.html'
      }
    });
  },
  countStudent: function (u, id) {
    const userRef = firebase.database().ref().child('classroom');
    const tagTotalRecord = document.getElementById('totalRecord');
    userRef.child(u).child(id).child('student').on('value', function (snap) {
      const totalRecord = snap.numChildren();
      tagTotalRecord.innerText = 'Total Student : ' + totalRecord;
    });
  },
  addStudent: function (u, id, name) {
    const userRef = firebase.database().ref().child('classroom');
    userRef.child(u).child(id).child('student').push().set({ 'name': name })
      .then(() => {
        console.log('Nama student berhasil masuk ke database.');
      })
      .catch(err => console.log(err.code));
  },
  readStudent: function (tag, id) {
    const userRef = firebase.database().ref().child('classroom');
    userRef.child(tag).child(id).child('student').on('value', function (snapshot) {
      snapshot.forEach((childSnap) => {
        document.getElementById('showStudent').innerHTML +=
          `<li class='list-group-item list-group-item-action'>
        ${childSnap.val().name}
        <button type="button" id="btn-edit" data-studentname="${childSnap.val().name}"
        data-studentx="${childSnap.key}"
        class="badge badge-warning edit" data-toggle="modal" 
        data-target="#modal-edit">Edit</button>
        <button type="button" id="btn-delete" data-studentname="${childSnap.val().name}"
          data-studentx="${childSnap.key}"
          class="badge badge-danger edit" data-toggle="modal" data-target="#modal-delete">Delete</button>
        </li>
        `;
      });
    });
  },
  editStudent: function (u, classses, id, name) {
    const userRef = firebase.database().ref().child('classroom').child(u);
    userRef.child(classses).child('student').child(id).
      update({ 'name': name }).then(() => {
        console.log('Nama siswa berhasil diubah');
      })
      .catch(err => console.log(err.code));
  },
  deleteStudent: function (u, classses, id) {
    const userRef = firebase.database().ref().child('classroom').child(u);
    userRef.child(classses).child('student').child(id).remove().then(() => {
      console.log('Satu data siswa telah berhasil dihapus');
      location.reload();
    })
      .catch(err => console.log(err.code));
  }
}

export default student;