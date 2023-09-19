import { useState } from 'react'

import typeChart from '../data/type_chart.json'

type Type = string

type TypeSelectorProps = {
    selectedType: Type
    handleChange: React.ChangeEventHandler<HTMLSelectElement>

    /*
     * noTypeCopy is the text appearing when the user hasn't selected a type.
     * Default: "----- No Type -----".
     */
    noTypeCopy?: string
}

// USEFUL: https://react.dev/reference/react-dom/components/select

/**
 * TypeSelector is a react Component with UX to select a type.
 */
const TypeSelector: React.FC<TypeSelectorProps> = ({ noTypeCopy, selectedType, handleChange }) => {
    return (
        <div className="typeSelector">
            <select name="type" value={selectedType} onChange={handleChange}>
                <option value={`noType`} className="optionNoType">
                    {noTypeCopy || '----- No Type -----'}
                </option>
                {typeChart.typeList.map((type: string) => (
                    <option value={`${type}`} key={`option__${type}`}>
                        {type}
                    </option>
                ))}
            </select>
        </div>
    )
}

function OffenseCalculator() {
    const [offenseType, setOffenseType] = useState('Fire')
    const [defenseType1, setDefenseType1] = useState('Water')
    const [defenseType2, setDefenseType2] = useState('noType')
    const [defenseType3, setDefenseType3] = useState('noType')
    return (
        <>
            <header>Too Many Types Checker</header>
            <h1>Offense Calculator</h1>

            <main id="content">
                {/* Inspiration: https://getbootstrap.com/docs/4.0/components/alerts/ */}
                <div className="alert alertPrimary">NOTE: The Reverse type is not yet implemented.</div>

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
                        <div>Select the attacking move's type.</div>
                        <TypeSelector selectedType={offenseType} handleChange={(e) => setOffenseType(e.target.value)} />
                    </div>
                    <div className="col-md-6">
                        <h2>Defending Types</h2>
                        <div>Select the defending Pokemon's types.</div>
                        <div>Type 1</div>
                        <TypeSelector
                            selectedType={defenseType1}
                            handleChange={(e) => setDefenseType1(e.target.value)}
                        />
                        <div>Type 2</div>
                        <TypeSelector
                            selectedType={defenseType2}
                            handleChange={(e) => setDefenseType2(e.target.value)}
                        />
                        <div>Type 3</div>
                        <TypeSelector
                            selectedType={defenseType3}
                            handleChange={(e) => setDefenseType3(e.target.value)}
                        />
                    </div>
                </div>
            </main>
        </>
    )
}

export default OffenseCalculator
