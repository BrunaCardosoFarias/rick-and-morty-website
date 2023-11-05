document.addEventListener("DOMContentLoaded", function () {
    const characterList = document.getElementById("character-list");
    const characterSearchForm = document.getElementById("character-search-form");
    const pagination = document.getElementById("pagination");
    const API_URL = "https://rickandmortyapi.com/api/character";

    let currentPage = 1;
    const charactersPerPage = 10;

    function fetchCharacters(page = 1) {
        const url = `${API_URL}?page=${page}`;
        axios.get(url)
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
                if (error.response.status == 404) {
                    displayNoCharacterFound();
                }
                else {
                    console.error(error);
                    characterList.innerHTML = "<p>Erro ao buscar personagens. Tente novamente mais tarde.</p>";
                    pagination.innerHTML = "";
                }
            });
    }

    function displayCharacters(characters) {
        characterList.innerHTML = ""; // Limpa a lista de personagens
        characters.forEach(character => {
            const li = document.createElement("li");
            li.innerHTML = `
                <h3>${character.name}</h3>
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
        button.textContent = label;

        if (page < 1) {
            button.disabled = true;
        } else {
            button.addEventListener("click", () => {
                if (page !== currentPage) {
                    currentPage = page;
                    fetchCharacters(page);
                }
            });
        }

        return button;
    }

    characterSearchForm.addEventListener("submit", event => {
        event.preventDefault();
        const name = document.getElementById("name").value;
        const status = document.getElementById("status").value;
        const gender = document.getElementById("gender").value;

        const searchURL = `${API_URL}?page=1` +
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
                if (error.response.status == 404) {
                    displayNoCharacterFound();
                }
                else {
                    console.error(error);
                    characterList.innerHTML = "<p>Erro ao buscar personagens. Tente novamente mais tarde.</p>";
                    pagination.innerHTML = "";
                }
            });
    });

    fetchCharacters();
});