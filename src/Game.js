import { useState } from "react";

const Game = () => {

    const [userCards, setUserCards] = useState([]);
    const [userDisplay, setUserDisplay] = useState("🂠 🂠");
    const [userTotal, setUserTotal] = useState(0);

    const [dealerCards, setDealerCards] = useState([]);
    const [dealerDisplay, setDealerDisplay] = useState("🂠 🂠");
    const [dealerTotal, setDealerTotal] = useState(0);

    const [userHighAceCount, setUserHighAceCount] = useState(0);
    const [dealerHighAceCount, setDealerHighAceCount] = useState(0);

    const [gameInfo, setGameInfo] = useState("Blackjack");
    const [cardsInPlay, setCardsInPlay] = useState([]);

    const suits = 'spade heart club diamond'.split(' ');
    const values = [11, 2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 10, 10];
    const colors = 'black red'.split(' ');
    const ranks = 'a 2 3 4 5 6 7 8 9 10 j q k'.split(' ');
    const printedRanks = 'A 2 3 4 5 6 7 8 9 10 J Q K'.split(' ');
    const images = '🂡 🂢 🂣 🂤 🂥 🂦 🂧 🂨 🂩 🂪 🂫 🂭 🂮 🂱 🂲 🂳 🂴 🂵 🂶 🂷 🂸 🂹 🂺 🂻 🂽 🂾 🃑 🃒 🃓 🃔 🃕 🃖 🃗 🃘 🃙 🃚 🃛 🃝 🃞 🃁 🃂 🃃 🃄 🃅 🃆 🃇 🃈 🃉 🃊 🃋 🃍 🃎'.split(' ');
    const hexColors = {
        red: '#c22',
        black: '#333'
    };

    const cards = new Array(52);

    for (let i = 0; i < cards.length; i++) {
        const suit = suits[i / 13 | 0];
        const color = colors[(i / 13 | 0) % 2];
        const hexColor = hexColors[color];
        const value = values[i % 13];
        const rank = ranks[i % 13];
        const printedRank = printedRanks[i % 13];
        const image = images[i];

        const card = {
            i,
            suit,
            value,
            color,
            hexColor,
            rank,
            printedRank,
            image
        };

        cards[i] = card;

    }

    function handleDeal() {
        if (gameInfo !== "Blackjack") {
            // Restart the game
            setUserCards([]);
            setDealerCards([]);
            setUserTotal(0);
            setDealerTotal(0);
            setUserDisplay("🂠 🂠");
            setDealerDisplay("🂠 🂠");
            setGameInfo("Blackjack");
            setCardsInPlay([]);
            document.querySelector("#deal").textContent = "Deal Cards";
            document.querySelector("#hit").style.visibility = "hidden";
            document.querySelector("#stay").style.visibility = "hidden";
            document.querySelector("#gameInfo").classList = "";
        } else {

            const initialUserCards = [randomCard(), randomCard()];
            const initialDealerCards = [randomCard()];

            let aceCount = 0
            let dealerAceCount = 0;

            for (let i = 0; i < initialUserCards.length; i++) {
                if (initialUserCards[i].rank === 1) {
                    aceCount++;
                }
            }
            for (let i = 0; i < initialDealerCards.length; i++) {
                if (initialDealerCards[i].rank === 1) {
                    dealerAceCount++;
                }
            }

            setUserCards(initialUserCards);
            setDealerCards(initialDealerCards);

            let userTotal = initialUserCards.reduce((sum, card) => sum + card.value, 0);
            let dealerTotal = initialDealerCards.reduce((sum, card) => sum + card.value, 0);

            const userAceInfo = adjustForAces(userTotal, aceCount);
            userTotal = userAceInfo.total;
            aceCount = userAceInfo.highAceCount;

            const dealerAceInfo = adjustForAces(dealerTotal, dealerAceCount);
            dealerTotal = dealerAceInfo.total;
            dealerAceCount = dealerAceInfo.highAceCount;

            displayCards(initialUserCards, initialDealerCards, userTotal, dealerTotal);

            if (userTotal === 21) {
                endStyle();
                setGameInfo("You have Blackjack. You win!");
                return;
            } else if (userTotal === 22) {
                aceCount--;
                userTotal -= 10;
            }
            setUserHighAceCount(aceCount);
            setDealerHighAceCount(dealerAceCount);

            setGameInfo("Blackjack");
            document.querySelector("#deal").textContent = "Restart";
            document.querySelector("#hit").style.visibility = "visible";
            document.querySelector("#stay").style.visibility = "visible";
            document.querySelector("#gameInfo").classList = "";
        }
    }

    function randomCard() {
        const cardNum = Math.ceil(Math.random() * 52) - 1;
        let newCard = cards[cardNum];

        while (cardsInPlay.find(card => card.i === newCard.i)) {
            newCard = cards[Math.ceil(Math.random() * 52) - 1];
        }

        setCardsInPlay(prevCards => [...prevCards, newCard]);

        return newCard;
    }

    function addUserCard() {
        const newCard = randomCard();

        // Update user cards
        setUserCards((prevCards) => {
            const updatedCards = [...prevCards, newCard];

            // Calculate total from updated cards
            let newTotal = updatedCards.reduce((sum, card) => sum + card.value, 0);



            let newHighAceCount = userHighAceCount;
            if (newCard.rank === 1) {
                newHighAceCount++;  // Increase high Ace count when a new Ace is added
            }
            if (newTotal > 21) {
                // Adjust for aces
                let aceInfo = adjustForAces(newTotal, newHighAceCount);
                newTotal = aceInfo.total;
                newHighAceCount = aceInfo.highAceCount;
            }


            setUserTotal(newTotal); // Update total based on calculated value
            setUserHighAceCount(newHighAceCount); // Update ace count

            // Update display
            displayCards(updatedCards, dealerCards, newTotal);

            // Check game status
            gameStatus(newTotal);
            return updatedCards;
        });

    }

    function displayCards(userCardsArg = userCards, dealerCardsArg = dealerCards, userTotalArg = userTotal, dealerTotalArg = dealerTotal) {

        let display = "";
        for (let card of userCardsArg) {
            display += card.image + " ";
        }
        setUserDisplay(display);
        setUserTotal(userTotalArg);

        display = "";
        for (let card of dealerCardsArg) {
            display += card.image + " ";
            if (dealerCardsArg.length === 1) {
                display += "🂠";
            }
        }
        setDealerDisplay(display);
        setDealerTotal(dealerTotalArg);


    }

    function gameStatus(userTotalArg = userTotal) {
        if (userTotalArg === 21) {
            dealerTurn();
        } else if (userTotalArg > 21) {
            //Bust
            endStyle();
            setGameInfo("You have gone bust. You lose.");
        }
    }

    function dealerTurn() { //Need to look over
        let dealerSum = dealerTotal;
        let aceCount = dealerHighAceCount;
        const newDealerCards = [...dealerCards];

        while (dealerSum < 17) {
            const card = randomCard();
            newDealerCards.push(card);
            dealerSum += card.value;
            if (card.rank === 1) aceCount++;

            const aceInfo = adjustForAces(dealerSum, aceCount);
            dealerSum = aceInfo.total;
            aceCount = aceInfo.highAceCount;
        }

        setDealerCards(newDealerCards);

        displayCards(userCards, newDealerCards, userTotal, dealerSum);

        if (dealerSum > 21) {
            endStyle();
            setGameInfo("Dealer has bust. You win!");
        } else if (dealerSum < userTotal) {
            endStyle();
            setGameInfo("You win!");
        } else if (dealerSum > userTotal) {
            endStyle();
            setGameInfo("You lose.");
        } else {
            endStyle();
            setGameInfo("It's a tie!");
        }
    }

    function endStyle() {
        document.querySelector("#hit").style.visibility = "hidden";
        document.querySelector("#stay").style.visibility = "hidden";
        document.querySelector("#gameInfo").classList = "gameEnd";
        document.querySelector("#deal").textContent = "Play Again";
    }

    function adjustForAces(total, highAceCount) {
        while (total > 21 && highAceCount > 0) {
            total -= 10;
            highAceCount--;
        }
        return { total, highAceCount };
    }

    return (
        <div className="game">
            <h1 id="gameInfo">{gameInfo}</h1>
            <button id="deal" onClick={handleDeal}>Deal Cards</button>
            <div id="playArea">

                <div id="userArea">
                    <h2>Your Cards:</h2>
                    <p className="cards">{userDisplay}</p>
                    <p>Total: {userTotal}</p>
                    <div className="userControls">
                        <button id="hit" onClick={addUserCard}>Hit</button>
                        <button id="stay" onClick={dealerTurn}>Stay</button>
                    </div>
                </div>

                <div id="dealerArea">
                    <h2>Dealer's Cards:</h2>
                    <p className="cards"> {dealerDisplay}</p>
                    <p>Total: {dealerTotal}</p>
                </div>
            </div>
        </div>
    );
}

export default Game;