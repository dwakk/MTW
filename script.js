let inputbox = document.getElementById('typeInput');
let input = inputbox.textContent;
let scorebox = document.getElementById('score');
let timeBox = document.getElementById('time');
let wordBox = document.getElementById('words');

let gamemode = sessionStorage.getItem('gm');
let theme = localStorage.getItem('theme');
let textColor = localStorage.getItem('textColor');
changeClientTheme(theme);
if (window.sessionStorage.getItem('sesionWpmArray') == undefined && sessionStorage.getItem('sessionWpmArray') == null) {
    window.sessionStorage.setItem('sessionWpmArray', '');
}

var wordList = shuffle(chooseList());
let wrongCharacters = 0;
inputbox.value = '';
let totalspacePress = 0;
let testTime = 15;
let i = 0;
printWords(wordList);
let correctWords = 0;
let correctCharacters = 0;
let testRunning = false;
let TimerObject;
let hardmode = false;


function switchGamemode() {
    switch (sessionStorage.getItem('gm')) {
        case 'quote' :
            changeQuoteLength()
            printWords(wordList);
            inputbox.focus();
        case 'shortQuote':
            changeQuoteLength('short');
            break;
        case 'mediumQuote':
            changeQuoteLength('medium');
            break;
        case 'longQuote':
            changeQuoteLength('long');
            break;
        case 'philo':
            changeQuoteLength('philo');
            break;
        case '15':
            changeTestTime(15, hardmode);
            break;
        case '30':
            changeTestTime(30, hardmode);
            break;
        case '60':
            changeTestTime(60, hardmode);
            break;
        default:
            changeTestTime(15, hardmode);
            break;
    }
}
switchGamemode();

function avg(array) {
    let sum = 0;
    for (let i=0; i<array.length-1; i++) {
        sum = sum + Number(array[i])
    }
    return sum/(array.length-1);
}

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
    //this function runs when a test is in progress.
    if (timeBox.textContent > 0 && testRunning === true) {
        timeBox.textContent--;
    }
    if(i+1===wordList.length && testTime == 500 && inputbox.value.length == wordList[i].length) {
        correctWords++;
        correctCharacters += wordList[i].length;
        document.getElementById(i).style.color = localStorage.getItem('textColor');}
    if ((timeBox.textContent == '0') || (i+1===wordList.length && testTime == 500 && inputbox.value.length == wordList[i].length) || (i===wordList.length && testTime == 500) ) {
        clearInterval(TimerObject);
        document.getElementById('resultCard').style.visibility = 'visible';
        document.getElementById('wpm').textContent = Math.floor((correctCharacters/5)*(60/(testTime-timeBox.textContent))) + ' WPM';
        document.getElementById('characters').textContent = correctCharacters + ' | ' + wrongCharacters + ' (' + Math.floor(correctCharacters/(correctCharacters+wrongCharacters)*100) + '%)';
        scorebox.textContent = correctWords + '/' + totalspacePress;  //update the score
        document.getElementById('raw').textContent = Math.floor((correctWords)*(60/(testTime-timeBox.textContent))) + 'wpm'
        document.getElementById('timeResult').textContent = testTime - timeBox.textContent + 's'
        let zizi = sessionStorage.getItem('sessionWpmArray')
        sessionStorage.setItem('sessionWpmArray', Math.floor((correctCharacters/5)*(60/(testTime-timeBox.textContent))) +'~' + zizi);
        document.getElementById('sessionSpeedAverage').textContent = Math.floor(avg(sessionStorage.getItem('sessionWpmArray').split('~')));
        testRunning = false;
        inputbox.style.visibility = 'hidden';
        
    }
    if (testRunning == true && i===wordList.length && testTime !=500) {
        i = 0;
        wordBox.textContent = '';
        wordList = shuffle(chooseList(hardmode));
        printWords(wordList);
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
        wordBox.appendChild(newtask);
        document.getElementById('0').className = 'highlight';
    }
    
}

function changeGamemode() {
    i=0;
    clearInterval(TimerObject);
    inputbox.style.visibility = 'visible';
    testRunning = false;
    wordBox.textContent = '';
    inputbox.value = ''
    totalspacePress = 0; correctCharacters = 0; correctWords = 0; wrongCharacters = 0;
    inputbox.focus();
}
function changeTestTime(time, hardmode) {
    changeGamemode();
    wordList = '';
    wordList = shuffle(chooseList(hardmode)) 
    printWords(wordList)
    testTime = time;
    timeBox.textContent = time;
    timeBox.style.display = 'inline';
}

function changeQuoteLength(size) {
    changeGamemode();
    timeBox.style.display = 'none';
    testTime = 500;
    timeBox.textContent = '500';
    wordList = chooseQuote(size);
    printWords(wordList);
}

function changeClientTheme(theme) {
    if(theme == 'dark') {
        document.getElementById('switchThemeButton').textContent = 'switch to dark mode';
        document.body.style.backgroundColor = 'rgb(183, 229, 255)';
        document.body.style.color = 'black';
        wordBox.style.backgroundColor = 'white';
        document.getElementById('resultCard').style.backgroundColor = 'white';
        document.getElementById('wpm').style.color = 'green';
        localStorage.setItem('textColor', 'green');
    }
    else {
        document.getElementById('switchThemeButton').textContent = 'switch to light mode';
        document.body.style.backgroundColor = 'black';
        document.body.style.color = 'white';
        wordBox.style.backgroundColor= 'black';
        document.getElementById('resultCard').style.backgroundColor = 'black';
        document.getElementById('wpm').style.color = 'lightgreen';
        localStorage.setItem('textColor', 'lightgreen');
    }
}

