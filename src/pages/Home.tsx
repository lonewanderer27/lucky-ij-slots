import "./Home.css";

import { DefaultBets as DefaultNums, Multiplier, Numbers, RemainingMoney } from "../constants";
import { GameState, WinOrLose } from "../enums";
import {
  IonButton,
  IonCol,
  IonContent,
  IonGrid,
  IonHeader,
  IonInput,
  IonLabel,
  IonPage,
  IonRow,
  IonTitle,
  IonToolbar,
} from "@ionic/react";

import Picker from "react-mobile-picker";
import WinningNumbers from "../components/WinningNumbers";
import { useIonAlert } from "@ionic/react";
import { useState } from "react";

const Home: React.FC = () => {
  const [showAlert, hideAlert] = useIonAlert();
  const [userNums, setUserNums] = useState(() => DefaultNums);
  const [userBet, setUserBet] = useState(() => 0);
  const [winningNums, setWinningNums] = useState(() => DefaultNums);
  const [multiplier, setMultiplier] = useState(() => Multiplier);
  const [remainingMoney, setRemainingMoney] = useState(() => RemainingMoney);
  const [gameState, setGameState] = useState(() => GameState.IDLE);
  const [winOrLose, setWinOrLose] = useState(() => WinOrLose.IDLE);

  console.log("userBets: ", userNums);
  console.log("winningBets: ", winningNums);

  function handleBet() {
    console.info("handleBet");
    console.info("gameState: ", gameState.toString());
    
    switch (gameState) {
      case GameState.IDLE:
        bet();
        break;
      case GameState.BETTING:
        if (playChecks()) {
          play();
        } else {
          console.error("Playchecks failed");
        }
        break;
      default:
        break;
    }
  }

  function bet() {
    // set game state to betting
    setGameState(GameState.BETTING);

    // reset user bet
    setUserBet(0);

    // reset user numbers
    setUserNums(DefaultNums);
  }

  function playChecks(): boolean {
    let passedChecks = true;

    if (parseInt(userNums.bet1) == 0 || parseInt(userNums.bet1) > 9) {
      passedChecks = false;
    }

    if (parseInt(userNums.bet2) == 0 || parseInt(userNums.bet2) > 9) {
      passedChecks = false;
    }

    if (parseInt(userNums.bet3) == 0 || parseInt(userNums.bet3) > 9) {
      passedChecks = false;
    }

    if (passedChecks == false) {
      showAlert({
        header: "Invalid Bet",
        message: "Please enter a valid bet",
        buttons: ["OK"],
      });
      return passedChecks;
    }

    // check if the user bet is less than or equal to 0
    if (userBet <= 0) {
      passedChecks = false;
      showAlert({
        header: "Invalid Bet",
        message: "Please enter a valid bet",
        buttons: ["OK"],
      });
      return passedChecks;
    }

    // check if the user bet is greater than the remaining money
    if (userBet > remainingMoney) {
      passedChecks = false;
      showAlert({
        header: "Insufficient Funds",
        message: "You don't have enough money to bet",
        buttons: ["OK"],
      });
      return passedChecks;
    }

    return passedChecks;
  }

  function play() {
    // generate winning numbers
    const winningNums = genWinningNums();

    // check if the winning numbers are equal to the user bets
    if (
      winningNums.bet1 == userNums.bet1 &&
      winningNums.bet2 == userNums.bet2 &&
      winningNums.bet3 == userNums.bet3
    ) {
      // if yes, then set the winOrLose to win
      setWinOrLose(WinOrLose.WIN);

      // increase money by multiplier
      setRemainingMoney(remainingMoney * multiplier);

      // increase multiplier by 1s
      setMultiplier(multiplier + 1);

      // set game state to betting
      setGameState(GameState.BETTING);
    } else {
      // if no, then set the winOrLose to lose
      setWinOrLose(WinOrLose.LOSE);

      // reset multiplier to 2
      setMultiplier(Multiplier);

      // decrease money by the bet
      setRemainingMoney(remainingMoney - userBet);
    }
  }

  function reset() {
    // reset multiplier to 2
    setMultiplier(Multiplier);

    // reset winning numbers
    setWinningNums(DefaultNums);

    // reset user numbers
    setUserNums(DefaultNums);

    // reset user bet
    setUserBet(0);

    // reset game state
    setGameState(GameState.IDLE);

    // reset win or lose
    setWinOrLose(WinOrLose.IDLE);

    // reset remaining money
    setRemainingMoney(RemainingMoney);
  }

  function genWinningNums(): {
    bet1: string;
    bet2: string;
    bet3: string;
  } {
    // generate number from 1 to 4
    const luck = Math.floor(Math.random() * 4) + 1;
    console.info("luck: ", luck);

    // check if the luck is 4
    // then set the winning numbers to the user numbers
    if (luck == 4) {
      const winningNums = {
        bet1: userNums.bet1,
        bet2: userNums.bet2,
        bet3: userNums.bet3,
      };
      setWinningNums(winningNums);
      return winningNums;
    } else {
      // otherwise generate random numbers
      const winningNums = {
        bet1: (Math.floor(Math.random() * 9) + 1).toString(),
        bet2: (Math.floor(Math.random() * 9) + 1).toString(),
        bet3: (Math.floor(Math.random() * 9) + 1).toString(),
      };
      setWinningNums(winningNums);
      return winningNums; 
    }
  }

  return (
    <IonPage>
      <IonContent fullscreen>
        <IonHeader>
          <IonToolbar>
            <IonTitle>Slot Machine</IonTitle>
          </IonToolbar>
        </IonHeader>
        <IonGrid>
          <WinningNumbers winningBets={winningNums} />
          <IonRow className="border-solid border-4 my-2">
            <IonCol size="4" className="flex flex-col justify-center">
              <Picker
                value={userNums}
                onChange={setUserNums}
                height={70}
                wheelMode="normal"
              >
                {Object.keys(DefaultNums).map((bet) => (
                  <Picker.Column name={bet} key={bet}>
                    {Numbers.map((option) => (
                      <Picker.Item key={option} value={option}>
                        <span className="text-4xl">{option}</span>
                      </Picker.Item>
                    ))}
                  </Picker.Column>
                ))}
              </Picker>
            </IonCol>
            <IonCol>
              <IonInput
                name="bet"
                fill="outline"
                className="text-7xl"
                value={userBet}
                onIonChange={(e) => setUserBet(parseInt(e.detail.value!))}
                placeholder={(remainingMoney / 2).toString()}
                type="number"
                min={0}
                minlength={1}
                required
                size={5}
              />
            </IonCol>
          </IonRow>
          <IonRow>
            <IonCol size="4" className="text-center">
              <span className="text-1xl">Multiplier:</span>
            </IonCol>
            <IonCol>
              <span className="text-1xl">Remaining Balance:</span>
            </IonCol>
          </IonRow>
          <IonRow className="mt-[-5px]">
            <IonCol size="4" className="text-center">
              <span className="text-4xl">{multiplier}x</span>
            </IonCol>
            <IonCol>
              <span className="text-4xl">{remainingMoney}</span>
            </IonCol>
          </IonRow>
          <IonRow className="text-center border-solid border-4 ">
            {gameState !== GameState.SPINNING && (
              <IonCol>
                {winOrLose === WinOrLose.IDLE && <h1>Place your Bet!</h1>}
                {winOrLose === WinOrLose.WIN && <h1>You Won!</h1>}
                {winOrLose === WinOrLose.LOSE && <h1>You Lost!</h1>}
              </IonCol>
            )}
            {gameState === GameState.SPINNING && (
              <IonCol>
                <h1>Spinning..</h1>
              </IonCol>
            )}
          </IonRow>
          <IonRow>
            <IonCol>
              {gameState === GameState.IDLE && (
                <IonButton expand="block" size="large" onClick={() => setGameState(GameState.BETTING)}>
                  <IonLabel>Play</IonLabel>
                </IonButton>
              )}
              {gameState === GameState.BETTING && (
                <IonButton expand="block" size="large" onClick={() => handleBet()}>
                  <IonLabel>Spin</IonLabel>
                </IonButton>
              )}
              {gameState === GameState.IDLE || remainingMoney === 0  && (
                <IonButton expand="block" size="large" onClick={() => reset()}>
                  <IonLabel>Reset</IonLabel>
                </IonButton>
              )}
            </IonCol>
          </IonRow>
        </IonGrid>
      </IonContent>
    </IonPage>
  );
};

export default Home;
