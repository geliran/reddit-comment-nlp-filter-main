//the page takes time to load, the comments don't load all at once
function loadComments(){
    var reditComments
    // var youtubeComments
        reditComments = document.querySelectorAll('._3cjCphgls6DH-irkVaA0GM')
        // console.log(reditComments.length)
        // youtubeComments = document.querySelectorAll('ytd-comment-renderer')
        const censor = "***** CONTENT CENSORED *****" 
        for(let i = 0; i < reditComments.length; i++){
            let comment = reditComments[i].textContent

            //making a message
            let message = {txt:comment}
            //|| && !(comment.endsWith('(Positive)'))
            if(comment.localeCompare(censor)!=0 ){
                chrome.extension.sendMessage(message,function(response){
                    // console.log(comment +" : "+ response)
                    if(response>=0.5){
                        // reditComments[i].style.backgroundColor = "black"
                        reditComments[i].textContent= censor
                    }
                    reditComments[i].className="Changed"
                });
            }
        }
        // for(var i = 0; i < youtubeComments.length; i++){
        //     youtubeComments[i].style.backgroundColor = "black"
        //     console.log(i)
        // }
    // return comments
}



window.setInterval(loadComments,2000)
loadComments()








// function replaceText(element){
//     if (element.hasChildNodes()){
//         element.childNodes.forEach(replaceText)
//     }
//     else if(element.nodeType === Text.TEXT_NODE){
//         element.textContent = element.textContent.replace(
//         /the/gi,'***')
//     }

    
// }


