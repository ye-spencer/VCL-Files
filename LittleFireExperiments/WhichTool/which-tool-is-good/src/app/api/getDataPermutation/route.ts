import { NextResponse } from "next/server";

export async function GET() 
{
    const order : string[] = ["Fire Starter", "Machete", "Metal Pot", "Mosquito Net", "Bow and Arrow", "Furs", "Canoe", "Shovel", "Fishing Net", "Axe", "Rope"];

    // Fisher-Yates shuffle algorithm
    for (let i = order.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [order[i], order[j]] = [order[j], order[i]];
    }


    const response = NextResponse.json(
        {
            order : order,
        }
    );
    return response;
}   