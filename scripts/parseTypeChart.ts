import fs from 'node:fs'

import { cloneDeep, flatten, isEqual } from 'lodash/fp'

const DEFAULT_TYPE_CHART_PATH = './in/Too Many Types Spreadsheet - Type Chart - 2023-09-18.csv'
// const DEFAULT_TYPE_CHART_PATH = './in/type_chart_example.csv'

const DEFAULT_OUTPUT_PATH = './out/type_chart.json'

// IMPORTANT: Update these values when you create the type chart.
// This is in case the type chart ever changes in the future.
const CREATION_DATE = '2023-09-18'
let LAST_KNOWN_ROM_VERSION: string | null
LAST_KNOWN_ROM_VERSION = 'v1.3.0'

/*
REQUIREMENTS:

1a. No type name can appear twice in the header row or column
1b. No type name can appear twice in the header row or column when
    case is normalized (e.g. all lowercase)
2.  The order of the types in the rows must equal the order of
    the types in the columns ([FIRE, WATER, GRASS] across --> must
    use same order writing [FIRE, WATER, GRASS] vertically)
*/


/**
 * toTitleCase converts a string to title case, e.g. 'HOT BUNS' -->
 * 'Hot buns' or 'aPpLe' --> 'Apple'.
 */
function toTitleCase(str: string) {
    return str.replace(/\w\S*/g, function (txt: string) {
        return txt.charAt(0).toUpperCase() + txt.slice(1).toLowerCase()
    })
}

/**
 * parseTypeChartCsv parses the CSV type chart into an array value.
 * @param typeChartPath
 */
function parseTypeChartCsv(typeChartCsvPath: string): string {
    const file = fs.readFileSync(typeChartCsvPath, 'utf8')

    // Parse into rows.
    let rows = file.split('\n').map((v: string) => v.split(',').map((v) => v.trim()))
    console.log(rows)

    // Cull the first row and column.
    rows = rows.slice(1)
    rows = rows.map((row) => row.slice(1))
    console.log(rows)

    // If the final row's first column is 'TOTAL DEFENSE', cull the row.
    if (rows[rows.length - 1][0].toUpperCase() == 'TOTAL DEFENSE') {
        console.log('Cleaning up TOTAL DEFENSE...')
        rows = rows.slice(0, rows.length - 1)
    }
    // If the header's final column is 'TOTAL OFFENSE', cull the column.
    if (rows[0][rows[0].length - 1].toUpperCase() == 'TOTAL OFFENSE') {
        console.log('Cleaning up TOTAL OFFENSE...')
        rows = rows.map((row) => row.slice(0, row.length - 1))
    }
    console.log(rows)

    // ———————————————————————————
    // Now we have something that looks like:
    /*
        [ '', 'FIRE', 'WATER', 'GRASS' ],
        [ 'FIRE', '0.5', '0.5', '2' ],
        [ 'WATER', '2', '0.5', '0.5' ],
        [ 'GRASS', '0.5', '2', '0.5' ]
    */
    // Now, let's convert this into the following:
    /*
        {
            matchups: [
                [0.5, 0.5, 2],
                [2, 0.5, 0.5],
                [0.5, 2, 0.5]
            ],
            types: {
                'FIRE': 0,
                'WATER', 1,
                'GRASS': 2,
            }
        }
        To get how type X does offensively against Y,
        you just type in table[matchups][X][Y].
   */

    // FOR NOW, assume the top row order 'FIRE', 'WATER', 'GRASS' matches the bottom columns order 'FIRE', 'WATER', 'GRASS'.

    // Start by creating the matchups table.
    let matchups = cloneDeep(rows)
    let verticalTypeList = flatten(matchups.map((row) => row[0])).slice(1)
    matchups = matchups.map((row) => row.slice(1))
    let typeList = matchups[0]
    matchups = matchups.slice(1)
    console.log(matchups)

    // Fix casing.
    verticalTypeList = verticalTypeList.map(type => toTitleCase(type))
    typeList = typeList.map(type => toTitleCase(type))

    // Check that the list of types is easily createable.
    console.log(`Horizontal type list: ${typeList}`)
    // console.log(verticalTypeList)

    if (isEqual(typeList, verticalTypeList)) {
        console.log(`typeList and verticalTypeList are the same and in the same order`)
    } else {
        console.log(`WARNING! typeList and verticalTypeList are different or in a different order!`)
        console.log(`Horizontal: ${typeList}`)
        console.log(`Vertical: ${verticalTypeList}`)
        console.log(`Try again with a file where the types are in the same order both down and across.`)
    }

    const typeToMatchupIndex: { [s: string]: number } = {}
    for (let i in typeList) {
        const type = typeList[i]
        typeToMatchupIndex[type] = Number(i)
    }

    // Assemble the final JSON.
    const output = {
        matchups: matchups,
        types: typeToMatchupIndex,
        CREATION_DATE,
        LAST_KNOWN_ROM_VERSION,
    }

    return JSON.stringify(output)
}

if (require.main === module) {
    // === Write ===
    const args = process.argv.slice(2)
    if (args.length > 2) {
        console.error(
            `Illegal number of parameters. Usage: parseTypeChart.ts [inputCsvPath, optional] [outputJsonPath, optional]`,
        )
        process.exit(1)
    }

    let typeChartPath = DEFAULT_TYPE_CHART_PATH
    if (args.length >= 1) {
        typeChartPath = args[0]
    }
    let outputPath = DEFAULT_OUTPUT_PATH
    if (args.length >= 2) {
        outputPath = args[1]
    }

    console.log(`Reading ${typeChartPath}...`)
    const parsedFile = parseTypeChartCsv(typeChartPath)

    // Write the parsed file.
    console.log(`Writing to ${outputPath}...`)
    fs.writeFileSync(outputPath, parsedFile, 'utf8')
    console.log(`Wrote output to ${outputPath} successfully.`)

    // write(resolve(__dirname, OUTPUT_FILEPATH), String(solution), 'utf8')
    // console.log('Completed.')
}
