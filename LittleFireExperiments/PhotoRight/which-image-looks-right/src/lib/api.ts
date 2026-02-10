interface TrialData {
    duration: number;
    selected: string;
    order: string[];
    prolificId: string;
    studyId: string;
    sessionId: string;

}

export async function sendDataToServer(data : TrialData)
{
    const response = await fetch("/api/sendData", {
        method: "POST",
        body: JSON.stringify(data)
    });
    const responseData = await response.json();
    return responseData;
}

export async function getDataPermutation()
{
    const response = await fetch("/api/getDataPermutation");
    const responseData = await response.json();
    return responseData;
}