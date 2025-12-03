import { NextResponse } from "next/server";
import { db } from "@/drizzle/db";
import { whichToolYouPick } from "@/drizzle/schema";

export async function POST(req: Request) 
{
    const body = await req.json();

    console.log(body);

    const result = await db.insert(whichToolYouPick).values({
        duration: body.duration,
        selected: body.selected,
        order: body.order,
        prolificId: body.prolificId,
        studyId: body.studyId,
        sessionId: body.sessionId
    });

    const response = NextResponse.json(
        {
            message: "Hit sendData route",
            result: result
        }
    );
    return response;
}   