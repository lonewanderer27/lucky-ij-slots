import "./Home.css";

import { DefaultBets, Multiplier, Numbers, RemainingMoney } from "../constants";
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

import AnimatedNumbers from "react-animated-numbers";
import Picker from "react-mobile-picker";
import { useIonAlert } from "@ionic/react";
import { useState } from "react";

const Home: React.FC = () => {
  const [showAlert, hideAlert] = useIonAlert();
  const [userBets, setUserBets] = useState(() => DefaultBets);
  const [winningBets, setWinningBets] = useState(() => DefaultBets);
  const [multiplier, setMultiplier] = useState(() => Multiplier);
  const [remainingMoney, setRemainingMoney] = useState(() => RemainingMoney);
  const [gameState, setGameState] = useState(() => GameState.IDLE);
  const [winOrLose, setWinOrLose] = useState(() => WinOrLose.IDLE);

  console.log("userBets: ", userBets);
  console.log("winningBets: ", winningBets);

  function Bet() {}

  function PlayChecks() {
    let passedChecks = true;

    if (parseInt(userBets.bet1) == 0 || parseInt(userBets.bet1) > 9) {
      passedChecks = false;
    }

    if (parseInt(userBets.bet2) == 0 || parseInt(userBets.bet2) > 9) {
      passedChecks = false;
    }

    if (parseInt(userBets.bet3) == 0 || parseInt(userBets.bet3) > 9) {
      passedChecks = false;
    }

    if (passedChecks == false) {
      showAlert({
        header: "Invalid Bet",
        message: "Please enter a valid bet",
        buttons: ["OK"],
      });
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
          <IonRow className="border-solid border-4 my-2 justify-center ">
            <IonCol>
              <AnimatedNumbers
                fontStyle={{ fontSize: "8rem" }}
                animateToNumber={parseInt(winningBets.bet1)}
                configs={[{ mass: 1, tension: 20, friction: 10 }]}
              />
            </IonCol>
            <IonCol>
              <AnimatedNumbers
                fontStyle={{ fontSize: "8rem" }}
                animateToNumber={parseInt(winningBets.bet2)}
                configs={[{ mass: 2, tension: 10, friction: 10 }]}
              />
            </IonCol>
            <IonCol>
              <AnimatedNumbers
                fontStyle={{ fontSize: "8rem" }}
                animateToNumber={parseInt(winningBets.bet3)}
                configs={[{ mass: 3, tension: 7, friction: 10 }]}
              />
            </IonCol>
          </IonRow>
          <IonRow className="border-solid border-4 my-2">
            <IonCol size="4" className="flex flex-col justify-center">
              <Picker
                value={userBets}
                onChange={setUserBets}
                height={70}
                wheelMode="normal"
              >
                {Object.keys(DefaultBets).map((bet) => (
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
                fill="outline"
                className="text-7xl"
                placeholder="500"
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
                <IonButton expand="block" size="large">
                  <IonLabel>Set</IonLabel>
                </IonButton>
              )}
              {gameState === GameState.BETTING && (
                <IonButton expand="block" size="large">
                  <IonLabel>Spin</IonLabel>
                </IonButton>
              )}
              {gameState !== GameState.SPINNING && (
                <IonButton expand="block" size="large">
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
