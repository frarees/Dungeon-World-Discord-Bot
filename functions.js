const storage = require('./redis.js')
module.exports = {removePrefix, xdyRoll, roll, newCharacter, characterSheet, setStats, shift, moveRoll}

//functions
function removePrefix(message){
	let prefixed = message.toLowerCase().split(" ");
	if (prefixed[0] === ('!' || '?')) {
		prefixed.shift();
	} else if (prefixed[0] !== ('!' || '?')) {
		prefixed[0] = prefixed[0].slice(1);
	}; 
	return prefixed;
};

function xdyRoll(userMessage, userId, channelId, userNickname, moves, userData){
    let die = userMessage[1];
    if (!die) {return moves.roll.error};
    let mod = userMessage[2];
    for(let [key, value] of Object.entries(moves.abilities.stats)){
        if(value[0] === userMessage[2].slice(1).toLowerCase())
            {mod = userData[userId][value[0].toUpperCase()]}
    }
    let modifier = parseInt(mod);
    if (isNaN(modifier)){
        modifier = 0;};
    let xdy = die.split('d');
    let num = parseInt(xdy[0]);
        if (isNaN(num)){return moves.roll.error};
    let faces = parseInt(xdy[1]);
        if (isNaN(faces)){return moves.roll.error};
    const dieRoll = roll(num, faces);
    let total = parseInt(dieRoll[0]);
    let result = dieRoll[1];
    let grandTotal = (total + modifier);
        if (modifier === 0 && !userMessage[2]){
            return (`You rolled (${result} ) = ${total}.`)}
        else if (modifier >= 0){
            return (`You rolled (${result} ) = ${total} + ${modifier}. That's ${grandTotal}.`)}
        else if (modifier < 0) {
        modifier = Math.abs(modifier);
            return (`You rolled (${result} ) = ${total} - ${modifier}. That's ${grandTotal}.`)}
}

function roll(num, faces){
    let total = 0;
    let result = [];
        for(let i = 0; i < num; i++){
    let singleRoll = Math.floor(Math.random() * faces) + 1;
    result.push(' ' + singleRoll);
    total += singleRoll;
    }
    return [total, result];
}

function moveRoll(userMessage, userId, channelId, userNickname, moves, userData, i){
    let modStat = 0
    let rollText = ''
    let moveText = ''
    let input = userMessage[1];
    input = parseInt(input);
    if(moves[i].stat === 'num'){
        if(!input){input = 0}
        modStat = input
    } else if(moves[i].stat === 'stat'){
        if(!userMessage[1]){return 'You need to add a +STAT to your command'}
        modStat = userData[userId][userMessage[1].slice(1).toUpperCase()]
    } else {modStat = userData[userId][moves[i].stat.toUpperCase()];}
    if(!modStat){modStat = 0};
    let moveRoll = roll(2, 6);
    let total = moveRoll[0];
    let result = moveRoll[1];
    result = `${result[0]}, ${result[1]} `
    let grandTotal = total + modStat;
    if (grandTotal >= 13){
        moveText = moves[i].greatSuccess
    } else if (grandTotal >= 10 && grandTotal <= 12){
		moveText = moves[i].success
	} else if (9 >= grandTotal && grandTotal >= 7){
        moveText = moves[i].mixed
    } else if (6 >= grandTotal ){
        moveText =  moves[i].fail
    }
    if (modStat >= 0){
			rollText = `You rolled (${result}) = ${total} + ${modStat}. That’s ${grandTotal}.`}
	else if (modStat < 0) {
			modStat = Math.abs(modStat);
			rollText = `You rolled (${result}) = ${total} - ${modStat}. That’s ${grandTotal}.`}
    return `${rollText}\n${moveText}`
}

function newCharacter(userMessage, userId, channelId, userNickname, moves, userData){
    userData[userId] = {}
    let person = {};
    for(let [key, value] of Object.entries(moves.abilities.stats)){
        person[key] = value[1]
    }
    userData[userId] = person;
    storage.set(channelId, userData);
    return 'Created a blank character'
}

function characterSheet(userMessage, userId, channelId, userNickname, moves, userData){
    if(!userData[userId]){newCharacter(userMessage, userId, channelId, userNickname, moves, userData)};
    statPrintout = ['Here are your CHARACTER STATS:'];
    for(let [key, value] of Object.entries(userData[userId])){
        statPrintout.push(`${key}: ${value}`)
    }
    return statPrintout
}

function shift(userMessage, userId, channelId, userNickname, moves, userData){
    if(!userData[userId]){newCharacter(userMessage, userId, channelId, userNickname, moves, userData)};
    let shiftPrintout = ['CHANGES:'];
    for(let [key, value] of Object.entries(moves.abilities.stats)){
        userMessage.forEach(i => {
            if(i.startsWith(value[0])){
                i = i.slice(value[0].length)
                function hasNumber(string) {return /\d/.test(string)}
                let stat = hasNumber(i)
                let numerical = hasNumber(value)
                if(stat && numerical){
                    i = parseInt(i)
                    userData[userId][key] = userData[userId][key] + i,
                    shiftPrintout.push(`${key}: ${userData[userId][key]}`)
                }
            }
        })
    }
    if(!shiftPrintout[1]){shiftPrintout = moves.shift.error}
    return shiftPrintout
}

function setStats(userMessage, userId, channelId, userNickname, moves, userData){
    if(!userData[userId]){newCharacter(userMessage, userId, channelId, userNickname, moves, userData)};

    for(let [key, value] of Object.entries(moves.abilities.stats)){
        userMessage.forEach(i => {
            if(i.startsWith(value[0])){
                i = i.slice(value[0].length)
                function hasNumber(string) {return /\d/.test(string)}
                let stat = hasNumber(i)
                if(stat){
                    i = parseInt(i)
                } else {i = i.slice(1).toUpperCase()}
                if(!i){return moves.set.error}
                else {userData[userId][key] = i}
            }
        })
    }
    return characterSheet(userMessage, userId, channelId, userNickname, moves, userData)
}