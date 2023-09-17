let inputbox = document.getElementById('typeInput');
let input = inputbox.textContent;
let scorebox = document.getElementById('score');
let timeBox = document.getElementById('time');
let temps = timeBox.textContent;
let wrongCharacters = 0;
let testTime = 15;
inputbox.value = '';
let totalspacePress = 0;



function shuffle(array) {
    //this function shuffles the array to make the words in a different order each test.
    let currentIndex = array.length,  randomIndex;
    
    while (currentIndex != 0) {
        
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;
        
        [array[0], array[randomIndex]] = [array[randomIndex], array[0]];
        [array[currentIndex], array[randomIndex]] = [array[randomIndex], array[currentIndex]];
    }
    
    return array;
}

function timer() {
    //this function is run each second once the first input is detected.
    if (timeBox.textContent > 0 && testRunning === true) {
        timeBox.textContent--;
    }
    if ((timeBox.textContent == '0') || (i===wordList.length && testTime == 120)) {
        document.getElementById('resultCard').style.visibility = 'visible';
        document.getElementById('wpm').textContent = Math.floor((correctCharacters/5)*(60/(testTime-timeBox.textContent))) + ' WPM';
        document.getElementById('characters').textContent = correctCharacters + ' | ' + wrongCharacters;
        document.getElementById('raw').textContent = Math.floor((correctWords)*(60/(testTime-timeBox.textContent))) + 'wpm'
        testRunning = false;
        document.getElementById('words').style.display = 'none';
        
    }
    if (timeBox.textContent > 0 && i===wordList.length && testTime !=120) {
        i = 0;
        document.getElementById('words').textContent = '';
        printWords(shuffle(chooseList()));
    }
    
}

function printWords(wordList) {
    //create a span for each word
    for(let i = 0; i < wordList.length;i++) {
        var newtask = document.createElement('span');
        newtask.innerHTML = wordList[i];
        newtask.id = i;
        newtask.className = '';
        document.body.appendChild(newtask);
        document.getElementById('words').appendChild(newtask);
        document.getElementById('0').className = 'highlight';
}
    
}

function changeTestTime(time) {
    testRunning = false;
    document.getElementById('words').textContent = '';
    printWords(shuffle(chooseList()));
    document.getElementById(i).className = 'highlight';

    testTime = time;
    timeBox.textContent = time;
    temps = time;
}


var wordList = shuffle(chooseList());
let i = 0;
printWords(wordList);
var correctWords = 0;
var correctCharacters = 0;

var testRunning = false;

addEventListener('keyup', (nextWord)=> {
    //test started when input detected
    if (testRunning == false && timeBox.textContent != 0) {
        testRunning = true;
        setInterval(timer, 1000)
    }
    //if the spacebar is pressed,
    if(nextWord.isComposing || nextWord.keyCode === 32) {
        var wordInput = inputbox.value.split(' ');                      //split the input to select only the first part of the input if a letter is pressed after the space
        
        //check if the word is correctly typed
        if (wordInput[0] == wordList[i] && testRunning ==true) {
            correctWords++;
            correctCharacters += wordList[i].length + 1;
            document.getElementById(i).style.color = 'green';
        }
        else{wrongCharacters += wordInput[0].length}
        
        if(testRunning === true) {
            i++; //go to the next word
            totalspacePress++;
            scorebox.textContent = correctWords + '/' + totalspacePress;  //update the score
            if (wordInput[1] !== undefined && wordInput[1] !== null) {  //check if the second part of the input exist (there may be no letter after the space)
                inputbox.value = wordInput[1];                          //set the characters after the space in the inputbox (and erase the correctly typed word)
            document.getElementById(i).className = 'highlight';         //highlight the next word
            document.getElementById(i-1).className = '';
        }
        else{inputbox.value = ''}
        }
        
    }
});


document.getElementById('quoteGamemodeButton').addEventListener('click', (changeGamemodeToQuote)=> {
    testRunning = false;
    document.getElementById('words').textContent = '';
    wordList = '';
    wordList = chooseQuote();
    timeBox.style.display = 'none';
    testTime = 120;
    timeBox.textContent = '120';
    temps = '120';
    printWords(wordList);
    document.getElementById('words15GamemodeButton').style.visibility = 'hidden';
    document.getElementById('words30GamemodeButton').style.visibility = 'hidden';
    document.getElementById('words60GamemodeButton').style.visibility = 'hidden';
});

document.getElementById('wordsGamemodeButton').addEventListener('click', (changeGamemodeToWords) => {
    testRunning = false;
    document.getElementById('words').textContent = '';
    wordList = shuffle(chooseList());
    timeBox.style.display = 'block';
    changeTestTime(15);
    document.getElementById('words15GamemodeButton').style.visibility= 'visible';
    document.getElementById('words30GamemodeButton').style.visibility= 'visible';
    document.getElementById('words60GamemodeButton').style.visibility= 'visible';

});

document.getElementById('words15GamemodeButton').addEventListener('click', (changeGamemodeToWords15) => {
    changeTestTime(15);
})
document.getElementById('words30GamemodeButton').addEventListener('click', (changeGamemodeToWords15) => {
    changeTestTime(30);
})
document.getElementById('words60GamemodeButton').addEventListener('click', (changeGamemodeToWords15) => {
    changeTestTime(60);
})