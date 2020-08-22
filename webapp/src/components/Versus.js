import React, {useState} from 'react';
import './Versus.css';
import WithSidebar from './Sidebar';
import { withRouter } from "react-router";
import {Redirect} from "react-router-dom";

import Constants from '../constants.js'

import AggressiveBot from '../stored_algorithms/algos/AggressiveBot';
import MediumBot from '../stored_algorithms/algos/MediumBot';
import DefaultBot from '../stored_algorithms/algos/DefaultBot';
import EasyBot from '../stored_algorithms/algos/EasyBot';
import twSupply from '../stored_algorithms/algos/twSupply';
import MakeItSafe from '../stored_algorithms/algos/MakeItSafe';



function getActivePlayers(availablePlayers) {
    var players = [];
    availablePlayers.forEach(player => {
        for (let i = 0; i < player.count; i++) {
            players.push({
                name: player.name,
                codeString: player.codeString
            });
        }
    });
    return players;
}

function getSelectedPlayerCount(availablePlayers) {
    var sum = 0;
    availablePlayers.forEach(player => {
        sum += player.count;
    });
    return sum;
}

function Versus(props) {    
    let playerName = props.location.state ? props.location.state.playerName : localStorage.getItem(Constants.LOCAL_STORAGE_PLAYER_NAME);
    if (!playerName) playerName = Constants.defaultPlayerName;

    let playerCode = props.location.state ? props.location.state.playerCode : localStorage.getItem(Constants.LOCAL_STORAGE_EDITOR_CODE);
    if (!playerCode) playerCode = Constants.defaultEditorCode;

    const players = [
        {name: playerName, codeString: playerCode, count: 1},
        {name: DefaultBot.name, codeString: DefaultBot.turn.toString(), count: 0},
        {name: MediumBot.name, codeString: MediumBot.turn.toString(), count: 0},
        {name: AggressiveBot.name, codeString: AggressiveBot.turn.toString(), count: 0},
        {name: EasyBot.name, codeString: EasyBot.turn.toString(), count: 0},
        {name: twSupply.name, codeString: twSupply.turn.toString(), count: 0},
        {name: MakeItSafe.name, codeString: MakeItSafe.turn.toString(), count: 0},
    ]

    const [availablePlayers, setAvailablePlayers] = useState(players);
    const [redirect, setRedirect] = useState(null);

    function updatePlayerCount(id, updateFunction) {
        const updatedPlayers = availablePlayers.map((player,index) => {
            if (index !== id) return player;
            let newCount = updateFunction(player.count)
            return {...player, count: newCount >= 0 ? newCount : 0}
        })
        setAvailablePlayers(updatedPlayers); 
    }

    function redirectGame() {
        // minimum of 2 players needed to start a game
        if (getSelectedPlayerCount(availablePlayers) >= 2 || getSelectedPlayerCount(availablePlayers) > Constants.PLAYER_COLORS) {
            setRedirect("/game");
            // could also set local storage players here
        } else {
            console.log("Minimum 2 players required to start a game")
        }
    }
      

    return(
        redirect ? <Redirect to={{
            pathname: redirect,
            state: {
                playerCodes: getActivePlayers(availablePlayers)
            }}}/> : 

        <WithSidebar
            sidebarElements={
                players.map((player, index) => 
                    <span key={index} className="sidebar-item interactable">
                        <span className="sidebar-btn left" onClick={() => updatePlayerCount(index, (count) => count-1)}>-</span> 
                            <span>{player.name}</span> 
                        <span className="sidebar-btn right" onClick={() => updatePlayerCount(index, (count) => count+1)}>+</span> 
                    </span>
                )
            }
            content={
                <div className="content">
                    <h2>Selected Players</h2>
                    <table id="player-selection">
                        <thead>
                            <tr>
                                <th>Player name</th>
                                <th>Count</th>
                            </tr>
                        </thead>
                        <tbody>
                            {availablePlayers.map((player, index) => {
                                return <tr key={index} className={player.count > 0 ? "active" : "inactive"}>
                                    <td>{player.name}</td>
                                    <td>{player.count}</td>
                                </tr>
                            })}
                        </tbody>
                    </table>
                    <button onClick={redirectGame}>Play game</button>
                </div>
            }
        />
    );
}

export default withRouter(Versus);