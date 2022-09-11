// ====================================== Write Data in Database of Firebase ======================================
import { getDatabase, ref, set, get, onValue, child, push , update , remove } from "https://www.gstatic.com/firebasejs/9.9.3/firebase-database.js";
// Get "Database" from "Firebase"
let db = getDatabase();
  // create "auto-generated UserId"
  let userId = push(child(ref(db), 'users/')).key;
  // get the reference of "auto-generate id" 
  let idRef = ref(db, 'users/' + userId);
// ++++++++++++++ Write Data Function ++++++++++++++++
// Basic write operations
function writeUserData(name, phone, email) {
    // +++++++++++++++++++++++++ Set Method ++++++++++++++++++++++++++   
    // set auto-generated keys to 'userId'
    set(idRef, {
        username: name,
        phoneNum: phone,
        emailAddress: email
    }).then(
        // Success Set : when "set" data to database successfully
        (onFullFilled) => {
            console.log("Success");
        },
        (onRejected) => {
            console.log(onRejected);
        });
}
// ++++++++++++++ Call "writeUserData()" ++++++++++++++++
// writeUserData("Abdo", "0124586983", "abdo@gmail.com"); 
// ====================================== Read Data from Database of Firebase ======================================
// Get the "add-user button " element
let addUserBtnElem = document.querySelector(".add-user");
// Get the "popup form container " element
let popupElem = document.querySelector(".popup");
// Get the "Add form " element
let addFormElem = document.querySelector(".add form");
// Get the "Update form " element
let updateFormElem = document.querySelector(".update form");
// Get the "table body" element ( tbody )
let tableBodyElem = document.querySelector("tbody");
onValue(ref(db, 'users/'), (snapshot) => {
    const users = snapshot.val();
    // clear "table body" (tbody)
    tableBodyElem.innerHTML = "";
    for (let userVar in users) {
        // define "table row" element (tr)
        // "userVar" is  "userId"
        let trElem = `
            <tr data-id = ${userVar} >
                <td> ${users[userVar].username} </td>
                <td> ${users[userVar].phoneNum} </td> 
                <td> ${users[userVar].emailAddress} </td>
                <td>
                    <button class="edit">Edit</button>
                    <button class="delete">Delete</button>
                </td>
            </tr>
        `;
        // appeand "table rows" element (tr) inside "table body" (tbody)
        tableBodyElem.innerHTML += trElem;
    }
    // +++++++++++++++++++++++++++++++++++++ Edit Button +++++++++++++++++++++++++++++++++++++++++ 
    // return all "edit buttons"
    let editButtons = document.querySelectorAll(".edit");
    //  When Click on any "Edit" button هيمشي علي زرار زرار وهيطبق عليهم هذا الكود 
    editButtons.forEach( function (clickedEditBtn) {
        // clickedEditBtn is the "clicked edit button"
        clickedEditBtn.addEventListener("click", function () {
            // When click on "Edit" button , open the "popup"
            document.querySelector(".update").classList.add("active");
            // "edit button" has two parent "<td></td>" , "<tr></tr>" , then "clickedEditBtn.parentElement" = "<td></td>" ,  "clickedEditBtn.parentElement.parentElement" = "<tr></tr>" 
            // To get "userId" of the row that "edit button" in , the use "clickedEditBtn.parentElement.parentElement.dataset.id" 
            // return userId 
            let userIdEditBtn = clickedEditBtn.parentElement.parentElement.dataset.id;
            // +++++++++++++++++++++++++ Get Method ++++++++++++++++++++++++++   
            // we will use "get" function to get "row data" of "edit button"
            get( child(ref(db), `users/${userIdEditBtn}`) ).then( (snapshot => {
                    // return the "row data" of clicked "edit button" from the "Html Table"
                    // console.log(snapshot.val()); 
                    // Return the "row data" of the "userId" from "firebase" to the "Form"
                    // "Set" : the "username" of the row  "edit button" to the username in form
                    updateFormElem.usernameInput.value = snapshot.val().username;
                    updateFormElem.phoneInput.value    = snapshot.val().phoneNum;
                    updateFormElem.emailInput.value    = snapshot.val().emailAddress;
            }))
            // After Changes in popup form and click submit , then the changes will reflect on DB and Table
            updateFormElem.addEventListener("submit",function(e){
                // prevent the page from reloading when submit form
                // e.preventDefault();  
                // +++++++++++++++++++++++++ Update Method ++++++++++++++++++++++++++
                update( child(ref(db), `users/${userIdEditBtn}`) , {
                    // "get" the "username" value from "form" and "set" it as value for "username" in "DB"
                    // "username" , "phoneNum" , "emailAddress" is "Columns" of DB :: "usernameName" , "phoneName" , "emailName" is "inputFields" of "popup Form"
                    username: updateFormElem.usernameInput.value,
                    phoneNum: updateFormElem.phoneInput.value,
                    emailAddress: updateFormElem.emailInput.value
                }).then(
                    // Success Set : when "set" data to database successfully 
                    (onFullFilled) => {
                        alert("Updated Successfully");
                        // Hide "update form" element After Updating Row through removing "active" class
                        document.querySelector(".update").classList.remove("active");
                        // Reset Form From "old values"
                        updateFormElem.reset();
                    },
                    (onRejected) => {
                        console.log(onRejected);
                    });
            });
        });
    });
    // +++++++++++++++++++++++++++++++++++++++++++++ Delete +++++++++++++++++++++++++++++++++++++++++++
    // 1- select All "delete buttons" from Table
    let deleteButtons = document.querySelectorAll(".delete");
    deleteButtons.forEach( function(clickedDeleteBtn){
        // 2- "clickedEditBtn" is the "delete button" that you clicked
        clickedDeleteBtn.addEventListener("click",function(){
            // 3- Get the "id" of row of the "delete button" that you clicked
            let userIdDeletedBtn = clickedDeleteBtn.parentElement.parentElement.dataset.id;
            // 4- Get the "reference of userId" of the "row" of "deleted button" that you clicked
            remove( child(ref(db), `users/${userIdDeletedBtn}`) , { }
            ).then(
                // Success Set : when "set" data to database successfully 
                (onFullFilled) => {
                    alert("Deleted Successfully");
                },
                (onRejected) => {
                    console.log(onRejected);
                });
        });
    } ); 
});
// Write Dynamic Data in DB from "popup form" when click on "add-user button"
addUserBtnElem.addEventListener("click", () => {
    // appear "popup form" element through add "active" class
    document.querySelector(".add").classList.add("active");
    // when Submit Form 
    addFormElem.addEventListener("submit", (e)=> {
        // Stop Page from Reload When submit Form
        // e.preventDefault();  
        // Get All "inputField data" and Pass Them to "writeUserData" function
        writeUserData(addFormElem.usernameInput.value, addFormElem.phoneInput.value, addFormElem.emailInput.value); 
    });
});
// +++++++++++++++++++++++ Close popup +++++++++++++++++++++
window.addEventListener("click",function(e){
    if( e.target == popupElem )
    {
        popupElem.classList.remove("active");
        addFormElem.reset();
        updateFormElem.reset();
    }
});