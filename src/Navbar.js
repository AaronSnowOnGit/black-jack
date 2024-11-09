const Navbar = () => {
    return (
        <nav className="navbar">
            <h1>Blackjack In React</h1>
            <div className="links">
                <a id = "play" href="">Play</a>
                <a href="">How to Play</a>
                <a href="">Stats</a>
                <a href="">Themes</a>
            </div>
        </nav>
    );
}

export default Navbar;