const section = document.getElementById("main-home__container-cards")


async function listCharacters(page) {
    const  response = await axios.get(`https://rickandmortyapi.com/api/character/?page=${page}`)
    return  response.data
}

async function nameEpisode(episode) {
    const response = await axios.get(`${episode}`)
    return response.data.name 
}

const cardRender = async (page) => {
    const data = await listCharacters(page)
    console.log(data)
    console.log(cardTemplate(data.results))

}

cardRender(1)

function fiveOnFive(pages, group) {
    const groupPages = []
    let qtd = group -1

    for (let i = 1; i <= pages; i+=group) {
        let array =  [];
        for (let j = i; j <= i + qtd; j++){
            if (j === pages + 1) {
                break
            }
           array.push(j)
        }
       groupPages.push(array)     
    }
    return groupPages
}

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
    data.map(async (item, index)=>{
        const {image, name, status, species, location, episode} = item

        const lastEpisode = episode.length - 1

        const getEpisode = await nameEpisode(episode[lastEpisode])
        console.log(index)

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
                <p class="card_episode color--gray">${getEpisode}</p>
            </div>
        </div>
        
        ${index % 2 !== 0 && index !== 19? `<span class="divisor"></span>`: ``}
        
        `
    })

    return data
}
