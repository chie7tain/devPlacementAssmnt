// dom elements
const apiUrl = 'https://randomuser.me/api/?results=25&seed=abc&inc=gender,name,registered,location,email,cell,phone,dob,picture,nat&noinfo'
const userProfileDisplay = document.querySelector(".user-profile-display");
const userCardContainer = document.querySelector(".user-card-container");
const filterBtns = document.querySelectorAll(".filter-btn")
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
const backBtn = document.querySelector(".back-btn-container");
const userCardDisplay = document.querySelector(".user-card-display")


// creating a user class
// geting the Users
class Users{
  async getUsers(){
    try{
      let result = await fetch("./users.json");
      let users = await result.json();
      users = users.map(user =>{
        const {gender,email,phone,cell} = user;
        const {first:firstName,last:lastName} = user.name;
        const {number:streetNumber,name:streetName} = user.location.street;
        const {city,state,country} = user.location;
        const {thumbnail:userImage,large:largeSizeImage} = user.picture;

        let {date:dateJoined} = user.registered;
        const {age} = user.dob;
        // formating the dateJoined value
        dateJoined = dateJoined.toString();
        const dateRegistered = dateJoined.slice(0,10)
        const userAddress = `${streetNumber} ${streetName} ${city} ${state} ${country}`
        return {gender,firstName,lastName,age,email,phone,cell,userAddress,userImage,largeSizeImage,dateRegistered};
      })
      return users;
    }catch(error){
      console.log(error);
    }
  }
}
// displaying the Users
class UI{

    displayUsersData(users){

      let result = "";
      users.forEach(user =>{
        result += `
        <div class="individual-user-card-container">
                <!-- user-image -->
                <div class="user-image-container">
                  <div class="image-border">
                    <img src="${user.userImage}" alt="user's image" class="user-image">
                  </div>
                </div>
                <!-- user details -->
                <div class="user-details-container">
                  <!-- user name -->
                  <div class="user-name-container">
                    <h3 class="user-name">${user.firstName} ${user.lastName}</h3>
                  </div>
                  <!-- user address -->
                  <div class="user-address-container">
                    <p class="user-address">
                      ${user.userAddress}
                    </p>
                  </div>
                  <!-- user contact details -->
                  <div class="user-contact-details-container">
                    <div class="user-email-container">
                      <p class="user-email-address">
                        <i class="far fa-envelope"></i>${user.email}
                      </p>
                    </div>
                    <div class="user-phone-number-container">
                      <p class="user-phone-number">
                        <i class="fas fa-phone-alt"></i>
                        ${user.cell}
                      </p>
                    </div>
                  </div>
                </div>
                <!-- expand user details button -->
                <div class="expand-user-details-button-container">
                  <button class="expand-user-details-btn" data-email=${user.email}>
                  <i class="fas fa-arrow-right" ></i>
                  </button>
                </div>
              </div>
        `;
      });
      userCardDisplay.innerHTML = result
    }

    getUserDetailsBtn(users){
      const expandDetailsBtns= [...document.querySelectorAll(".expand-user-details-btn")];
      expandDetailsBtns.forEach(btn =>{
        let email = btn.dataset.email;
        btn.addEventListener("click",()=>{
          let user = Storage.getUser(email);
       // hide user card container
          this.hideUserCardContent();
          // display full profile
          this.displayFullProfile(user);
          this.showUserProfile();
          // this.showBackBtn();
          this.returnToResults()
        })
      })
    }


