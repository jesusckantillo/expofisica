function changeButtonColor() {
  var button = document.getElementById("serialButton");
  if (button.classList.contains("btn-inverse-danger")) {
    button.classList.remove("btn-inverse-danger");
    button.classList.add("btn-inverse-success");
    button.innerText = "Run serial";
  } else {
    button.classList.remove("btn-inverse-success");
    button.classList.add("btn-inverse-danger");
    button.innerText = "Stop serial";
  }
}