function OffenseCalculator() {
    return (
        <>
            <header>Too Many Types Checker</header>
            <h1>Offense Calculator</h1>

            <main id="content">
                {/* Explanation */}
                <div className="explanation">
                    <p>This is a type effectiveness calculator for damaging moves in Pokemon: Too Many Types.</p>
                    <p>
                        To start, select your offensive type in the "Attacking Move" section, then select the defending
                        Pokemon's types in the "Defending Types" section.
                    </p>
                </div>

                {/* Row with Offensive and Defensive type sections */}
                <div className="row">
                    <div className="col-md-6">
                        <h2>Attacking Move</h2>
                        <div>Insert content here</div>
                    </div>
                    <div className="col-md-6">
                        <h2>Defending Types</h2>
                        <div>Insert content here</div>
                    </div>
                </div>
            </main>
        </>
    )
}

export default OffenseCalculator
