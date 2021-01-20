// dom elements
const apiUrl = 'https://randomuser.me/api/?results=25&seed=abc&inc=gender,name,registered,location,email,cell,phone,dob,picture,nat&noinfo'
const userCardView = document.querySelector(".user-card-view");
const userCardContainer = document.querySelector(".user-card-container");
const filterBtns = document.querySelectorAll(".filter-btn")
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");


// creating a user class
// geting the Users
class Users{
  async getUsers(){
    try{
      let result = await fetch("./users.json");
      let users = await result.json();
      // console.log(users)
      // users = users.results;
      // console.log(users.results)
      // console.log(users)
      users = users.map(user =>{
        const {gender,email,phone,cell} = user;
        const {first:firstName,last:lastName} = user.name;
        const {number:streetNumber,name:streetName} = user.location.street;
        const {city,state,country} = user.location;
        const {thumbnail:userImage,medium:mediumSizeImage} = user.picture;

        let {date:dateJoined} = user.registered;
        const {age} = user.dob;
        // formating the dateJoined value
        dateJoined = dateJoined.toString();
        const dateRegistered = dateJoined.slice(0,10)
        const userAddress = `${streetNumber} ${streetName} ${city} ${state} ${country}`
        return {gender,firstName,lastName,age,email,phone,cell,userAddress,userImage,mediumSizeImage,dateRegistered};
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
      userCardContainer.innerHTML += result;
    }

    getUserDetailsBtn(users){
      const btns = [...document.querySelectorAll(".expand-user-details-btn")];
      btns.forEach(btn =>{
        let email = btn.dataset.email;
        btn.addEventListener("click",()=>{
          let user = Storage.getUser(email);
          // display full profile
          this.displayFullProfile(user);
        })
      })
    }


    displayFullProfile(user){
      let userProfile = `
      <div class="user-card-view">
        <div class="back-btn-container">
                  <p class="back-btn-text">
                    <i class="fas fa-arrow-left"></i>
                    Results
                  </p>
                </div>
                <div class="user-card-center">
                  <div class="user-avatar-container">
                  <div class="user-avatar-border">
                    <img src=${user.mediumSizeImage} alt="user image" class="user-avatar">
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
              </div>
      `;
      userCardContainer.innerHTML = userProfile;

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
        }else{
          this.displayUsersData(genderCategory);
        }
      })
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

  function displayUsersData(usersData){

      let personData = usersData.map(userData =>{
        return `
         <div class="individual-user-card-container">
                <!-- user-image -->
                <div class="user-image-container">
                  <div class="image-border">
                    <img src="${userData.picture.thumbnail}" alt="user's image" class="user-image">
                  </div>
                </div>
                <!-- user details -->
                <div class="user-details-container">
                  <!-- user name -->
                  <div class="user-name-container">
                    <h3 class="user-name">${userData.name.first} ${userData.name.last}</h3>
                  </div>
                  <!-- user address -->
                  <div class="user-address-container">
                    <p class="user-address">
                      ${userData.location.street.number} ${userData.location.street.name} ${userData.location.city} ${userData.location.state} ${userData.location.country}
                    </p>
                  </div>
                  <!-- user contact details -->
                  <div class="user-contact-details-container">
                    <div class="user-email-container">
                      <p class="user-email-address">
                        <i class="far fa-envelope"></i>${userData.email}
                      </p>
                    </div>
                    <div class="user-phone-number-container">
                      <p class="user-phone-number">
                        <i class="fas fa-phone-alt"></i>
                        ${userData.phone}
                      </p>
                    </div>
                  </div>
                </div>
                <!-- expand user details button -->
                <div class="expand-user-details-button-container">
                  <button class="expand-user-details-btn data-email="">
                  <i class="fas fa-arrow-right"></i>
                  </button>
                </div>
              </div>
        `;
      })
    personData = personData.join("");
    userCardContainer.innerHTML = personData;

    const userCards = [...document.querySelectorAll(".individual-user-card-container")];

    userCards.forEach(card =>{
      const viewUserProfileBtn = card.querySelector(".expand-user-details-btn");
      viewUserProfileBtn.addEventListener("click",()=>{
        console.log(usersData)
        userCardContainer.innerHTML = card;
      })
    })
  }
  // this function would help to filter out users based on gender using the filter buttons
  function filterUsers(userData){
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
          displayUsersData(userData);
        }else{
          displayUsersData(genderCategory);
        }
      })
    })
  }
// }
document.addEventListener("DOMContentLoaded",()=>{

  const ui = new UI();
  const users = new Users();
  // get all users
  users.getUsers().then(users => {
    ui.displayUsersData(users);
    ui.paginateUserData(users);
    Storage.saveUsers(users);
  }).then(()=>{
    ui.getUserDetailsBtn(users);
  })
    // getUsersData()
    // .then(response => response.json())
    // .then(data =>{
    //   let {results} = data;
    //   displayUsersData(results);
    //   // filterUsers(results);
    //  paginateUserDataInitial(results);
    // })
})



