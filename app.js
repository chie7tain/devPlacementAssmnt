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
let usersPerPage = 3;
function paginateUserDataInitial(data){
  let paginatedUserData = [];
  let dataForFilter;
      for(let i = 0; i < page + usersPerPage; i++){
        paginatedUserData.push(data[i]);
      }
    displayUsersData(paginatedUserData);
    dataForFilter = paginatedUserData;
     filterUsers(dataForFilter)
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
     displayUsersData(paginatedUserData);
     dataForFilter = paginatedUserData;
      filterUsers(dataForFilter)
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
      displayUsersData(paginatedUserData);
      dataForFilter = paginatedUserData;
       filterUsers(dataForFilter)

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
                  <button class="expand-user-details-btn">
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
        userCardContainer.innerHTML =
        `
                   <!-- <div class="user-card-view">
              <div class="back-btn-container">
                <p class="back-btn-text">
                  <i class="fas fa-arrow-left"></i>
                  Results
                </p>
              </div>
              <div class="user-card-center">
                <div class="user-avatar-container">
                <div class="user-avatar-border">
                  <img src="./founder.jpg" alt="user image" class="user-avatar">
                </div>
              </div>
              <div class="user-details-container-user-card">
                <div class="name-of-user-container">
                  <h3 class="name-of-user">Chie7tain Okwuobi <span class="user-age">29</span></h3>
                </div>
                <div class="address-of-user-container">
                  <p class="address-of-user">
                    Plot C80 azhta off kurudu orozo road
                  </p>
                </div>
                <div class="email-of-user-container">
                  <p class="email-of-user">
                    <i class="fas fa-envelope"></i>
                    fredrickokwuobi@gmail.com
                  </p>
                </div>
                <div class="when-joined-container">
                  <p class="when-joined">
                    Joined: <span data-date-joined >2021-01-21</span>
                  </p>
                </div>
                <div class="telephone-number-of-user-container">
                  <div class="telephone-number-container">
                    <p class="telephone-number-of-user tel">
                      <i class="fas fa-phone-alt"></i>
                      08034829625</p>
                  </div>
                  <div class="mobile-number-of-user-container">
                    <p class="mobile-number-of-user tel">
                      <i class="fas fa-mobile-alt"></i>
                      081-334-841-33
                    </p>
                  </div>
                </div>
              </div>
              </div> -->
              <!-- end of user-card center -->
            <!-- </div> -->
        `
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
window.addEventListener("DOMContentLoaded",()=>{
// creating new instances of the users and  UI class
    // const users = new Users();
    // const display = new UI();
    getUsersData()
    .then(response => response.json())
    .then(data =>{
      let {results} = data;
      displayUsersData(results);
      // filterUsers(results);
     paginateUserDataInitial(results);
    })
})



