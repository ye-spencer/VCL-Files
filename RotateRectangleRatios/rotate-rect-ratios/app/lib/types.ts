export type trialData = trialParameters & {
    response: string,
    responseTime: number,
    prolificId: string,
}

export type trialParameters = {
    trialNumber: number,
    rectAXPercent: number, // x-coordinate as a percentage, should be between 5%-45%
    rectAYPercent: number, // y-coordinate as a percentage, should be between 5%-95%
    rectBXPercent: number, // x-coordinate as a percentage, should be between 55%-95%
    rectBYPercent: number, // y-coordinate as a percentage, should be between 5%-95%
    rectAWidthPercent: number, // width as a percentage
    rectAHeightPercent: number, // height as a percentage, should be between 5-10%
    rectBWidthPercent: number, // width as a percentage
    rectBHeightPercent: number, // height as a percentage, should be between 5-10%
    rectAOrientation: number, // degrees, between 0 and 180
    rectBOrientation: number, // degrees, between 0 and 180
    rectAColor: string, // color of rectangle A
    rectBColor: string, // color of rectangle B
}