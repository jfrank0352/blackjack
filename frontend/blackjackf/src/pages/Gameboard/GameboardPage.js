import React, {useEffect, useState } from 'react';

import Modal from '@material-ui/core/Modal';
import { makeStyles } from '@material-ui/core/styles';
import { TextField } from '@material-ui/core'
import cardBack from '../../images/Oak-Leaf-Back.jpg'
import './Gameboard.css'
import { Button } from '@material-ui/core'
import chips from '../../images/pexels-nancho-1553831.jpg'
import { startGame, playerHit, playerStay, playerBet } from '../../api';

const useStyles = makeStyles((theme) => ({
  paper: {
    position: 'absolute',
    width: 700,
    height: 700,
    backgroundColor: theme.palette.background.paper,
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));


function getModalStyle() {
  const top = 50 ;
  const left = 50 ;

  return {
    top: `${top}%`,
    left: `${left}%`,
    transform: `translate(-${top}%, -${left}%)`,
  };
}

const GameboardPage = () => {
  const classes = useStyles();
  const [gameState, setGameState] = useState(null)
  const [payout, setPayout] = useState(null)
  const [modalStyle] = useState(getModalStyle);
  const [open, setOpen] = useState(false);
  const [bet, setBet] = useState(0);
  const [dealerHand, setDealerHand] = useState('');
  const [dealerImg, setDealerImg] = useState([cardBack]);
  const [playerHand, setPlayerHand] = useState('');
  const [playerImg, setPlayerImg] = useState([]);
  const [dealerVal, setDealerVal] = useState(0);
  const [playerVal, setPlayerVal] = useState(0);
  const [playerChips, setPlayerChips] = useState(0);
  const [playerBust, setPlayerBust] = useState(false)
  const [dealerBust, setDealerBust] = useState(false)
  const [newHand, setNewHand] = useState(false)
  const [gameOver, setGameOver] = useState(false)
  const [gameStatus, setGameStatus] = useState({'win':false, 'loss':false, 'tie':false})
  let tempArr = [];

  const handleClose = () => {
    setOpen(false);
  }; 
  const handleGameStart = async ()=>{
    setOpen(false)
    let user_id = localStorage.getItem('user-id')
    let token = localStorage.getItem('auth-user')
    let res = await startGame(bet, user_id, token)
    console.log(res)
    setGameState(res)
    setDealerHand(res.dealer_hand)
    setPlayerHand(res.player_hand)
    setDealerVal(res.d_hand_val)
    setPlayerVal(res.p_hand_val)
    setPlayerChips(res.player_chips)
    setPlayerBust(res.player_bust)
    setDealerBust(res.dealer_bust)
  }

  useEffect(()=>{
    // console.log('setting dealerIMG')
    // console.log(dealerImg)
    tempArr = dealerImg
    for (let i = 1; i<dealerHand.length; i++){
      tempArr.push(`https://deckofcardsapi.com/static/img/${dealerHand[i]}.png`)
    }
    setDealerImg(tempArr)
  },[dealerHand])

  useEffect(()=>{
    tempArr = playerImg;
    for (let i = 0; i < playerHand.length; i++){
      tempArr.push(`https://deckofcardsapi.com/static/img/${playerHand[i]}.png`);
    }
    setPlayerImg(tempArr)
  },[playerHand])

  useEffect(()=>{ 
    setOpen(true)
    getChips()
  },[])
  const getChips = async ()=>{
    let user_id = localStorage.getItem('user-id')
    let token = localStorage.getItem('auth-user')
    let bet = 0
    let res = await startGame(bet, user_id, token)
    console.log(res)
    setPlayerChips(res.player_chips)
  }

  // useEffect(()=>{
  //   if(gameState.payout !== null){
  //     setPayout(gameState.payout)
  //     console.log('set payout ', gameState.payout)
  //   }
  // },[gameState])

  const hit = async ()=>{
    let token = localStorage.getItem('auth-user')

    if(playerBust == false){
      let res = await playerHit(gameState.id, token)
      console.log('hit res: ', res)
      if(res.player_bust){
        stay()
      }
      setGameState(res)
      setPlayerHand(res.player_hand)
      setPlayerVal(res.p_hand_val)
    }else {
      console.log('Cannot hit. your are over 21!')
    }
    
  }

  const stay = async() =>{
    let token = localStorage.getItem('auth-user')
    let res = await playerStay(gameState.id, token)
    console.log('stay res: ', res)
    setGameOver(true)
    setGameState(res)
    setDealerHand(res.dealer_hand)
    setDealerVal(res.d_hand_val)
    setNewHand(true)
    if(res.hand_winner ==='P'){
      setGameStatus({'win':true})
    }
    else if(res.hand_winner ==='D'){
      setGameStatus({'loss':true})
    }
    else{
      setGameStatus({'tie':true})
    }

  }

  const newBet = async () => {
    setGameOver(false)
    setGameStatus({'win':false, 'loss':false, 'tie':false})
    let token = localStorage.getItem('auth-user')
    if(bet <= gameState.player_chips){
      let res = await playerBet(gameState.id, bet, token)
      setGameState(res)
      console.log(gameOver)
      setDealerHand(res.dealer_hand)
      setDealerVal(res.d_hand_val)
      setPlayerHand(res.player_hand)
      setPlayerVal(res.p_hand_val)
      setNewHand(false)
    }
    console.log('Cannot bet more chips than you have!')
  }

  const renderCards = (cardsArr)=>{
    return cardsArr.map((card, id)=>{
      return <img key={id} className='card-img' src={`https://deckofcardsapi.com/static/img/${card}.png`} alt='not 21'/>
    })
  }

  const renderDealerHand = (cardsArr)=>{
    return cardsArr.map((card, id)=>{
      if (id == 0){
        return <img key={id} className='card-img' src={cardBack} alt='not 21'/>
      }
      return <img key={id} className='card-img' src={`https://deckofcardsapi.com/static/img/${card}.png`} alt='not 21'/>
    })
  }
  
  return (
    <div className="GBMain">
      <div className='Game manager'>  
      <Modal open={open} onClose={handleClose}
        aria-labelledby="simple-modal-title"
        aria-describedby="simple-modal-description">
        <div style={modalStyle} className={classes.paper} >
          <div className='modal-text'>
          {/* I'm thinking a good way to space out the games is to re-open the modal with different text between each game? */}
            <h1 className='modal-title'>Welcome to the table!</h1>
            <h3  className='modal-subtitle'>To get started just enter   how much you want to bet and get started. Don't worry you   can change this amount inbetween hands. Have fun! You have: {playerChips} Chips</h3>
          </div>
          
          <div className='modal-input'>
            <TextField id="standard-number" label="Bet" type="number"
            onInput={e=>setBet(parseInt(e.target.value))} InputLabelProps={{
            shrink: true,}} defaultValue={10} />
            <Button variant='contained' color="secondary"  onClick={handleGameStart} >Deal the cards</Button>
          </div>
          <div className='img-container'>
            <img className='modal-img' src={chips} alt='21'/>
          </div>
        </div>
      </Modal>
      {
        dealerImg[1] ?
        <div>
          <div className='dealer-section'>
            <div className='dealer-text'>
            <h2 className='cards-heading'>Dealer Cards</h2>
            </div>
            
            <div className='cards'>
              {gameOver ? renderCards(dealerHand): renderDealerHand(dealerHand)}
              {/* {renderDealerHand(dealerHand)}               */}
            </div>
          </div>
          
          
          <div className='player-section'>
            <div className='dealer-text'>
              <h2 className='cards-heading'>Your Cards. Chip Count: {gameState.player_chips}</h2> 
            </div>
            <div className='cards'>
              {renderCards(playerHand)}
              {!newHand ?
              <div className='player-buttons'>
                <Button className='hit-bttn'variant="contained" color="secondary" onClick={hit}>Hit</Button>
                <Button className='stay-bttn'variant="contained" color="secondary" onClick={stay}>Stay</Button>
              </div>
              :
              <div className='gameOver-content'>
                {/* need to disply player chip count here as well */}
              
                <TextField id="standard-number" label="Bet" type="number" onInput={e=>setBet(parseInt(e.target.value))} InputLabelProps={{
                  shrink: true,}} defaultValue={10}/>
                <Button variant='contained' color="secondary"  onClick={newBet} >Place Bet</Button>
              </div>
            }
            </div>
            
            
          </div>
        </div> : 'Start a new Game'
      }
      
        {/* <Button className='play-bttn'variant="contained" color="secondary">Play now</Button> */}
    
      </div>
      { gameStatus.win ? 
        <div className='game-status win' id='win'>
          <h1>Congrats you won!</h1>
        </div>
        :
        null
        }
        { gameStatus.loss ? 
        <div className='game-status loss' id='loss'>
          <h1>Sorry you lost</h1>
        </div>
        :
        null
        }
        { gameStatus.tie ? 
        <div className='game-status tie' id='tie'>
          <h1>Dang, it's a tie.</h1>
        </div>
        :
        null
        }
    </div>
  );
};

export default GameboardPage;