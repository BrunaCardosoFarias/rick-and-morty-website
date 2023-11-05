document.addEventListener("DOMContentLoaded", function () {
    const characterList = document.getElementById("character-list");
    const characterSearchForm = document.getElementById("character-search-form");
    const pagination = document.getElementById("pagination");
    const API_URL = "https://rickandmortyapi.com/api/character";
    const characterDetails = document.getElementById("character-details");

    let currentPage = 1;
    const charactersPerPage = 10;

    function fetchAndDisplayCharacters(page = 1, name, status, gender) {
        const searchURL = `${API_URL}?page=${page}` +
            (name ? `&name=${name}` : "") +
            (status ? `&status=${status}` : "") +
            (gender ? `&gender=${gender}` : "");

        axios.get(searchURL)
            .then(response => {
                const characters = response.data.results;
                if (characters.length === 0) {
                    displayNoCharacterFound();
                } else {
                    displayCharacters(characters);
                    displayPagination(response.data.info);
                }
            })
            .catch(error => {
                if (error.response && error.response.status == 404) {
                    displayNoCharacterFound();
                } else {
                    console.error(error);
                    characterList.innerHTML = "<p>Erro ao buscar personagens. Tente novamente mais tarde.</p>";
                    pagination.innerHTML = "";
                }
            });
    }

    characterSearchForm?.addEventListener("submit", event => {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const status = document.getElementById("status").value;
        const gender = document.getElementById("gender").value;

        fetchAndDisplayCharacters(1, name, status, gender);
    });

    function displayCharacters(characters) {
        characterList.innerHTML = ""; // Limpa a lista de personagens
        characters.forEach(character => {
            const li = document.createElement("li");
            li.innerHTML = `
            <h3>${character.name}</h3>
            <img src="${character.image}" alt="Imagem do Personagem">
            <p>Status: ${character.status}</p>
            <p>Gênero: ${character.gender}</p>
            <a href="/character/${character.id}">Detalhes</a>
        `;
            characterList.appendChild(li);
        });
    }

    function displayNoCharacterFound() {
        characterList.innerHTML = "<p>Nenhum personagem encontrado.</p>";
        pagination.innerHTML = "";
    }

    function displayPagination(info) {
        pagination.innerHTML = "";
        const totalPages = info.pages;
        const prevButton = createPageButton("Anterior", currentPage - 1);
        const nextButton = createPageButton("Próxima", currentPage + 1);

        pagination.appendChild(prevButton);

        for (let i = 1; i <= totalPages; i++) {
            const pageButton = createPageButton(i, i);
            pagination.appendChild(pageButton);
        }

        pagination.appendChild(nextButton);
    }

    function createPageButton(label, page) {
        const button = document.createElement("button");
        button.setAttribute("class", "btn btn-secondary btn-sm mr-2");
        button.textContent = label;

        if (page < 1) {
            button.disabled = true;
        } else {
            button.addEventListener("click", () => {
                if (page !== currentPage) {
                    currentPage = page;
                    const name = document.getElementById("name").value;
                    const status = document.getElementById("status").value;
                    const gender = document.getElementById("gender").value;

                    fetchAndDisplayCharacters(page, name, status, gender);

                    window.scrollTo({
                        top: 0,
                        behavior: 'smooth' // Rolamento suave 😎
                    });
                }
            });
        }

        return button;
    }

    // Lógica para a página de detalhes do personagem
    if (window.location.pathname.startsWith("/character/")) {
        const characterId = window.location.pathname.split("/character/")[1];
        fetchCharacterDetails(characterId);
    }

    function fetchCharacterDetails(id) {
        const url = `${API_URL}/${id}`;
        axios.get(url)
            .then(response => {
                const character = response.data;
                displayCharacterDetails(character);
            })
            .catch(error => {
                console.error(error);
                characterDetails.innerHTML = "<p>Erro ao buscar detalhes do personagem. Tente novamente mais tarde.</p>";
            });
    }

    function displayCharacterDetails(character) {
        document.getElementById("character-img").setAttribute("src", character.image);
        document.getElementById("character-name").textContent = character.name;
        document.getElementById("character-status").textContent = `Status: ${character.status}`;
        document.getElementById("character-gender").textContent = `Gênero: ${character.gender}`;
        document.getElementById("character-species").textContent = `Espécie: ${character.species}`;
        document.getElementById("character-location").textContent = `Localização: ${character.location.name}`;
    }
});