function spacebarIsInput() {
    for (let i = 0; i<inputbox.value.length;i++) {
        if(inputbox.value[i] == ' ' || inputbox.value[i] == ' '){
            return true;
        }
    }
}


addEventListener('keyup', (nextWord)=> {
    //test started when input detected
    if (testRunning == false && timeBox.textContent != 0 && i==0) {
        i=0;
        testRunning = true;
        TimerObject = setInterval(timer, 1000)
        
    }
    let wordInput = inputbox.value.replace(' ', ' ').split(' ');            //split the input to select only the first part of the input if a letter is pressed after the space
    //if the spacebar is pressed,
    if(testRunning) {
        if(wordInput != wordList[i].slice(0, wordInput[0].length + '')) {document.getElementById(i).className = 'redhighlight'}
        else{document.getElementById(i).className = 'highlight'}
        if(nextWord.isComposing || spacebarIsInput()) {
            wordInput = inputbox.value.replace(' ', ' ').split(' ');
    
            //check if the word is correctly typed
            if (wordInput[0] == wordList[i] && testRunning == true) {
                correctWords++;
                correctCharacters += wordList[i].length;
                document.getElementById(i).style.color = localStorage.getItem('textColor');
            }
            if (wordInput[0] != wordList[i] && testRunning == true) {wrongCharacters += wordInput[0].length}
            
            if(testRunning === true && wordInput[0] != '') {
                if(document.getElementById(i).style.color != localStorage.getItem('textColor')) {document.getElementById(i).style.color = 'rgba(255, 69, 69, 1)'; document.getElementById(i).style.backgroundColor = 'rgba(0, 0, 0, 0.0)'}
                correctCharacters++;                                        //even if the word is incorrect, the space is typed and is count
                i++;                                                        //go to the next word
                totalspacePress++;
                if (wordInput[1] !== undefined && wordInput[1] !== null) {  //check if the second part of the input exist (there may be no letter after the space)
                    inputbox.value = wordInput[1];                          //set the characters after the space in the inputbox (and erase the correctly typed word)
                document.getElementById(i-1).className = '';                //clear the highlight
                document.getElementById(i).className = 'highlight';         //highlight the next word
            }
            else{inputbox.value = ''}
            }
            
        }
    }
});


document.getElementById('quoteGamemodeButton').addEventListener('click', (changeGamemodeToQuote)=> {
    changeGamemode();
    sessionStorage.setItem('gm', 'quote')
    inputbox.style.display = 'inline';
    wordList = chooseQuote(quotelist);
    timeBox.style.display = 'none';
    testTime = 500;
    timeBox.textContent = '500';
    printWords(wordList);
});

document.getElementById('wordsGamemodeButton').addEventListener('click', (changeGamemodeToWords) => {
    changeGamemode()
    sessionStorage.setItem('gm', 'words15')
    inputbox.style.display = 'reative';
    wordList = shuffle(chooseList());
    timeBox.style.display = 'inline';
    changeTestTime(15);
});


document.getElementById('shortQuoteGamemodeButton').addEventListener('click', (changeGamemodeToShortQuote)=> {
    sessionStorage.setItem('gm', 'shortQuote');
    switchGamemode();
})
document.getElementById('mediumQuoteGamemodeButton').addEventListener('click', (changeGamemodeToShortQuote)=> {
    sessionStorage.setItem('gm', 'mediumQuote');
    switchGamemode();
})
document.getElementById('longQuoteGamemodeButton').addEventListener('click', (changeGamemodeToShortQuote)=> {
    sessionStorage.setItem('gm', 'longQuote');
    switchGamemode();
})
document.getElementById('philoQuoteGamemodeButton').addEventListener('click', (changeGamemodeToPhiloQuote)=> {
    sessionStorage.setItem('gm', 'philo');
    switchGamemode();
})

document.getElementById('words15GamemodeButton').addEventListener('click', (changeGamemodeToWords15) => {
    sessionStorage.setItem('gm', '15')
    changeTestTime(15);
    document.getElementById('EnablePonctuation').textContent = 'enable ponctuaton'
})
document.getElementById('words30GamemodeButton').addEventListener('click', (changeGamemodeToWords15) => {
    sessionStorage.setItem('gm', '30');
    changeTestTime(30);
    document.getElementById('EnablePonctuation').textContent = 'enable ponctuaton'
})
document.getElementById('words60GamemodeButton').addEventListener('click', (changeGamemodeToWords15) => {
    sessionStorage.setItem('gm', '60');
    changeTestTime(60);
    document.getElementById('EnablePonctuation').textContent = 'enable ponctuaton'
})
document.getElementById('EnablePonctuation').addEventListener('click', (enablePonctuation)=> {
    hardmode = !hardmode;
    if(hardmode) {document.getElementById('EnablePonctuation').textContent = 'disable ponctuation'}
    else{document.getElementById('EnablePonctuation').textContent = 'enable ponctuaton'}
    changeTestTime(sessionStorage.getItem('gm'), hardmode)
})

document.getElementById('switchThemeButton').addEventListener('click', (changeTheme)=> {
    if(localStorage.getItem('theme') == 'light') {
        changeClientTheme('dark');
        localStorage.setItem('theme', 'dark');
    }
    else{
        changeClientTheme('light');
        localStorage.setItem('theme', 'light');
    }
})
