import firebase from 'firebase/app';
import 'firebase/auth';
import 'firebase/database';
import student from './student';

let scoring = {
  page: 'indexScoring',

  uploadImageToStorage: function (u, file, progressBar, examid, studentID) {
    let solidName = file.name.split('.');
    solidName[0] = studentID;
    let renamed = solidName.join('.');
    const storageRef = firebase.storage().ref('scan/' + examid + '/' + renamed);
    const task = storageRef.put(file);

    task.on('state_changed',
      (snap) => {
        let percentage = (snap.bytesTransferred / snap.totalBytes) * 100;
        progressBar.style.width = `${percentage}%`;
        progressBar.innerHTML = `${percentage}%`;
      },
      (error) => {
        alert(error.message);
        console.log(error.name);
      },
      () => {
        setTimeout(() => {
          progressBar.classList.add('bg-success');
          progressBar.innerHTML = 'DONE';
        }, 1000);
        storageRef.getDownloadURL().then(function (url) {
          document.getElementById('showPaper').innerHTML =
            `<div class="row"> 
            <div class="col-md-12 d-flex justify-content-center">
            <img id="image" class="img-fluid mt-2" src=${url}/ width='50%' height='50%'></div>
            <div class="col-md-12 d-flex justify-content-center">
            <p id='timer' class='mt-2'>
              Please wait&nbsp;<span id='seconds'>6</span>&nbsp;seconds to submit your image.
            </p></div></div>`;

          fetch('https://us-central1-ljscan-70fe0.cloudfunctions.net/scanLembar', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ image: url })
          })
            .then(res => {
              return res.json();
            })
            .then(res => {
              clearInterval();
              btnSubmit.style.visibility = 'visible';
              const dismiss = document.createAttribute('data-dismiss');
              dismiss.value = 'modal';
              btnSubmit.setAttributeNode(dismiss);
              document.getElementById('timer').innerText = 'You can now process your image, please press submit.'

              btnSubmit.addEventListener('click', function (e) {
                const userRef = firebase.database().ref().child('examlist');
                let answerToCompare = [];
                let realkey = [];
                for (let n in res.key) {
                  userRef.child(u).child(examid).child('student').child(studentID).update({
                    [n]: res.key[n], 
                    info: {
                      url: url
                    }
                  }).then(() => {
                    answerToCompare.push(res.key[n]);
                    console.log('Jawaban siswa berhasil ditambahkan.');
                  });
                }

                userRef.child(u).child(examid).child('answerkey').once('value', function (answerSnap) {
                  answerSnap.forEach(e => {
                    realkey.push(e.val());
                  });
                  let correctAnswer = 0;
                  for (let i = 0; i < realkey.length; i++) {
                    if (answerToCompare[i] == realkey[i]) {
                      correctAnswer += 1;
                    } else if (answerToCompare[i] != realkey[i]) {
                      correctAnswer += 0;
                    }
                  } 
                  let score = (correctAnswer / realkey.length) * 100;
                  
                  userRef.child(u).child(examid).child('student').child(studentID).child('info').update({ 
                    score: score,
                    state: 'first_upload'
                  }).then(() => { location.reload() }).catch(e => console.log(e.code));
                })
                    
              });
            })
            .catch(e => {
              alert("There's an error in server side, please re-upload the image.");
              console.log(e.code);
            });
        });
        const btnSubmit = document.getElementById('btnSubmitScan');

        setTimeout(() => {
          let time = 6;
          document.getElementById('lbl_capture').style.display = 'none';
          document.getElementById('lbl_progress').style.display = 'none';
          document.getElementById('forbuttonUpload').style.display = 'none';

          setInterval(() => {
            if (time <= 0) {
              clearInterval();
            } else if (!document.getElementById('seconds')) {
              clearInterval();
            } else {
              document.getElementById('seconds').innerText = time;
            }
            time -= 1;
          }, 1000);
        }, 1000);
      }
    );
  }
}
export default scoring;