    displayFullProfile(user){
      let userProfile = `
                <div class="user-card-center">
                  <div class="user-avatar-container">
                  <div class="user-avatar-border">
                    <img src=${user.largeSizeImage} alt="user image" class="user-avatar">
                  </div>
                </div>
                <div class="user-details-container-user-card">
                  <div class="name-of-user-container">
                    <h3 class="name-of-user">${user.firstName} ${user.lastName} <span class="user-age">${user.age}</span></h3>
                  </div>
                  <div class="address-of-user-container">
                    <p class="address-of-user">
                      ${user.userAddress}
                    </p>
                  </div>
                  <div class="email-of-user-container">
                    <p class="email-of-user">
                      <i class="fas fa-envelope"></i>
                      ${user.email}
                    </p>
                  </div>
                  <div class="when-joined-container">
                    <p class="when-joined">
                      Joined: <span data-date-joined >${user.dateRegistered}</span>
                    </p>
                  </div>
                  <div class="telephone-number-of-user-container">
                    <div class="telephone-number-container">
                      <p class="telephone-number-of-user tel">
                        <i class="fas fa-phone-alt"></i>
                        ${user.cell}</p>
                    </div>
                    <div class="mobile-number-of-user-container">
                      <p class="mobile-number-of-user tel">
                        <i class="fas fa-mobile-alt"></i>
                        ${user.phone}
                      </p>
                    </div>
                  </div>
                </div>
                </div>

      `;
      userProfileDisplay.innerHTML = userProfile;
    }
    paginateUserData(data){
        let page = 0;
        let usersPerPage = 3;

      let paginatedUserData = [];
      let dataForFilter;
          for(let i = 0; i < page + usersPerPage; i++){
            paginatedUserData.push(data[i]);
          }
        this.displayUsersData(paginatedUserData);
        dataForFilter = paginatedUserData;
        this.filterUsers(dataForFilter)
        this.getUserDetailsBtn(dataForFilter);
            nextBtn.addEventListener("click",()=>{
          if(page == data.length - usersPerPage){
            page = 0;
          }else{
            page += usersPerPage;
          }
          paginatedUserData = [];
          for(let i = page; i < page + usersPerPage; i++){
            paginatedUserData.push(data[i])
          }
        this.displayUsersData(paginatedUserData);
        dataForFilter = paginatedUserData;
          this.filterUsers(dataForFilter)
          this.getUserDetailsBtn(dataForFilter);
        })

        prevBtn.addEventListener("click",()=>{
          if(page == 0){
            page = data.length - usersPerPage;
          }else{
            page -= usersPerPage;
          }
          paginatedUserData = [];
          for(let i = page; i < page + usersPerPage; i++){
            paginatedUserData.push(data[i]);
          }
          this.displayUsersData(paginatedUserData);
          dataForFilter = paginatedUserData;
          this.filterUsers(dataForFilter)
          this.getUserDetailsBtn(dataForFilter);
        })

    }
     // this function would help to filter out users based on gender using the filter buttons
    filterUsers(userData){
    // filter users
    filterBtns.forEach(btn =>{
      btn.addEventListener("click",(e)=>{
        const category = e.currentTarget.dataset.gender;
        const genderCategory = userData.filter(userInfo =>{
          // console.log(userInfo.gender);
          if(userInfo.gender === category){
            return userInfo;
          }
        });
        if(category === "all"){
          this.displayUsersData(userData);
          this.getUserDetailsBtn(userData)
        }else{
          this.displayUsersData(genderCategory);
          this.getUserDetailsBtn(genderCategory);
        }
      })
    })
  }
  showBackBtn(){
    backBtn.classList.add("show-back-btn");
  }
    hideUserCardContent(){
    userCardDisplay.classList.add("hide-user-card")
    }
    // this function helps the user view the full user profile when he/she clicks the expand user details btn
    showUserProfile(){
      userProfileDisplay.classList.add("show-user-profile");
      backBtn.classList.add("show-back-btn");
    }
    // this function helps to return the user back to the previous page where he/she clicked from
    returnToResults(){
      backBtn.addEventListener("click",()=>{
         userCardDisplay.classList.remove("hide-user-card")
         userProfileDisplay.classList.remove("show-user-profile");
         backBtn.classList.remove("show-back-btn");
      })
    }
  }

// local storage
class Storage{
  static saveUsers(users){
    localStorage.setItem("users", JSON.stringify(users));
  }
  static getUser(email){
    let users = JSON.parse(localStorage.getItem("users"));
    return users.find(user => user.email === email);
  }
}


// class UI{


document.addEventListener("DOMContentLoaded",()=>{

  const ui = new UI();
  const users = new Users();
  // get all users
  users.getUsers().then(users => {
    ui.displayUsersData(users);
    Storage.saveUsers(users);
    ui.paginateUserData(users)
  })
})



