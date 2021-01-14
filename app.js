// dom elements

const userCardView = document.querySelector(".user-card-view");
const userCardContainer = document.querySelector(".user-card-container");
const filterBtns = document.querySelectorAll(".filter-btn")
const prevBtn = document.querySelector(".prev-btn");
const nextBtn = document.querySelector(".next-btn");
// creating a user class
// class Users{
  async function getUsersData(){
    try{
     let results = await fetch("https://randomuser.me/api/?page=6&results=25&seed=abcdefgh&inc=gender,name,email,phone,cell,picture,location,nat&noinfo");
     return results;
    }catch(error){
      console.log(error);
    }
  }
// }
let page = 0;
let paginatedUserData = [];
function paginateUserDataInitial(data){
      for(let i = 0; i < page + 5; i++){
        paginatedUserData.push(data[i]);
      }
    displayUsersData(paginatedUserData);
        nextBtn.addEventListener("click",()=>{
      if(page == data.length - 5){
        page = 0;
      }else{
        page += 5;
      }
      paginatedUserData = [];
      for(let i = page; i < page + 5; i++){
        paginatedUserData.push(data[i])
      }
      displayUsersData(paginatedUserData)
    })

    prevBtn.addEventListener("click",()=>{
      if(page == 0){
        page = data.length - 5;
      }else{
        page -= 5;
      }
      paginatedUserData = [];
      for(let i = page; i < page + 5; i++){
        paginatedUserData.push(data[i]);
      }
      displayUsersData(paginatedUserData);
    })
  }

// class UI{

  function displayUsersData(usersData){
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
window.addEventListener("DOMContentLoaded",()=>{
// creating new instances of the users and  UI class
    // const users = new Users();
    // const display = new UI();
    getUsersData()
    .then(response => response.json())
    .then(data =>{
      let {results} = data;
      displayUsersData(results);
      filterUsers(results);
      paginateUserDataInitial(results);

    })
})



