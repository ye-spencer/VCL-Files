import { END_SCREEN_URL } from "../lib/constants";

export default function EndScreen() {
    return (
        <div>
            <h1>Thank you for participating in this experiment.</h1>
            <p>If you are participating in this experiment through Prolific, please click the button below to return to the Prolific website.</p>
            <button onClick={() => window.location.href = END_SCREEN_URL}>Return to Prolific</button>
        </div>
    );
}