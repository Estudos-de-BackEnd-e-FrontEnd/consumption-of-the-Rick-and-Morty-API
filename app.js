import axios from "https://cdn.skypack.dev/axios"
const section = document.getElementById('main-home__container-cards')
const paginationContainter = document.getElementById('main-home__pagination-container')
const footerInfo = document.getElementById("footer-home__info")

const listAllcharacters = async (page)=>{
    const response = await axios.get(`https://rickandmortyapi.com/api/character/?page=${page?page:1}`)
    const data = response.data
    return data
}

function groupThePages(pages, group){
    const groupPages = []
    let qtd = group -1

    for(let i = 1; i <= pages; i+=5){
        let array = []
        for(let j = i; j <= i + qtd; j++){
            if(j === pages + 1){
                break
            }
            array.push(j)
        }
        
        groupPages.push(array)
    }
    return groupPages
}

const characterEpisode = async (locationUrl)=>{
    const response = await axios.get(`${locationUrl}`)
    
    return response.data.name
}

const cardRender = async (pages) =>{
    section.innerHTML = ""
    
    const character = await listAllcharacters(pages)
  
    const CharacterEpisodePromisses = character.results.map(async (character)=>{
        let len = character.episode.length - 1
        let lastEpisode = character.episode[len]
        const episode = await characterEpisode(lastEpisode)

        return {character, episode}
    })

    const resolvePromisses = Promise.all(CharacterEpisodePromisses)
    const data = await resolvePromisses
    cardTemplate(data)

    return character.info.pages
}

let pages = await cardRender()
const arrayBtns = groupThePages(pages, 5)

const btnBack = document.createElement("button")
const btnForward = document.createElement("button")
const btns = document.createElement("div")

btnBack.classList.add("main-home__pagination-controller__btn")
btnForward.classList.add("main-home__pagination-controller__btn")
btns.classList.add("main-home__pagination-controller__btn")

btnBack.innerText = "Anterior"
btnForward.innerText = "Próximo"

paginationContainter.appendChild(btnBack)
paginationContainter.appendChild(btns)
paginationContainter.appendChild(btnForward)

let groupCounter = 0
let pageCounter = 1

function createBtns(counter){
    let array = []
    for(let i = 0; i < arrayBtns[counter].length ; i++){
        const btn = document.createElement("button")
    
        btn.setAttribute("id", `${arrayBtns[counter][i]}`)
        btn.innerText = `${arrayBtns[counter][i]}`
        btn.classList.add("controller__btn--length")
        btns.appendChild(btn)
        array.push(btn)
        
        if(array[0].getAttribute("id") == 1){
            array[0].setAttribute("disabled", true)
        }
         
        btn.addEventListener("click", (e)=>{
            
            for(let i = 0; i < array.length; i++){
                array[i].removeAttribute("disabled")
                 
            }

            let btnCurrent = document.getElementById(`${e.target.id}`)
            
            btnCurrent.setAttribute("disabled", true)
            cardRender(e.target.id)
            pageCounter = e.target.id

        })
    }
    return true
}

createBtns(groupCounter)

btnForward.addEventListener("click", ()=>{
    if(pageCounter % 5 === 0 && pageCounter !== 0){
        btns.innerHTML = ""
        groupCounter++
        createBtns(groupCounter)     
    }
    
    if(pageCounter < pages){
        pageCounter++
        console.log("forward após counter",pageCounter)
        cardRender(pageCounter)
        
        let btnCurrent = document.getElementById(`${pageCounter}`)
       
        let btnPrev = document.getElementById(`${pageCounter - 1}`)
    
        btnCurrent.setAttribute("disabled", true)
        if(btnPrev){
            btnPrev.removeAttribute("disabled")
        }  
    }
})

btnBack.addEventListener("click", ()=>{
    let group = groupThePages(42,5)

    if(pageCounter == group[groupCounter][0]){
        btns.innerHTML = ""
        if(groupCounter > 0){
            groupCounter--
        }
        
        createBtns(groupCounter)
    }
    if(pageCounter > 1){
        pageCounter--
        console.log("back depois do counter", pageCounter)
        cardRender(pageCounter)
         
        let btn1 = document.getElementById("1")
        if(btn1){
            btn1.removeAttribute("disabled")
        }
  
        let btnCurrent = document.getElementById(`${pageCounter}`)
        console.log(btnCurrent)
        if(btnCurrent){
            btnCurrent.setAttribute("disabled", true)
        }
        
        let btnPrev = document.getElementById(`${pageCounter + 1}`)
        if(btnPrev){
            btnPrev.removeAttribute("disabled")
        }
    }
})

function cardStatus(status){

    switch (status) {
        case "Alive":
            return  `<span class="circle circle__green"></span> Alive`
        case "Dead":
            return `<span class="circle circle__red"></span> Dead`
        default:
            return `<span class="circle circle__gray"></span> Unknown`
    }

} 

function cardTemplate(data){
    data.map((item, index)=>{
        const {image, name, status, species, location} = item.character
        const {episode} = item 

        section.innerHTML +=`
      
        <div class="card">
            <figure class="card__image">
                <img class="card__image-content" src=${image}>
            </figure>
            <div class="card__content">
                <h3 class="card_title color--green">${name}</h3>
                <div class="card__features color--black">
                    <p class="card_status">${cardStatus(status)}<span class="card_status_seperate">-</span></p>
                    <p class="card_species"> ${species} </p>
                </div>
                <p class="card_location_info color--black">Última localização conhecida</p>
                <p class="card_location color--gray">${location.name}</p>
                <p class="card_episode_info color--black">Vista a ultima vez em:</p>
                <p class="card_episode color--gray">${episode}</p>
            </div>
        </div>
        
        ${index % 2 !== 0 && index !== 19? `<span class="divisor"></span>`: ``}
        
        `
    })
}

async function setfooterInfo(){
    const characters = await axios.get("https://rickandmortyapi.com/api/character")
    const locations = await  axios.get("https://rickandmortyapi.com/api/location")
    const episodes = await axios.get("https://rickandmortyapi.com/api/episode")
   
    const characterParagraph = document.createElement("p")
    const locationParagraph = document.createElement("p")
    const episodeParagraph = document.createElement("p")

    characterParagraph.innerText = `PERSONAGENS: ${characters.data.info.count}`
    locationParagraph.innerText = `LOCALIZAÇÕES: ${locations.data.info.count}`
    episodeParagraph.innerText = `EPISÓDIOS: ${episodes.data.info.count}`

    footerInfo.appendChild(characterParagraph)
    footerInfo.appendChild(locationParagraph)
    footerInfo.appendChild(episodeParagraph)


}

setfooterInfo()

 