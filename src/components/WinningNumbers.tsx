import { IonCol, IonRow } from "@ionic/react";

import AnimatedNumbers from "react-animated-numbers";
import { memo } from "react";

function WinningNumbers(props: {
  winningBets: {
    bet1: string;
    bet2: string;
    bet3: string;
  };
}) {
  return (
    <IonRow className="border-solid border-4 my-2 justify-center ">
      <IonCol>
        <AnimatedNumbers
          fontStyle={{ fontSize: "8rem" }}
          animateToNumber={parseInt(props.winningBets.bet1)}
          configs={[{ mass: 1, tension: 20, friction: 10 }]}
        />
      </IonCol>
      <IonCol>
        <AnimatedNumbers
          fontStyle={{ fontSize: "8rem" }}
          animateToNumber={parseInt(props.winningBets.bet2)}
          configs={[{ mass: 2, tension: 10, friction: 10 }]}
        />
      </IonCol>
      <IonCol>
        <AnimatedNumbers
          fontStyle={{ fontSize: "8rem" }}
          animateToNumber={parseInt(props.winningBets.bet3)}
          configs={[{ mass: 3, tension: 7, friction: 10 }]}
        />
      </IonCol>
    </IonRow>
  );
}

WinningNumbers.defaultProps = {
  winningBets: {
    bet1: "0",
    bet2: "0",
    bet3: "0",
  }
}

export default memo(WinningNumbers);