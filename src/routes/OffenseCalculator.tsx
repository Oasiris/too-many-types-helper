import { useState } from 'react'

import TYPE_CHART from '../data/type_chart.json'
import uniq from 'lodash/fp/uniq'

import './OffenseCalculator.scss'

type Type = string

type TypeSelectorProps = {
    selectedType: Type
    handleChange: React.ChangeEventHandler<HTMLSelectElement>

    /* requiresType configures whether it's possible to select 'No Type' in the dropdown. Default to false. */
    requiresType?: boolean

    /*
     * noTypeCopy is the text appearing when the user hasn't selected a type.
     * Default: "----- No Type -----".
     */
    noTypeCopy?: string
}

const NO_TYPE_VALUE = 'noType'

// ============================
// Helper functions
// ============================

/**
 * getDefensiveTypesCopy returns a pretty, UX-friendly copy for the
 * type(s) of a Pokemon.
 */
function getDefensiveTypesCopy(...types: string[]): string {
    return types.filter((type) => type !== NO_TYPE_VALUE).join(' / ')
}

/**
 * calculateEffectiveness calculates the effectiveness of the offensiveType
 * against a Pokemon with the listed defensive types.
 *
 * Example: calculateEffectiveness('Grass', ['Dragon', 'Flying']) ==> 0.25.
 */
function calculateEffectiveness(offenseType: string, defenseTypes: string[]): number {
    let effectiveness = 1
    console.log(`Calculate ${offenseType} vs ${defenseTypes}`)
    const offensiveTypeMatchupId = (TYPE_CHART.types as { [s: string]: number })[offenseType]
    // NOTE: If we fail to find the matchup ID here, we should throw!
    for (const defenseType of defenseTypes) {
        const defenseTypeMatchupId = (TYPE_CHART.types as { [s: string]: number | undefined })[defenseType]
        // NOTE: If we fail to find the matchup ID here, we should throw!
        if (defenseType === NO_TYPE_VALUE || defenseTypeMatchupId === undefined) {
            console.log(`No matchup ID for type ${defenseType}!`)
            continue
        }
        let modifier = TYPE_CHART.matchups[offensiveTypeMatchupId][defenseTypeMatchupId]
        console.log(`Modifier for ${offenseType} vs ${defenseType}: ${modifier}`)
        effectiveness *= modifier
    }
    return effectiveness
}

// ============================
// Helper components
// ============================

// USEFUL: https://react.dev/reference/react-dom/components/select

/**
 * TypeSelector is a react Component with UX to select a type.
 */
const TypeSelector: React.FC<TypeSelectorProps> = ({ noTypeCopy, selectedType, handleChange, requiresType }) => {
    if (requiresType === undefined) {
        requiresType = false
    }
    // NOTE: It's possible to have enableNoType = false with selectedType value of 'noType'.

    return (
        <div className="typeSelector">
            <select name="type" value={selectedType} onChange={handleChange}>
                {(!requiresType || selectedType === NO_TYPE_VALUE) && (
                    <option value={NO_TYPE_VALUE} className="optionNoType">
                        {noTypeCopy || '----- No Type -----'}
                    </option>
                )}
                {TYPE_CHART.typeList.map((type: string) => (
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
    const defenseTypes = uniq([defenseType1, defenseType2, defenseType3])

    // Calculate the effectiveness.
    const effectivenessValue = calculateEffectiveness(offenseType, defenseTypes)

    // Use different styles based on the effectiveness.
    let effectivenessColorHex: string
    switch (true) {
        case effectivenessValue > 1:
            effectivenessColorHex = '#07e659'
            break
        case effectivenessValue > 0 && effectivenessValue < 1:
            effectivenessColorHex = '#e62107'
            break
        case effectivenessValue === 0:
            effectivenessColorHex = '#5c514e'
            break
        default:
            effectivenessColorHex = '#000000'
    }

    return (
        <>
            <header>Too Many Types Helper</header>
            <h1>Offense Calculator</h1>

            <main id="content">
                {/* Inspiration: https://getbootstrap.com/docs/4.0/components/alerts/ */}
                <div className="alert alertPrimary">NOTE: The Reverse type is not yet implemented.</div>

                <a href="https://docs.google.com/spreadsheets/d/1WxYmHs_ZsgzLUrL8WfEGN-JHdToubXHvi942ViDIG8k/edit#gid=863344341">
                    Link: Full type matchup spreadsheet
                </a>
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
                        <TypeSelector
                            requiresType={true}
                            selectedType={offenseType}
                            handleChange={(e) => setOffenseType(e.target.value)}
                        />
                    </div>
                    <div className="col-md-6">
                        <h2>Defending Types</h2>
                        <div>Select the defending Pokemon's types.</div>
                        <div>Type 1</div>
                        <TypeSelector
                            requiresType={true}
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
                        <br />
                        <br />
                    </div>
                </div>

                {/* Calculating areas: */}
                <div className="resultArea">
                    <h2>Calculations</h2>
                    <div>
                        Move effectiveness of <span className="offensiveTypes">{offenseType}</span> v.s.{' '}
                        <span className="defenseTypes">{getDefensiveTypesCopy(...defenseTypes)}</span>:
                    </div>
                    <h4 className="effectivenessValue" style={{ color: effectivenessColorHex }}>
                        {effectivenessValue}x
                    </h4>

                    <h3 style={{ color: '#444' }}>
                        <i>Breakdown</i>
                    </h3>
                    <div>
                        {defenseTypes
                            .filter((defensiveType) => defensiveType !== NO_TYPE_VALUE)
                            .map((defenseType, idx) => (
                                <p key={idx}>
                                    Modifier for {offenseType} vs {defenseType}:{' '}
                                    <span className="miniEffectivenessValue">
                                        {calculateEffectiveness(offenseType, [defenseType])}
                                    </span>
                                </p>
                            ))}
                    </div>
                </div>
            </main>

            {/* Footer */}

            <footer>
                {/* Hi! I'm happy to share this repository for people to learn and enjoy. However, please don't fork
                and re-deploy this without my permission, and please don't delete my name from the credits footer. Thanks! */}
                <p>Created with ❤️ in TypeScript.</p>
                <p>©Oasiris, 2023.</p>
                <a href="https://github.com/Oasiris">github.com/Oasiris</a>
            </footer>
        </>
    )
}

export default OffenseCalculator
