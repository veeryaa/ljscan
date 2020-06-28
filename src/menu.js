import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

let dashboard = {
  page: 'indexMenu',
  sessionCheck: function (tag, reqTime) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const username = user.email.split('@');
        const date = new Date();
        const resTime = date.getTime();
        tag.innerText = username[0];
        this.countClassroom(username[0]);
        this.countSubject(username[0]);
        this.delayButton(reqTime, resTime);
      } else {
        window.location.href = 'index.html';
      }
    });
  },
  displayProfile: function () {
    firebase.storage().ref().child('avatar/asianmale01.jpg').getDownloadURL().then((url) => {
      const link = url;
      document.querySelector('img').src = link;
    });
  },
  countClassroom: function (u) {
    const userRef = firebase.database().ref().child('classroom');
    userRef.child(u).once('value').then((snap) => {
      const totalRecord = snap.numChildren();
      document.getElementById('countClass').innerText = totalRecord + ' ' + 'Classes';
    });
  },
  countSubject: function (u) {
    const userRef = firebase.database().ref().child('subject');
    userRef.child(u).once('value').then((snap) => {
      const totalRecord = snap.numChildren();
      document.getElementById('countSubject').innerText = totalRecord + ' ' + 'Subjects';
    });
  },
  delayButton: function (reqTime, resTime) {
    const link = document.getElementsByClassName('menus');
    const delay = resTime - reqTime;
    setTimeout(function () {
      for (let i = 0; i < link.length; i++) {
        link[i].disabled = false;
      }
    }, delay);
  },
  logout: function () {
    firebase.auth().signOut();
  }
}

let classroom = {
  page: 'indexClassroom',
  sessionCheck: function (tag) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const username = user.email.split('@');
        tag.value = username[0];
        this.readClass(username[0]);
      } else {
        window.location.href = 'index.html';
      }
    });
  },
  addClass: function (u, name) {
    const userRef = firebase.database().ref().child('classroom');
    userRef.child(u).push().set({ 'name': name })
      .then(() => {
        console.log('Nama kelas berhasil masuk ke database.');
      })
      .catch(err => console.log(err.code));
  },
  readClass: function (tag) {
    const userRef = firebase.database().ref().child('classroom');
    userRef.child(tag).on('value', function (snapshot) {
      snapshot.forEach((childSnap) => {
        document.getElementById('showClass').innerHTML +=
          `<li class='list-group-item list-group-item-action'>
          <a href='class.html?id=${childSnap.key}'>
          ${childSnap.val().name}</a>
          <button type="button" id="btn-edit" data-classname="${childSnap.val().name}"
          data-classx="${childSnap.key}"
          class="badge badge-warning edit" data-toggle="modal" data-target="#modal-edit">Edit</button></li>`;
      });
    });
  },
  editClass: function (u, id, name) {
    const userRef = firebase.database().ref().child('classroom').child(u).child(id);
    userRef.update({ 'name': name }).then(() => {
      console.log('Nama kelas berhasil diubah');
    })
      .catch(err => console.log(err.code));
  }
}

let subject = {
  page: 'indexSubject',
  sessionCheck: function (tag) {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        const username = user.email.split('@');
        tag.value = username[0];
        this.readSubject(username[0]);
      } else {
        window.location.href = 'index.html';
      }
    });
  },
  addSubject: function (u, name) {
    const userRef = firebase.database().ref().child('subject');
    userRef.child(u).push().set({ 'subject': name })
      .then(() => {
        console.log('Mata pelajaran berhasil masuk ke database.');
      })
      .catch(err => console.log(err.code));
  },
  readSubject: function (tag) {
    const userRef = firebase.database().ref().child('subject');
    userRef.child(tag).on('value', function (snapshot) {
      snapshot.forEach((childSnap) => {
        document.getElementById('showSubject').innerHTML +=
          `<li class='list-group-item list-group-item-action'>
          ${childSnap.val().subject} 
          <button type="button" id="btn-edit" data-subjectname="${childSnap.val().subject}"
          data-subjectx="${childSnap.key}"
          class="badge badge-warning edit" data-toggle="modal" data-target="#modal-edit">Edit</button>
          <button type="button" id="btn-delete" data-subjectname="${childSnap.val().subject}"
          data-subjectx="${childSnap.key}"
          class="badge badge-danger edit" data-toggle="modal" data-target="#modal-delete">Delete</button>
        </li>
          `;
      });
    });
  },
  deleteSubject: function (u, id) {
    const userRef = firebase.database().ref().child('subject').child(u).child(id);
    userRef.remove().then(() => {
      console.log('Mata pelajaran berhasil dihapus');
    })
      .catch(err => console.log(err.code));
  },
  editSubject: function (u, id, name) {
    const userRef = firebase.database().ref().child('subject').child(u).child(id);
    userRef.update({ 'subject': name }).then(() => {
      console.log('Mata pelajaran berhasil diubah');
    })
      .catch(err => console.log(err.code));
  }
}

export { dashboard, classroom, subject };