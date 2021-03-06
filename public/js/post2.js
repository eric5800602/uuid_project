// Set constraints for the video stream
var constraints = { video: { facingMode: "user" }, audio: false };
// Define constants

$(document).ready(function () {
  const cameraView = document.querySelector("#camera--view"),
    cameraView2 = document.querySelector("#camera--view2"),
    cameraOutput = document.querySelector("#camera--output"),
    cameraSensor = document.querySelector("#camera--sensor"),
    cameraturn = document.querySelector("#cameraturn"),
    cameraTrigger = document.querySelector("#camera--trigger")
  // Access the device camera and stream to cameraView
  //select
  var sel1 = document.querySelector('#sel1');
  var sel2 = document.querySelector('#sel2');
  var options1 = sel1.querySelectorAll('option');
  var options2 = sel2.querySelectorAll('option');
  function giveSelection(selValue) {
    sel2.innerHTML = "";
    for (var i = 0; i < options2.length; i++) {
      if (options2[i].dataset.option === selValue) {
        sel2.appendChild(options2[i]);
      }
    }
  }
  giveSelection(sel1.value);
  var myTarget = document.getElementById('sel1');
  var myTargetValue = myTarget.value;
  $("#sel1").change(function () {
    giveSelection($("#sel1").val());
    if ($("#sel1").val() == "single") {

      $("#pings").css('opacity', '0');
      $("#next").css('opacity', '0');
      $("#nexticon").css('opacity', '0');
      $("#finishicon").css('opacity', '1');
      $("#finishicon").css('z-index', '3');

    }
    else if ($("#sel1").val() == "space") {

      $("#pings").css('opacity', '1');
      $("#next").css('opacity', '1');
      $("#nexticon").css('opacity', '1');
      $("#nexticon").css('z-index', '3');
      $("#finishicon").css('opacity', '0');

    }
  });
  var tags = document.getElementsByClassName('tags')
  for (var i = 0; i < tags.length; i++) {
    (function (index) {
      console.log(i);
      tags[index].addEventListener("click", function () {
        if (this.classList.contains("tags_click")) {
          this.classList.add("tags_double_click");
          this.classList.remove("tags_click");
        } else {
          this.classList.add("tags_click");
          if (this.classList.contains("tags_double_click")) {
            this.classList.remove("tags_double_click");
          }
        }
      })
    })(i);
  }
  var confirm = document.getElementById('Submit_button');
  confirm.addEventListener("click", function () {
    var tags = new Array();
    var tmp = document.getElementsByClassName('tags_click');
    for (var i = 0; i < tmp.length; i++) {
      (function (index) {
        tags.push(tmp[i].textContent);
      })(i);
    }
    tags.push($('#ajax-form3 input[name=tName]').val());
    console.log(tags)
    $(document).ready(function () {
      $.post({
        url: "https://luffy.ee.ncku.edu.tw:7575/add_post",
        dataType: "json",
        contentType: "application/json",
        xhrFields: {
          withCredentials: true
        },
        data: JSON.stringify({
          post_icon: $("#camera--output").attr("src"),
          space: $("#sel1").val() == "space" ? "空間" : "單品",
          room: $("#sel2").val(),
          pings: $('#ajax-form4 input[name=pings]').val(),
          title: $('#ajax-form input[name=fName]').val(),
          explanation: $('#explanation').val(),
          tags: tags,
        }),

        success: function (msg) {
          console.log(msg);
          if (msg.success) {
            if ($("#sel1").val() == "single") {

              console.log("good");
              window.location = "./home.html"
            }
            else if ($("#sel1").val() == "space") {

              console.log(" very good");
              localStorage.setItem('add_post_id', msg.id);
              window.location = "./post1.html"
            }

          }
          else {
            console.log("fail");
            //window.location.href = "https://luffy.ee.ncku.edu.tw:7575/html/home.html";
            alert(msg.text);
          }
        },
        error: function (data) {
          console.log("fail");
          console.log(data);
        }
      })
    })

  })
  $('#back').click(function () {
    localStorage.removeItem('post2_url');
    window.location = "./home.html"
  })
  function cameraStart(m) { //alert(m+ '    '+window.mode);
    m = m || 'user';
    if (m == 'env') { m = 'environment'; }
    window.mode = m;
    cameraStop();
    navigator.mediaDevices
      .getUserMedia({ video: { facingMode: m }, audio: false })
      .then(function (stream) {
        // track = stream.getTracks()[0];
        cameraView.srcObject = stream;
      }).catch(function (error) { alert(error); });
  }
  function cameraStop() {
    if (cameraView.srcObject) {
      cameraView.srcObject.getTracks().forEach(t => t.stop());
    }
  }
  function cameraStart__(m) {
    m = m || 'user';
    if (m == 'env') { m = 'environment'; }
    cameraView.style.display = 'none';
    cameraView2.style.display = 'none';
    if (m == 'user') {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: m }, audio: false })
        .then(function (stream) {
          track = stream.getTracks()[0];
          cameraView2.srcObject = stream;
          cameraView2.style.display = 'block';
        })
        .catch(function (error) {
          alert(error);
          console.error("Oops. Something is broken.", error);
        });


    } else {
      navigator.mediaDevices
        .getUserMedia({ video: { facingMode: m }, audio: false })
        .then(function (stream) {
          track = stream.getTracks()[0];
          cameraView.srcObject = stream;
          cameraView.style.display = 'block';
        })
        .catch(function (error) {
          alert(error);
          console.error("Oops. Something is broken.", error);
        });
    } // end of else
  };
  // Take a picture when cameraTrigger is tapped
  if (localStorage.getItem("post2_url")) {
    cameraOutput.src = localStorage.getItem("post2_url");
    cameraOutput.classList.add("taken");
    setTimeout(function () {
      $("#div1").css('display', 'none');
    }, 1000);
    setTimeout(function () {
      $("#posting").css('opacity', '1');
    }, 1000);
    setTimeout(function () {
      $("#tag").css('opacity', '1');
    }, 1000);
    setTimeout(function () {
      $("#Submit_button").css('opacity', '1');
    }, 100);
    cameraView.srcObject.getTracks().forEach(function (track) {
      track.stop();
    });
  }
  cameraTrigger.onclick = function () {
    cameraSensor.width = cameraView.videoWidth;
    cameraSensor.height = cameraView.videoHeight;
    cameraSensor.getContext("2d").drawImage(cameraView, 0, 0);
    var formData = new FormData();
    formData.append('picture', cameraSensor.toDataURL("image/webp"));
    $.ajax({
      url: "/upload_image",
      type: "POST",
      cache: false,
      contentType: false,
      processData: false,
      data: formData,
      success: function (msg) {
        cameraOutput.src = msg.url;
        localStorage.setItem("post2_url", msg.url);
        cameraOutput.classList.add("taken");
        setTimeout(function () {
          $("#div1").css('display', 'none');
        }, 1000);
        setTimeout(function () {
          $("#posting").css('opacity', '1');
        }, 1000);
        setTimeout(function () {
          $("#tag").css('opacity', '1');
        }, 1000);
        setTimeout(function () {
          $("#Submit_button").css('opacity', '1');
        }, 100);
        cameraView.srcObject.getTracks().forEach(function (track) {
          track.stop();
        });
      },
      error: function (err) {
        cameraOutput.src = cameraSensor.toDataURL("image/webp");
      }
    })
  };
  // Start the video stream when the window loads
  window.mode = 'env';
  window.addEventListener("load", function () {
    cameraStart(window.mode);
  }, false);
  cameraturn.addEventListener("click", function () {
    cameraStart(window.mode == 'user' ? 'env' : 'user');
  }, false);
  /*
  cameraTrigger.addEventListener("click",function(){
  	
  })
  */
  //上傳照片
  $('#file').change(function () {
    var file = $('#file')[0].files[0];
    var reader = new FileReader;
    reader.onload = function (e) {

      var formData = new FormData();
      formData.append('picture', e.target.result);
      console.log(formData.get('picture'));
      $.ajax({
        url: "/upload_image",
        type: "POST",
        cache: false,
        contentType: false,
        processData: false,
        data: formData,
        success: function (msg) {
          cameraOutput.classList.add("taken");
          cameraOutput.src = msg.url;
          localStorage.setItem("post2_url", msg.url);
          setTimeout(function () {
            $("#div1").css('display', 'none');
          }, 1000);
          setTimeout(function () {
            $("#posting").css('opacity', '1');
          }, 1000);
          setTimeout(function () {
            $("#Submit_button").css('opacity', '1');
          }, 100);
          setTimeout(function () {
            $("#tag").css('opacity', '1');
          }, 1000);
          cameraView.srcObject.getTracks().forEach(function (track) {
            track.stop();
          });
        },
        error: function (err) {
          cameraOutput.src = e.target.result;
        }
      })
    };
    reader.readAsDataURL(file);
  });
  //tags
})