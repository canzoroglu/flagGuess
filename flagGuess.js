function startGame(){
  var parser = new DOMParser();
  $.get("http://flagpedia.net/index", function(data){
    //creating DOM elements of the page
    var htmlDoc = parser.parseFromString(data, "text/html");
    //array includes elements with alt attribute
    var flagArr = htmlDoc.querySelectorAll("[alt]");
    var flagRegex = /:(.*)/;
    var countryNameRegex = /Flag of (.*)/;
    var countries = {};//maps country name to flags
    for(var i = 0; i < flagArr.length; i++){
      var img = "http:" + flagRegex.exec(flagArr[i].src)[1];
      var countryName = countryNameRegex.exec(flagArr[i].alt)[1]; 
      countries[countryName] = img;
    }
    gameLayout(countries);
    //cannot return countries directly to the global so use another function
    //https://stackoverflow.com/questions/11156852/get-returned-values-from-jquery-get
  });
}

//combines answers and the flag with DOM elements
function gameLayout(countryObj){
  var flagDiv = document.querySelector("#flags");
  var para = document.querySelector("p");
  para.textContent = "";
  var ol = document.querySelector("ol");
  ol.innerHTML = "";
  var img = document.querySelector("img");
  img.src = "";
  var options = createOptions(countryObj);
  var keys = Object.keys(countryObj);
  var flag = options[0];
  var answers = options[1];
  var rightAnswer = options[2];
  var shuffledAnswers = shuffleArr(answers);
  img.src = flag;
  flagDiv.appendChild(img); 
  for(var i = 0; i < shuffledAnswers.length; i++){
    var li = document.createElement("li");
    li.textContent = keys[shuffledAnswers[i]];
    ol.appendChild(li);
  }
  ol.addEventListener("click", function(event){
    if(event.target.textContent === rightAnswer){
      para.textContent = "Right Answer";
    }else{
      para.textContent = "Answer is " + rightAnswer;
    }
  });
}

//returns an array whose 1st element is flag url, and 
//second one is the array of answer 
//4 of them answers is wrong and one of true
function createOptions(countryObj){
  var num = Math.floor(Math.random() * 199);
  var keys = Object.keys(countryObj);
  var rightAnswer = keys[num];
  var flag = countryObj[rightAnswer];
  var answers = [];
  for(var i = 0; ; i++){
    var wrong = Math.floor(Math.random() * 199) ;
    if(wrong !== num || answers.indexOf(wrong) !== -1){
      answers.push(wrong);
    }
    if(answers.length === 4){
      break;
    }
  }
  answers.push(num);
  return [flag, answers, rightAnswer];

}



