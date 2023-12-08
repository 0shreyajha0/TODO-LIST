const mTitle = document.getElementById("todo-title");
const mContent = document.getElementById("todo-content");
const mSubmit = document.getElementById("submit-btn");
const todoItems = document.getElementById("todo-items");
const emptyDiv = document.getElementById("empty-div");
const itemsContainer = document.getElementById("todo-items");
const syncNowBtn = document.getElementById("sync-now-btn");
const syncSpinner = document.getElementById("sync-spinner");

let postId;
var userData = {};

const makeUI = (elementKey, innerValue) => {
  emptyDiv.style.display = "none";
  // console.log("innerValue = " + innerValue);
  document.getElementById("todo-items").style.minHeight = "unset";
  var li = document.createElement("div");
  li.className = "todo-item";
  li.id = elementKey;
  var str = `<div class="item-title"> <img class="delete-todo" id="${elementKey}" src="images/trash.svg" alt="Delete this Todo"> <h3>${
    innerValue["title"]
  }</h3> <p class="todo-item-date">Date: ${
    innerValue["date"].slice(0, 3) + ", " + innerValue["date"].slice(4, 15)
  }</p> </div> <p class="todo-item-content">${innerValue["content"]}</p>`;
  li.insertAdjacentHTML("afterbegin", str);
  todoItems.prepend(li);
  document.getElementById("sync-now-btn").style.borderColor = "#6c64f8";
  document.getElementById("sync-now-p").style.color = "#6c64f8";
};

const setTodoList = (data) => {
  // console.log("Setting data!!");
  for (const [key, value] of Object.entries(data)) {
    // console.log(key + ":-");
    makeUI(key, value);
  }
};

(prepWork = () => {
  postId = localStorage.getItem("postCount");
  if (postId == null) {
    postId = 0;
    localStorage.setItem("postCount", 0);
  }
  let tempData = localStorage.getItem("userData");
  if (tempData != null) {
    userData = JSON.parse(tempData);
    setTodoList(userData);
  }
})();

const updatePostID = (currID) => {
  postId = ++currID;
  localStorage.setItem("postCount", postId);
};

const setPostData = (data) => {
  localStorage.setItem("userData", JSON.stringify(data));
  updatePostID(postId);
  // setTodoList(data);
  // console.log(data);
  makeUI(postId - 1, data[postId - 1]);
  mTitle.value = "";
  mContent.value = "";
  // console.log("Data Saved Sucessfully!!");
};

const submitBtnClicked = () => {
  // console.log("Submit button Clicked");
  // // console.log("Title = " + mTitle.value + "\n" + "Content = " + mContent.value);
  // console.log(postId);
  if (mTitle.value != "") {
    userData[postId] = {
      title: mTitle.value,
      content: mContent.value,
      date: String(new Date()),
    };
    setPostData(userData);
  } else {
    alert("Enter Title");
  }
};

const deleteTodo = (deleteTodoId) => {
  let localObject = userData;
  delete localObject[deleteTodoId.id];
  localStorage.setItem("userData", JSON.stringify(localObject));
  document.getElementById(deleteTodoId.id).style.display = "none";
  if (Object.keys(localObject).length == 0) {
    // console.log("its empty");
    emptyDiv.style.display = "block";
  }
};

mSubmit.addEventListener("click", (event) => {
  event.preventDefault();
  submitBtnClicked();
});

itemsContainer.addEventListener("click", (event) => {
  console.log(event.target.className);
  if (event.target.className == "delete-todo") {
    deleteTodo(event.target);
  }
});

syncNowBtn.addEventListener("click", () => {
  syncSpinner.classList = "fa fa-refresh fa-spin";
  syncSpinner.style.transition = "1s";
  setTimeout(() => {
    syncSpinner.classList = "";
    document.getElementById("sync-now-btn").style.borderColor = "#4ee44e";
    document.getElementById("sync-now-p").style.color = "#4ee44e";
    // document.getElementById("sync-now-p").innerText = "Synced";
  }, 1600);
});
