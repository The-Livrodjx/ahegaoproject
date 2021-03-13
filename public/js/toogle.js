var toggled = false;

var switchHolder = document.getElementById("outer-div");
var switchButton = document.getElementById("inner-div");
var navbar = document.querySelector('.navbar')
var card = document.querySelectorAll('div.card')
var cardTitles = document.querySelectorAll('div.card > h2, a.author')
var cardWatchBtn = document.querySelectorAll('a.watch-btn')

var footer = document.querySelector('section.footer')

switchButton.addEventListener('click',function () {
    if(!toggled){
    switchButton.style.transition =".4s all ease-in-out";
    switchButton.style.transform ="translateX(48px)";
    switchButton.style.backgroundColor = "whitesmoke";
    switchHolder.style.border= "2px solid whitesmoke";
    
    navbar.style.backgroundColor = "#111"
    footer.style.backgroundColor = "#111"
    
    document.body.style = "background-color: #222";
    
    card.forEach(cards => {
        cards.style.backgroundColor = "#222"
        
    })

    cardTitles.forEach(cardsTitles => {
        cardsTitles.style.color = "whitesmoke"
    })

    cardWatchBtn.forEach(watchBtns => {
        watchBtns.style.color = "#222"
        watchBtns.style.backgroundColor = "whitesmoke"
    })


    toggled = true;

    }else{

    switchButton.style.transition = ".4s all ease-in-out";
    switchButton.style.transform = "translateX(-1px)";
    switchButton.style.backgroundColor = "whitesmoke";
    switchHolder.style.border= "2px solid whitesmoke";
    

    navbar.style.backgroundColor = "#222"
    footer.style.backgroundColor = "#222"
    

    document.body.style = "background-color: whitesmoke";

    card.forEach(cards => {
        cards.style.backgroundColor = "whitesmoke"
    })

    cardTitles.forEach(cardsTitles => {
        cardsTitles.style.color = "#222"
    })

    cardWatchBtn.forEach(watchBtns => {
        watchBtns.style.color = "whitesmoke"
        watchBtns.style.backgroundColor = "#222"
    })
    toggled = false;
    }
});
