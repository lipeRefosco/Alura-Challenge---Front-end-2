document.addEventListener('DOMContentLoaded', loadedPage);
document.querySelector('#project__save-btn').addEventListener('click', saveProject);
document.querySelector('#project__color').addEventListener('change', changeBgCodeEditor);
window.onhashchange = changeContentPage;

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
    const localInsertContent = document.getElementById('content');
    const middleColumn = document.querySelectorAll(".column__middle")[1];
    const rightColumn = document.querySelectorAll(".column__right")[1];

    // pegar o arquivo com o mesmo nome da hash
    if(pageName === "" || pageName === "code-editor"){
        addOnPageAJAX(`pages/code-editor.html`, localInsertContent);
        rmClassElement( middleColumn, "width100" );
        setTimeout(1000);
        rmClassElement( rightColumn, "hidden" );
    }else if(pageName === "community"){
        localInsertContent.innerHTML = "";
        loadCommunityCards(localInsertContent);
        addClassElement( rightColumn, "hidden" );
        setTimeout(1000);
        addClassElement( middleColumn, "width100" );
    }else{
        addOnPageAJAX(`pages/${pageName}.html`, localInsertContent);
        addClassElement( middleColumn, "width100" );
        addClassElement( rightColumn, "hidden" );
    }
    
    document.querySelectorAll('pre code').forEach((el) => {
        hljs.highlightElement(el);
        rmClassElement(el, 'hljs');
    });
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
        }else{
            rmClassElement(menuItem[i], "on-page")
        }

    }
}

function loadCommunityCards(target) {
    for (let i = 0; i < localStorage.length; i++) {
        // Seleciona o card
        let card = localStorage.getItem( localStorage.key(i) );
        
        // Transforma em Objeto
        cardObject = JSON.parse(card);


        if( localStorage.length === 0 ){
            target.insertAdjacentHTML('afterbegin', "<p>Nenhum card foi cadastrado, seja o primeiro ;)</p>")
            return;
        }
        // Insere na target
        target.insertAdjacentHTML('beforeend', `<div class="card__project">
    <div class="code-editor" style="background-color: ${cardObject.colorProject}">
        <div class="code-editor__window">
            <div class="code-editor__header">
                <div class="code-editor__buttons">
                    <div class="code-editor__button close"></div>
                    <div class="code-editor__button minimaze"></div>
                    <div class="code-editor__button maximaze"></div>
                </div>
            </div>
            <div class="code-editor__body">
                <pre>
                    <code>
${cardObject.codeProject}
                    </code>
                </pre>
            </div>
        </div>
    </div>
    <div class="card__body">
        <h2 class="card__title">${cardObject.nameProject}</h2>
        <p class="card__description">${cardObject.descriptionProject}</p> 
    </div>
    <div class="card__footer">
        <div>
            <button class="card__btn">
                <div class="icon icon-comment"></div>
                9
            </button>
            <button class="card__btn">
                <div class="icon icon-heart"></div>
                9
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

    // Se o link e a pagina tiverem o mesmo href
    if( link.hash === page || page === ""){
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
        nameProject : nameProject,
        descriptionProject : descriptionProject,
        langProject : langProject,
        colorProject : colorProject,
        codeProject : codeProject
    };

    // Transforma o objeto em string
    const dataJSON = JSON.stringify(dataObject);

    localStorage.setItem(dateSaved, dataJSON);

    console.log("Projeto salvo!");
    console.log(localStorage);
}