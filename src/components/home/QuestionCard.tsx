"use client";

type Props = {
  question: string;
  options: string[];
  questionIndex: number;
  total: number;
  onSelect: (option: string) => void;
  onRestart: () => void;
};

export function QuestionCard({
  question,
  options,
  questionIndex,
  total,
  onSelect,
  onRestart,
}: Props) {
  return (
    <section className="question-screen" aria-live="polite">
      <div className="question-card">
        <div className="question-badge">
          Question {questionIndex + 1} of {total}
        </div>
        <h3 className="question-title">{question}</h3>
        <div className="question-options">
          {options.map((option) => (
            <button
              key={option}
              className="option-btn"
              type="button"
              onClick={() => onSelect(option)}
            >
              {option}
            </button>
          ))}
        </div>
        <div className="question-progress">
          {Array.from({ length: total }).map((_, index) => (
            <span
              key={index}
              className={`progress-dot${index <= questionIndex ? " active" : ""}`}
            />
          ))}
        </div>
        <div className="mt-5">
          <button className="option-btn primary" type="button" onClick={onRestart}>
            Start Over
          </button>
        </div>
      </div>
    </section>
  );
}

