console.log("background running")







chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
      (async () => {

        console.log(request.txt)
        const prediction = await useModel(request.txt)
        console.log("Prediction:", prediction)
        sendResponse(prediction);
      })();
      return true; // keep the messaging channel open for sendResponse
  });

// chrome.runtime.onMessage.addListener((request, sender, sendResponse) => {
//       (async () => {

//         console.log(request.txt)
//         const prediction = await useModel(request.txt)
//         console.log("Prediction:", prediction)
//         sendResponse(prediction);
//       })();
//       return true; // keep the messaging channel open for sendResponse
//   });

// chrome.tabs.onUpdated.addListener( function (tabId, changeInfo, tab) {
  
//         chrome.tabs.query({},function(tabs){
//             chrome.tabs.sendMessage(tabId,{todo:"replace"})
//     })
// })






const MODEL_URL = '/model/model.json';


async function loadModel(){

    const model = await tf.loadLayersModel(MODEL_URL);
    console.log("model loaded")
    return model
    
}

var model = loadModel()


async function useModel(str){
    tf.setBackend('cpu');
    let cleaned_text = clean_text(str)
    // console.log("cleaned text")
    // console.log(cleaned_text)
    // console.log("----------")
    let tokenizedExample=tokenize(cleaned_text);
    let paddedExample = padSequence(tokenizedExample);
    let tensor = tf.tensor1d(paddedExample, dtype='int32').expandDims(0);
    
    // const model = await tf.loadLayersModel(MODEL_URL);

    pred = model.then(function (res) {
        console.log(str)
        let prediction = res.predict(tensor);
        tf.print(prediction)

        let dataPrediction = prediction.dataSync()[0]
        console.log("inside:")
        console.log(dataPrediction)
    
        return dataPrediction
    }, function (err) {
        console.log(err);
    });
    
    return pred
    // tf.print(tensor)



    // console.log(tf.getBackend());
}


// var example = "you're a dog";
// example =clean_text(example)
// useModel(example);







function getJSON(url) {
    var resp ;
    var xmlHttp ;

    resp  = '' ;
    xmlHttp = new XMLHttpRequest();

    if(xmlHttp != null)
    {
        xmlHttp.open( "GET", url, false );
        xmlHttp.send( null );
        resp = xmlHttp.responseText;
    }
    return resp ;
}
const word_dict = JSON.parse(getJSON('word_dict.json'));

function tokenize(message){
    let parts = message.split(" ");
    let tokenizedMessage = [];
    parts.forEach(part =>{ 
        if(part.trim() !=""){
            var index = 0
            if(word_dict[part] == null){
                index=0
            }
            else{
                index=word_dict[part]
            }
            tokenizedMessage.push(index)
        }
    });
    return tokenizedMessage
}

function padSequence(sequence){
    let maxlen = 200;
    if(sequence.length< maxlen){
        let array = []
        let i=0
        for(i=0;i<sequence.length;i++){
            array.push(sequence[i])
        }
        for(let j=i;j<200;j++){
            array.push(0)
        }
        return array
    }
    else{
        return sequence
    }
}


function clean_text(messy_text){
    //lower case
    text = messy_text.toLowerCase();
    
    //expand contractions
    text = removeContractions(text);

    //non a-z A-Z space characters removal
    let re = /[^a-z A-Z]/gi;
    text = text.replace(re,' ');
    

    // remove 's (website's..)
    text = text.replace(/'s/g, " ");

    //remove spaces inbetween words
    text = text.replace(/\s+/g, " ");
    //remove spaces from start and end of str
    text = text.trimEnd()
    text = text.trimStart()
    
    return text
}



function removeContractions(inputString) {   
    inputString = inputString.replace(/he's/g, "he is");
    inputString = inputString.replace(/ain't/g, "are not");
    inputString = inputString.replace(/it's/g, "it is");
    inputString = inputString.replace(/she's/g, "she is");
    inputString = inputString.replace(/there's/g, "there is");
  
    inputString = inputString.replace(/can't/g, "cannot");
    inputString = inputString.replace(/'cause/g, "because");
    inputString = inputString.replace(/he'd/g, "he would");
    inputString = inputString.replace(/how'd'y/g, "how do you");
    inputString = inputString.replace(/how'd/g, "how did");
  
    inputString = inputString.replace(/i'd/g, "i would");
    inputString = inputString.replace(/it'd/g, "it would");
    inputString = inputString.replace(/let's/g, "let us");
    inputString = inputString.replace(/ma'am/g, "madam");
  
    inputString = inputString.replace(/o'clock/g, "of the clock");
    inputString = inputString.replace(/she'd/g, "she would");
  
    inputString = inputString.replace(/that'd/g, "that would");
    inputString = inputString.replace(/there'd/g, "there would");
    inputString = inputString.replace(/they'd/g, "they would");
    inputString = inputString.replace(/e'd/g, "we would");
    inputString = inputString.replace(/where'd/g, "where did");
    inputString = inputString.replace(/y'all/g, "you all");
    inputString = inputString.replace(/y'all'd/g, "you all would");
    inputString = inputString.replace(/you'd/g, "you would");

    
    inputString = inputString.replace(/n't/g, " not");
    inputString = inputString.replace(/'re/g, " are");
    inputString = inputString.replace(/'m/g, " am");
    inputString = inputString.replace(/'ll/g, " will");
    inputString = inputString.replace(/'ve/g, " have");

    return inputString;
}

var example = "you're a dog";
example =clean_text(example)
useModel(example);

var example2 = "I have a great dog";
example2 =clean_text(example2)
useModel(example2);

var example3 = "You're a good sport";
example3 =clean_text(example3)
useModel(example3);

var example4 = "YOu're such a dirty pig";
example4 =clean_text(example4)
useModel(example4);

var example5 = "there's a little dirty pig taking a bath";
example5 =clean_text(example5)
useModel(example5);


// chrome.runtime.onMessage.addListener(
//     async function(request, sender, sendResponse){
//         console.log("background.js on message")
//         console.log(request.txt)
//         console.log(request.model)
//         result = useModel("soemthing very good")
//         console.log("The result inside background")
//         sendResponse(result);
//         return true
//     }
// )