const configBtn = document.querySelector('#configBtn')
const configContainer = document.querySelector('div.config-container')
const mainContainer = document.querySelector('div.main_container')

configBtn.onclick = e => {
    e.preventDefault();

    mainContainer.classList.add('dont-show-this')
    configContainer.classList.remove('dont-show-this')
    console.log(configContainer, mainContainer)
}

$(document).ready(function () {
    $(".hamburger").click(function () {
        $(".wrapper").toggleClass("collapse");
    });
});

const validURL = (str) => {
    if (str != null && str != '') {
        var pattern = new RegExp('^(https?:\\/\\/)?' + // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|' + // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))' + // ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*' + //port
            '(\\?[;&a-z\\d%_.~+=-]*)?' + // query string
            '(\\#[-a-z\\d_]*)?$', 'i');
        return pattern.test(str);
    }
    return false;
}

function validaForm(frm) {
    frm.preventDefault()
    /*
    o parâmetro frm desta função significa: this.form,
    pois a chamada da função - validaForm(this) foi
    definida na tag form.
    */
    //Verifica se o campo nome foi preenchido e
    //contém no mínimo três caracteres.
    if (frm.target.name.value === "" || frm.target.name.value === null || frm.target.name.value.lenght < 3) {
        //É mostrado um alerta, caso o campo esteja vazio.
        alert("Por favor, digite um nome válido.");
        //Foi definido um focus no campo.
        frm.target.name.focus();
        //o form não é enviado.
        return false;
    }

    if (frm.target.name.value.indexOf('<') !== -1 ||
        frm.target.name.value.indexOf('>') !== -1 ||
        frm.target.name.value.indexOf('/') !== -1) {
        //É mostrado um alerta, caso o campo esteja vazio.
        alert("Por favor, não use caracteres especiais.");

        frm.target.title.value = ""


        return false;
    }

    if (frm.target.profileImage.value.indexOf('<') !== -1 ||
        frm.target.profileImage.value.indexOf('>') !== -1
    ) {
        //É mostrado um alerta, caso o campo esteja vazio.
        alert("Por favor, não use caracteres especiais.");

        frm.target.profileImage.value = ""


        return false;
    }

    if (!validURL(frm.target.profileImage.value)) {
        alert("Por favor, digite um link válido.");

        frm.target.profileImage.value = ""


        return false;
    }

    if (frm.target.quotation.value === "" || frm.target.quotation.value === null || frm.target.quotation.value.lenght < 3) {
        //É mostrado um alerta, caso o campo esteja vazio.
        alert("Por favor, digite uma frase.");
        //Foi definido um focus no campo.
        frm.target.quotation.focus();
        //o form não é enviado.
        return false;
    }

    if (frm.target.quotation.value.indexOf('<') !== -1 ||
        frm.target.quotation.value.indexOf('>') !== -1 ||
        frm.target.quotation.value.indexOf('/') !== -1) {
        //É mostrado um alerta, caso o campo esteja vazio.
        alert("Por favor, não use caracteres especiais.");

        frm.target.title.value = ""


        return false;
    }


    else {

        frm.target.action = '/profile/save';
        frm.target.method = 'POST';
        frm.target.submit();
    }
}

function getVideoDuration(video, videoID) {


    var tempo = video.duration
    var horas = Math.floor(tempo / 3600);
    var minutos = Math.floor((tempo - (horas * 3600)) / 60);
    var segundos = Math.floor(tempo % 60);

    if (horas < 10) horas = '0' + horas;
    if (minutos < 10) minutos = '0' + minutos;
    if (segundos < 10) segundos = '0' + segundos;

    var tempoAtual = video.currentTime
    var horas2 = Math.floor(tempoAtual / 3600);
    var minutos2 = Math.floor((tempoAtual - (horas2 * 3600)) / 60);
    var segundos2 = Math.floor(tempoAtual % 60);

    if (horas2 < 10) horas2 = '0' + horas2;
    if (minutos2 < 10) minutos2 = '0' + minutos2;
    if (segundos2 < 10) segundos2 = '0' + segundos2;



    return document.getElementById(`${videoID}`).innerHTML = horas2 + ':' + minutos2 + ':' + segundos2 + '/' + horas + ':' + minutos + ':' + segundos
}

var allTheVideos = document.querySelectorAll('video.preview')
var valueOfTheLoop = allTheVideos.length

allTheVideos.forEach((video, index) => {



    video.onmouseover = (e) => {
        let currentVideo = e.target


        currentVideo.toggleAttribute("controls")
    }


    video.onmouseleave = (e) => {
        let currentVideo = e.target


        currentVideo.toggleAttribute("controls")
    }

})

