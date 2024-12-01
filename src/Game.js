import { useState } from "react";

const Game = () => {
    //let userCards = [];
    const [userCards, setUserCards] = useState([]);
    const [userDisplay, setUserDisplay] = useState("🂠 🂠");
    const [userTotal, setUserTotal] = useState(0);
    //let userRanks = [];
    const [userRanks, setUserRanks] = useState([]);

    //let dealerCards = [];
    const [dealerCards, setDealerCards] = useState([]);
    const [dealerDisplay, setDealerDisplay] = useState("🂠 🂠");
    const [dealerTotal, setDealerTotal] = useState(0);
    //let dealerRanks = [];
    const [dealerRanks, setDealerRanks] = useState([]);

    const suits = 'spade heart club diamond'.split(' ');
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
        const value = i % 13 + 1;
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
        const initialUserCards = [randomCard(), randomCard()];
        const initialDealerCards = [randomCard()];
    
        setUserCards(initialUserCards);
        setDealerCards(initialDealerCards);

        displayCards(initialUserCards, initialDealerCards);
        document.querySelector("#deal").textContent = "Restart";
        document.querySelector("#hit").style.visibility = "visible";
        document.querySelector("#stay").style.visibility = "visible";
    }

    function randomCard() {
        const cardNum = Math.ceil(Math.random() * 52) - 1;
        return cards[cardNum];
    }

    function addUserCard() {
        const newCard = randomCard();
        setUserCards((prevCards) => [...prevCards, newCard]);
        
        displayCards([...userCards, newCard]);
    }

    function displayCards(userCardsArg = userCards, dealerCardsArg = dealerCards) {

        let display = "";
        let total = 0;
        for (let card of userCardsArg) {
            display += card.image + " ";
            total += card.value;
        }
        setUserDisplay(display);
        setUserTotal(total);

        display = "";
        total = "";
        for (let card of dealerCardsArg) {
            display += card.image + " ";
            total += card.value;
            if (dealerCardsArg.length === 1) {
                display += "🂠";
            }
        }
        setDealerDisplay(display);
        setDealerTotal(total);
    }

    return (
        <div className="game">
            <button id="deal" onClick={handleDeal}>Deal Cards</button>
            <div id="playArea">

                <div id="userArea">
                    <h2>Your Cards:</h2>
                    <p className="cards">{userDisplay}</p>
                    <p>Total: {userTotal}</p>
                    <div className="userControls">
                        <button id="hit" onClick={addUserCard}>Hit</button>
                        <button id="stay">Stay</button>
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