"use client";

import { useCallback, useRef, useState } from "react";
import styled from "styled-components";

export default function HomePage() {
  const [original, setOriginal] = useState("");
  const [tone, setTone] = useState("professional");
  const [rewritten, setRewritten] = useState("");
  const [loading, setLoading] = useState(false);

  const [error, setError] = useState("");
  const [showCopyPopup, setShowCopyPopup] = useState(false);
  const [history, setHistory] = useState<
    { original: string; tone: string; rewritten: string }[]
  >([]);

  const submitTimeoutRef = useRef<NodeJS.Timeout | null>(null);

  const submitForm = useCallback(
    (e: React.FormEvent) => {
      e.preventDefault();

      if (original.length > 1000) {
        setRewritten("");
        setLoading(false);
        alert("Input too long. Maximum is 1000 characters.");
        return;
      }

      if (submitTimeoutRef.current) {
        clearTimeout(submitTimeoutRef.current);
      }

      submitTimeoutRef.current = setTimeout(async () => {
        setLoading(true);
        setRewritten("");
        setError("");

        const res = await fetch("/api/tone", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ original, tone }),
        });

        if (!res.ok) {
          const data = await res.json();
          const errorMsg = data.error.original._errors[0];
          console.error("❌ API error:", errorMsg);
          setError(errorMsg || "Something went wrong.");
          setLoading(false);
          return;
        }

        const data = await res.json();
        console.log("✅ Rewritten:", data.rewritten);
        setRewritten(data.rewritten);
        setHistory((prev) => [
          ...prev,
          { original, tone, rewritten: data.rewritten },
        ]);

        setLoading(false);
      }, 300);
    },
    [original, tone]
  );

  function onClickCopy() {
    navigator.clipboard.writeText(rewritten);
    setShowCopyPopup(true);
    setTimeout(() => setShowCopyPopup(false), 2000);
  }

  return (
    <StyledContainer>
      <StyledTitle>📝 Tone Changer</StyledTitle>

      <StyledForm onSubmit={submitForm}>
        <fieldset>
          <StyledTextarea
            placeholder="Paste your message here..."
            rows={10}
            value={original}
            onChange={(e) => {
              setOriginal(e.target.value);

              const textarea = e.target;
              textarea.style.height = "auto";
              textarea.style.height = `${textarea.scrollHeight}px`;
            }}
          />
          <p className="text-sm text-right text-gray-500">
            {original.length}/1000 characters
          </p>

          <StyledSelect value={tone} onChange={(e) => setTone(e.target.value)}>
            <option value="professional">Professional</option>
            <option value="friendly">Friendly</option>
            <option value="casual">Casual</option>
            <option value="assertive">Assertive</option>
            <option value="apologetic">Apologetic</option>
          </StyledSelect>
        </fieldset>

        <StyledSubmitButton type="submit">Rewrite Message</StyledSubmitButton>
      </StyledForm>

      {loading && <Loading>Rewriting message...</Loading>}

      {error && <ErrorBox>⚠️ {error}</ErrorBox>}

      {rewritten && (
        <StyledOutputCard>
          <StyledOutputHeader>
            <h2>Rewritten Message:</h2>
            <StyledCopyButton onClick={onClickCopy}>✏️ Copy</StyledCopyButton>
          </StyledOutputHeader>
          <p>{rewritten}</p>
        </StyledOutputCard>
      )}

      {history.length > 0 && (
        <HistorySection>
          <HistoryTitle>🕓 History (this session)</HistoryTitle>
          {history.map((entry, index) => (
            <HistoryItem key={index}>
              <ToneLabel>Tone: {entry.tone}</ToneLabel>
              <OriginalText>“{entry.original}”</OriginalText>
              <RewrittenText>{entry.rewritten}</RewrittenText>
            </HistoryItem>
          ))}
        </HistorySection>
      )}

      {showCopyPopup && <Snackbar>📋 Copied to clipboard!</Snackbar>}
    </StyledContainer>
  );
}

const StyledContainer = styled.main`
  max-width: 40rem;
  margin: 0 auto;
  padding: 2rem;
`;

const StyledTitle = styled.h1`
  text-align: center;
  font-size: 2rem;
  font-weight: bold;
  margin-bottom: 1.5rem;
`;

const StyledForm = styled.form`
  display: flex;
  flex-direction: column;
  gap: 1rem;
`;

const StyledTextarea = styled.textarea`
  width: 100%;
  padding: 0.75rem;
  border: 1px solid #ccc;
  border-radius: 6px;
  resize: vertical;
`;

const StyledSelect = styled.select`
  padding: 0.5rem;
  border: 1px solid #ccc;
  border-radius: 6px;
`;

const StyledSubmitButton = styled.button`
  background-color: #2563eb;
  color: white;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-weight: bold;
  border: none;
  cursor: pointer;

  &:hover {
    background-color: #1d4ed8;
  }
`;

const StyledOutputCard = styled.div`
  margin-top: 1.5rem;
  background-color: #272727;
  padding: 1rem;
  border-radius: 6px;
`;

const StyledOutputHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
`;

const StyledCopyButton = styled.button`
  background-color: #4ade80;
  color: black;
  font-weight: 500;
  padding: 0.4rem 0.75rem;
  border: none;
  border-radius: 4px;
  cursor: pointer;

  &:hover {
    background-color: #22c55e;
  }
`;

const Loading = styled.p`
  margin-top: 1.5rem;
  background-color: #f3f4f6;
`;

const ErrorBox = styled.div`
  margin-top: 1rem;
  background-color: #fee2e2;
  color: #b91c1c;
  padding: 0.75rem;
  border: 1px solid #fca5a5;
  border-radius: 6px;
`;

const Snackbar = styled.div`
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  background-color: #16a34a;
  color: white;
  padding: 0.75rem 1rem;
  border-radius: 0.5rem;
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  animation: fadeInOut 2s ease-in-out;

  @keyframes fadeInOut {
    0% {
      opacity: 0;
      transform: translateY(10px);
    }
    10% {
      opacity: 1;
      transform: translateY(0);
    }
    90% {
      opacity: 1;
    }
    100% {
      opacity: 0;
      transform: translateY(10px);
    }
  }
`;

const HistorySection = styled.div`
  margin-top: 2rem;
  border-top: 1px solid #e5e7eb;
  padding-top: 1.5rem;
`;

const HistoryTitle = styled.h3`
  font-weight: 600;
  font-size: 1.25rem;
  margin-bottom: 1rem;
`;

const HistoryItem = styled.div`
  margin-bottom: 1rem;
  background-color: #f3f4f6;
  padding: 1rem;
  border-radius: 6px;
`;

const ToneLabel = styled.span`
  font-size: 0.875rem;
  font-weight: 500;
  color: #4b5563;
`;

const OriginalText = styled.p`
  margin: 0.5rem 0;
  font-style: italic;
  color: #6b7280;
`;

const RewrittenText = styled.p`
  margin: 0;
  color: #111827;
`;
