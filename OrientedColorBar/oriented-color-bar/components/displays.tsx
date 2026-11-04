import { NUM_BARS, type QuestionScreen, type SearchScreen } from "@/lib/experiment";

const BAR_WIDTH = 10;
const BAR_LENGTH = 60;
const RADIUS = 120;

function Bar(props: { x: number; y: number; orientation: number; color: number | null }) {
  const { x, y, orientation, color } = props;
  return (
    <rect
      x={x - BAR_WIDTH / 2}
      y={y - BAR_LENGTH / 2}
      width={BAR_WIDTH}
      height={BAR_LENGTH}
      fill={color === null ? "hsl(0 0% 50%)" : `hsl(${color} 80% 50%)`}
      transform={`rotate(${orientation} ${x} ${y})`}
    />
  );
}

export function SearchDisplay({ screen }: { screen: SearchScreen }) {
  return (
    <svg viewBox="-200 -200 400 400" width={400} height={400}>
      {Array.from({ length: NUM_BARS }, (_, i) => {
        const angle = (2 * Math.PI * i) / NUM_BARS;
        return (
          <Bar
            key={i}
            x={RADIUS * Math.sin(angle)}
            y={-RADIUS * Math.cos(angle)}
            orientation={
              i === screen.diff_orientation_number
                ? screen.diff_orientation_degree!
                : screen.default_orientation_degree
            }
            color={
              i === screen.diff_color_number
                ? screen.diff_color_degree!
                : screen.default_color_degree
            }
          />
        );
      })}
    </svg>
  );
}

export function QuestionDisplay({ question }: { question: QuestionScreen }) {
  const correct = {
    orientation: question.correct_orientation,
    color: question.correct_color,
  };
  const other = {
    orientation: question.correct_orientation + question.diff_orientation,
    color: question.correct_color === null ? null : question.correct_color + question.diff_color,
  };
  const [left, right] = question.which_correct === "left" ? [correct, other] : [other, correct];

  return (
    <div className="flex flex-col items-center gap-6">
      <svg viewBox="-200 -100 400 200" width={400} height={200}>
        <Bar x={-100} y={0} {...left} />
        <Bar x={100} y={0} {...right} />
      </svg>
      <p>
        Which bar has the same {question.trial_type === "color" ? "color" : "tilt"} as the
        odd one out? Press Q for left, P for right.
      </p>
    </div>
  );
}
