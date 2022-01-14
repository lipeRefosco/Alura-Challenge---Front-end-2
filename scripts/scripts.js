document.addEventListener("DOMContentLoaded", loadedPage);
document.querySelector("#project__save-btn").addEventListener("click", saveProject);
document.querySelector("#project__color").addEventListener("change", changeBgCodeEditor);
window.addEventListener("hashchange", changeContentPage);

function loadedPage(){
    // Quando acontecer um load na pagina executa estes script
    additionsMenuLinks();
    changeContentPage();
    
}

function changeContentPage(){
    additionsMenuLinks();
    // changeBgCodeEditor();

    // Pegar a hash atual
    const hashPage = window.location.hash;
    const pageName = hashPage.replace("#", "");

    // Pegar o ID que será inserido o conteudo
    const localInsertContent = document.getElementById("content");
    const middleColumn = document.querySelectorAll(".column__middle")[1];
    const rightColumn = document.querySelectorAll(".column__right")[1];

    // pegar o arquivo com o mesmo nome da hash
    if(pageName === "" || pageName === "code-editor"){
        addOnPageAJAX(`pages/code-editor.html`, localInsertContent);
        rmClassElement( middleColumn, "width100" );
        rmClassElement( rightColumn, "hidden" );
    }else if(pageName === "community"){
        localInsertContent.innerHTML = "";
        loadCommunityCards(localInsertContent);
        addClassElement( rightColumn, "hidden" );
        addClassElement( middleColumn, "width100" );
    }else{
        addOnPageAJAX(`pages/${pageName}.html`, localInsertContent);
        addClassElement( rightColumn, "hidden" );
        addClassElement( middleColumn, "width100" );
    }
    
    addHighlight()
}

function changeBgCodeEditor() {
    // Get Code-editor and color picker
    const codeEditor = document.querySelector("#code-editor");
    const colorProject = document.querySelector("#project__color");

    // Change Code Editor background
    codeEditor.style.backgroundColor = colorProject.value;
}

function additionsMenuLinks(){
    // Adiciona coisas nos itens do menu 

    let menuItem = document.getElementsByClassName('menu__button');
    for (let i = 0; i < menuItem.length; i++) {
        
        // Adiciona a função aos itens do menu

        if( isCurrentPage(menuItem[i]) ){ // Se for igual a pagina adiciona o estilo ao elemento
            addClassElement(menuItem[i], "on-page");
        }else if(menuItem[i].hash === "#code-editor" && window.location.hash === ""){
            addClassElement( menuItem[i], "on-page" );
        }else{
            rmClassElement(menuItem[i], "on-page")
        }

    }
}

function loadCommunityCards(target) {
    if( localStorage.length === 0 ){
        target.insertAdjacentHTML('afterbegin', "<p>Nenhum card foi cadastrado, seja o primeiro ;)</p>")
        return;
    }

    // const dataObject = {
    //     id          : localStorage.length + 1,
    //     name        : nameProject,
    //     description : descriptionProject,
    //     lang        : langProject,
    //     color       : colorProject,
    //     code        : codeProject,
    //     likes       : 0,
    //     date        : Date.now()
    // };

    for (let i = 0; i < localStorage.length; i++) {
        // Seleciona o card
        let card = localStorage.getItem( i+1 );
        
        // Transforma em Objeto
        cardProject = JSON.parse(card);

        // Insere no target
        target.insertAdjacentHTML('afterbegin', `
<div class="card__project">
    <div class="code-editor" style="background-color: ${cardProject.color};">
        <div class="code-editor__window">
            <div class="code-editor__header">
                <div class="code-editor__buttons">
                    <div class="code-editor__button close"></div>
                    <div class="code-editor__button minimaze"></div>
                    <div class="code-editor__button maximaze"></div>
                </div>
            </div>
            <div class="code-editor__body">
                <pre><code>${cardProject.code}</code></pre>
            </div>
        </div>
    </div>
    <div class="card__body">
        <h2 class="card__title">${cardProject.name}</h2>
        <p class="card__description">${cardProject.description}</p> 
    </div>
    <div class="card__footer">
        <div>
            <button class="card__btn">
                <div class="icon icon-comment"></div>
                9
            </button>
            <button class="card__btn">
                <div class="icon icon-heart"></div>
                ${cardProject.likes}
            </button>
        </div>
        <button class="card__user user">
            <img src="./assets/img/perfil.jpg" class="user__img">
            <span class="user__name">@Harry</span>
        </button>
    </div>
</div>
`); // Fim do insertAdjacentHTML
    } // Fim loop
}

function addOnPageAJAX(url, target) {
    fetch(url)
    .then( (html) => {
        return html.text();
    })
    .then( (data) => {
        target.innerHTML = data;
    })
}

function isCurrentPage(link){
    // Verifica se o link tem o mesmo pathname que a URL
    let page = window.location.hash;
    let onPage = page.replace("#", )

    // Se o link e a pagina tiverem o mesmo href
    if( link.hash === page){
        return true;
    }else{
        return false;
    }

}

function addClassElement(element, cssClass){
    // Adiciona a classe
    element.classList.add(cssClass);
}

function rmClassElement(element, cssClass){
    // Remove a classe
    element.classList.remove(cssClass);
}

function highlightCode() {

    const content = document.querySelector("#content");
    const code = document.querySelector("#code-editor__code").value;
    const colorSelected = document.querySelector("#project__color").value;
    
    // Cria um popup com o codigo em highlight
    content.insertAdjacentHTML('beforeend', `
    <div id="code-editor__highlight" class="code-editor__highlight">
        <button class="btn__outlined icon icon-close" onclick="highlightCodeClose()"></button>
        <div class="code-editor" style="background-color: ${colorSelected};">
        <div class="code-editor__window">
            <div class="code-editor__header">
                <div class="code-editor__buttons">
                    <div class="code-editor__button close"></div>
                    <div class="code-editor__button minimaze"></div>
                    <div class="code-editor__button maximaze"></div>
                </div>
            </div>
            <div class="code-editor__body">
                <pre><code>${code}</code></pre>
            </div>
        </div>
    </div>
    </div>
    `);

    // Adiciona o highlight
    addHighlight()
}

function highlightCodeClose(){
    const highlight = document.querySelector("#code-editor__highlight")
    highlight.remove()
}

function saveProject() {
    // Salva o projeto no localStorage

    // Recupera a data dinamica de quando foi salvo
    let dateSaved = new Date();
    dateSaved.toString();

    // Recupera os dados a serem salvos
    const nameProject = document.querySelector("#project__name").value;
    const descriptionProject = document.querySelector("#project__name").value;
    const langProject = document.querySelector("#project__langs").value;
    const colorProject = document.querySelector("#project__color").value;
    const codeProject = document.querySelector("#code-editor__code").value;

    // Transforma os dados em um objeto
    const dataObject = {
        id          : localStorage.length + 1,
        name        : nameProject,
        description : descriptionProject,
        lang        : langProject,
        color       : colorProject,
        code        : codeProject,
        likes       : 0,
        date        : Date.now()
    };

    // Transforma o objeto em string
    const dataJSON = JSON.stringify(dataObject);

    localStorage.setItem(dataObject.id, dataJSON);

    console.log("Projeto salvo!");
    // console.log(localStorage);
}

function addHighlight() {
    document.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
        rmClassElement(el, "hljs");
    });
}