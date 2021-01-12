// dom elements
const displayUserData = [...document.querySelectorAll(".expand-user-details-btn")];
const userCardView = document.querySelector(".user-card-view");
const userCardContainer = document.querySelector(".user-card-container");
const filterBtns = document.querySelectorAll(".filter-btn")

// creating a user class
class Users{
  async getUsersData(){
    try{
     let results = await fetch("https://randomuser.me/api/?results=5&inc=gender,name,email,phone,cell,picture,location,nat&noinfo");
     return results;
    }catch(error){
      console.log(error);
    }
  }
}
class UI{
  displayUsersData(usersData){
    console.log(usersData)
    let personData = usersData.map(userData =>{
      return `
       <div class="individual-user-card-container">
              <!-- user-image -->
              <div class="user-image-container">
                <div class="image-border">
                  <img src="${userData.picture.medium}" alt="user's image" class="user-image">
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
                <button class="expand-user-details-btn">
                <i class="fas fa-arrow-right"></i>
                </button>
              </div>
            </div>
      `;
    })
    personData = personData.join("");
    userCardContainer.innerHTML = personData;
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
window.addEventListener("DOMContentLoaded",()=>{
    const users = new Users();
    const display = new UI();
    users.getUsersData()
    .then(response => response.json())
    .then(data =>{
      // destructuring the data into results
      let {results} = data;
      display.displayUsersData(results);
      display.filterUsers(results);
    })
})



