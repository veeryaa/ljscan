import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import 'firebase/storage';

const auth = firebase.auth();

let displayLogo = function () {
  firebase.storage().ref().child('logos.png').getDownloadURL().then((url) => {
    const link = url;
    document.querySelector('img').src = link;
  });
}

let login = {
  page: 'indexLogin',
  sessionCheck: function () {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        window.location.href = 'menu.html';
      } else {
        console.log('Tidak ada user dalam keadaan login');
      }
    })
  },
  init: function () {
    const email = document.getElementById('txtEmail').value;
    const pass = document.getElementById('txtPassword').value;

    // * Fungsi firebase signInWithEmailAndPassword untuk akses ke dalam firebase authentication
    auth.signInWithEmailAndPassword(email, pass)
      .then(() => console.log('Login sukses - '.email.pass))
      .catch(err => {
        switch (err.code) {
          case 'auth/invalid-email':
            alert('Email is not in the correct format.');
            break;
          case 'auth/user-not-found':
            alert('User is not found.');
            break;
          case 'auth/wrong-password':
            alert('Invalid password, please enter a correct password.');
            break;
        }
      });
  }
}

let register = {
  page: 'indexRegister',
  init: function () {
    const name = document.getElementById('txtName').value;
    const email = document.getElementById('txtEmail').value;
    const pass = document.getElementById('txtPassword').value;
    const cleanEmail = email.split('@');

    if (name === '' || email === '' || pass === '') {
      alert('Name, email, or password cannot be empty.');
    } else {
      const userRef = firebase.database().ref().child('users');
      // * Membuat child dengan username, dan data user yang diinput ke dalam firebase database
      firebase.auth().createUserWithEmailAndPassword(email, pass)
        .then(() => {
          userRef.child(cleanEmail[0])
            .set({
              'name': name,
              'email': email,
            })
            // * Setelah data masuk dalam database, promise akan dikembalikkan, data akan dimasukkan,
            // * ke dalam firebase authentication agar dapat digunakan untuk keperluan login user,
            // * User akan otomatis terlogin ketika selesai mendaftarkan datanya
            .then(() => alert('You have sucessfully registered an account.')).catch(err => console.log(err.code));
        })
        .catch(err => {
          switch (err.code) {
            case 'auth/invalid-email':
              alert('Email is not in the correct format.');
              break;
            case 'auth/weak-password':
              alert('Minimum password is 6 characters.');
              break;
            case 'auth/email-already-in-use':
              alert("The email you're trying to register already exists.");
              break;
          }
          console.log(err.code);
        })

    }
  }
}

export default displayLogo;
export { login, register };