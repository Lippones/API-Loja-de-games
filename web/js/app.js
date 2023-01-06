let axiosConfig = {
    headers: {
        Authorization: 'Bearer ' + localStorage.getItem('token')
    }
}

function login(){
    const email = document.getElementById("emailLogin").value
    const password = document.getElementById("passwordLogin").value

    axios.post("http://localhost:3333/auth", {
        email,
        password
    }).then(res=>{
        let token = res.data.token;
        localStorage.setItem('token',token)
        axiosConfig.headers.Authorization = 'Bearer ' + localStorage.getItem("token")
        window.location.assign('/web/index.html')
    }).catch(err=>{
        console.log({error:"login invalido"})
    })
    
}

function createGame(){
    const title = document.getElementById("title").value
    const price = document.getElementById("price").value
    const year = document.getElementById("year").value
    const image = document.getElementById("image").value
    const game = {
        title,
        price,
        year,
        image
    }
    axios.post('http://localhost:3333/games',game, axiosConfig).then(res=>{
        if(res.status == 201){
            console.log("Game created")
        }else{
            console.log("Game not available")

        }
    }).catch(err=>{
        console.log(err)
    })

}
function deleteGame(listItem){
    const id = listItem.getAttribute("data-id")
    axios.delete(`http://localhost:3333/games/${id}`, axiosConfig).then(res=>{
        console.log("Game deleted")
    }).catch(err=>{
        console.log(err)
    })
}
function loadForm(listItem){
    const id = listItem.getAttribute("data-id")
    const title = listItem.getAttribute("data-title")
    const year = listItem.getAttribute("data-year")
    const price = listItem.getAttribute("data-price")
    const image = listItem.getAttribute("data-image")

    document.getElementById("idEdit").value = id
    document.getElementById("titleEdit").value = title
    document.getElementById("yearEdit").value = year
    document.getElementById("priceEdit").value = price
    document.getElementById("imageEdit").value = image
    
}
function update(){
    const id = document.getElementById("idEdit").value
    const title = document.getElementById("titleEdit").value
    const year = document.getElementById("yearEdit").value
    const price = document.getElementById("priceEdit").value
    const image = document.getElementById("imageEdit").value
    const game = {
        id,
        title,
        year,
        price,
        image
    }
    axios.put(`http://localhost:3333/games/`, game,axiosConfig).then(res=>{
        console.log("Game edited")
    }).catch(err=>{
        console.log(err)
    })
}

axios.get('http://localhost:3333/games',axiosConfig).then(res=>{
    const games = res.data
    const list = document.getElementById('games')
    games.map((game)=>{
        const li = document.createElement('li')
        const id = document.createElement('p')
        const title = document.createElement('p')
        const year = document.createElement('p')
        const price = document.createElement('p')
        li.setAttribute("data-id",game.id)
        li.setAttribute("data-title",game.title)
        li.setAttribute("data-year",game.year)
        li.setAttribute("data-price",game.price)
        li.setAttribute("data-image",game.image)

        id.append("ID: "+game.id)
        title.append("Titulo: "+game.title)
        year.append("Year: "+game.year)
        price.append("Preço: "+ game.price)

        li.appendChild(id)
        li.appendChild(title)
        li.appendChild(year)
        li.appendChild(price)
        list.appendChild(li)



        const btn = document.createElement('button')
        btn.innerHTML = 'Remove game'
        btn.addEventListener('click', ()=>{
            deleteGame(li)
        })
        const btnEdit = document.createElement('button')
        btnEdit.innerHTML = 'Edit game'
        btnEdit.addEventListener('click',()=>{
            loadForm(li)
        })


        li.appendChild(btnEdit)
        li.appendChild(btn)
        li.style.backgroundImage = `url(${game.image})`
        
    })
}).catch(err=>[
    console.log(err)
])