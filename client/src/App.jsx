import React, { useState, useEffect, useRef } from "react";
import {
  Container,
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  CircularProgress,
  IconButton,
  Tooltip,
  useTheme,
} from "@mui/material";
import CloseIcon from '@mui/icons-material/Close';
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import MicIcon from "@mui/icons-material/Mic";
import MicOffIcon from "@mui/icons-material/MicOff";
import ReactMarkdown from "react-markdown";
import { useTranslation } from "react-i18next";
import Switch from "react-switch";
import i18n from "./i18n";
import Alert from "@mui/material/Alert";


const API_BASE = "http://localhost:3001";

export default function App() {
  const theme = useTheme();
  const { t } = useTranslation();
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [darkMode, setDarkMode] = useState(() => localStorage.getItem("darkMode") === "true");
  const [history, setHistory] = useState(() => JSON.parse(localStorage.getItem("history")) || []);
  const [language, setLanguage] = useState("en");
  const [isRecording, setIsRecording] = useState(false);
  const answerRef = useRef();
  const [imageFile, setImageFile] = useState(null);
  const [uploadError, setUploadError] = useState("");
 

  useEffect(() => {
    localStorage.setItem("darkMode", darkMode);
  }, [darkMode]);

  useEffect(() => {
    localStorage.setItem("history", JSON.stringify(history));
  }, [history]);

  useEffect(() => {
    i18n.changeLanguage(language);
  }, [language]);

  const askQuestion = async () => {
    if (!question.trim()) return;
    setLoading(true);
    setAnswer("");
    setError("");
    try {
      const res = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("error"));
      setAnswer(data.answer);
      const newEntry = { question, answer: data.answer, timestamp: new Date().toISOString() };
      setHistory([newEntry, ...history]);
      requestAnimationFrame(() => answerRef.current?.scrollIntoView({ behavior: "smooth" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const askQuestionWithText = async (inputQuestion) => {
    if (!inputQuestion.trim()) return;
    setLoading(true);
    setAnswer("");
    setError("");
    try {
      const res = await fetch(`${API_BASE}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ question: inputQuestion }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || t("error"));
      setAnswer(data.answer);
      const newEntry = { question: inputQuestion, answer: data.answer, timestamp: new Date().toISOString() };
      setHistory([newEntry, ...history]);
      requestAnimationFrame(() => answerRef.current?.scrollIntoView({ behavior: "smooth" }));
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

 // const startVoiceInput = () => {
 //   if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
 //     alert("Speech Recognition API not supported in this browser");
 //     return;
 //   }
 //   const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
 //   const recognition = new SpeechRecognition();
 //   recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
 //   recognition.interimResults = false;
 //   recognition.maxAlternatives = 1;

//    recognition.onstart = () => setIsRecording(true);
//    recognition.onend = () => setIsRecording(false);
//    recognition.onerror = (event) => {
//      setIsRecording(false);
 //     alert("Speech recognition error: " + event.error);
//    };
//    recognition.onresult = (event) => {
//      const text = event.results[0][0].transcript;
//      setQuestion(text);
//      askQuestionWithText(text);
//    };
//
//    recognition.start();
//  };

const onClearInput = () => setQuestion("");
const startVoiceInput = () => {
  if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
    alert("Speech Recognition API not supported in this browser");
    return;
  }
  
  const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
  const recognition = new SpeechRecognition();
  
  recognition.lang = language === "hi" ? "hi-IN" : "en-IN";
  recognition.interimResults = false;
  recognition.maxAlternatives = 1;
  
  recognition.onstart = () => setIsRecording(true);
  recognition.onend = () => setIsRecording(false);
  recognition.onerror = (event) => {
    setIsRecording(false);
    alert("Speech recognition error: " + event.error);
  };
  
  recognition.onresult = (event) => {
    const text = event.results[0][0].transcript;
    setQuestion(text);
    askQuestionWithText(text); // your existing function to send query to backend
  };
  
  recognition.start();
};


  const copyAnswer = () => {
    navigator.clipboard.writeText(answer);
    alert("Answer copied to clipboard!");
  };

  const onImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setImageFile(e.target.files[0]);
      setUploadError("");
    }
  };

  const uploadImage = async () => {
  if (!imageFile) {
    setUploadError("Please select an image file.");
    return;
  }
  setLoading(true);
  setAnswer("");
  setError("");
  setUploadError("");
  try {
    const formData = new FormData();
    formData.append("image", imageFile);

    const res = await fetch(`${API_BASE}/ask-image`, {
      method: "POST",
      body: formData,
    });

    if (!res.ok) {
      const errorData = await res.json();
      throw new Error(errorData.error || "Image analysis failed");
    }

    const data = await res.json();
    setAnswer(data.answer);
    const newEntry = { question: "[Passbook Image Upload]", answer: data.answer, timestamp: new Date().toISOString() };
    setHistory([newEntry, ...history]);
    requestAnimationFrame(() => answerRef.current?.scrollIntoView({ behavior: "smooth" }));
  } catch (err) {
    setUploadError(err.message);
  } finally {
    setLoading(false);
    setImageFile(null);
  }
};

  return (
    <Container
      maxWidth="sm"
      sx={{
        minHeight: "100vh",
        bgcolor: darkMode ? "#121212" : "#f5f5f5",
        color: darkMode ? "white" : "black",
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        py: 6,
        px: 3,
      }}
    >
      <Box
        component={Paper}
        elevation={10}
        sx={{ p: 4, borderRadius: "20px", boxShadow: theme.shadows[8] }}
      >
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4" fontWeight="bold" sx={{ userSelect: "none" }}>
            📌 {t("title")}
          </Typography>
          <Box display="flex" alignItems="center" gap={1}>
            <select
              value={language}
              onChange={(e) => setLanguage(e.target.value)}
              style={{ padding: "6px", borderRadius: "6px" }}
            >
              <option value="en">EN</option>
              <option value="hi">HI</option>
            </select>
            <Switch checked={darkMode} onChange={() => setDarkMode(!darkMode)} />
          </Box>
        </Box>

        {/* Voice + Text input */}
        <Box display="flex" alignItems="center" gap={1} mb={2}>
          <TextField
            label={t("placeholder")}
            multiline
            rows={4}
            variant="outlined"
            fullWidth
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
            disabled={loading}
          />
          <IconButton
            color={isRecording ? "error" : "primary"}
            onClick={startVoiceInput}
            disabled={loading}
            title={isRecording ? "Listening..." : "Start Voice Input"}
          >
            {isRecording ? <MicOffIcon /> : <MicIcon />}
          </IconButton>
          {question && !loading && (
            <IconButton aria-label="Clear input" onClick={onClearInput} size="small">
              <CloseIcon fontSize="small" />
            </IconButton>
          )}
        </Box>

        <Button
          variant="contained"
          onClick={askQuestion}
          disabled={loading || !question.trim()}
          fullWidth
          sx={{
            mb: 2,
            py: 1.5,
            fontWeight: "bold",
            fontSize: "1.1rem",
            backgroundColor: loading ? theme.palette.action.disabled : theme.palette.primary.main,
            "&:hover": {
              backgroundColor: loading ? theme.palette.action.disabled : theme.palette.primary.dark,
            },
          }}
        >
          {loading ? <CircularProgress size={26} color="inherit" /> : t("ask").toUpperCase()}
        </Button>

        {/* Image upload */}
        <Box my={2} display="flex" alignItems="center" gap={2}>
          <Button variant="outlined" component="label" disabled={loading}>
            Upload Passbook Image
            <input type="file" accept="image/*" hidden onChange={onImageChange} />
          </Button>
          <Button variant="contained" disabled={loading || !imageFile} onClick={uploadImage}>
            Analyze Image
          </Button>
        </Box>
        {uploadError && (
          <Alert severity="error" sx={{ mt: 1 }}>
            {uploadError}
          </Alert>
        )}

        {error && (
          <Alert severity="error" sx={{ mt: 1, mb: 2, borderRadius: "8px" }}>
            {error}
          </Alert>
        )}

        {answer && (
          <Paper
            elevation={2}
            sx={{
              p: 3,
              borderRadius: "12px",
              whiteSpace: "pre-wrap",
              position: "relative",
              transition: "opacity 0.3s ease-in-out",
              opacity: answer ? 1 : 0,
            }}
            ref={answerRef}
          >
            <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
              <Typography variant="h6">{t("answer")}</Typography>
              <Tooltip title="Copy answer">
                <IconButton onClick={copyAnswer} size="small" color="primary">
                  <ContentCopyIcon />
                </IconButton>
              </Tooltip>
            </Box>
            <ReactMarkdown>{answer}</ReactMarkdown>
          </Paper>
        )}

        {history.length > 0 && (
          <>
            <Typography variant="h6" mt={4} mb={2} userSelect="none">
              History
            </Typography>
            <Box
              sx={{
                maxHeight: "220px",
                overflowY: "auto",
                px: 1,
              }}
            >
              {history.map(({ question, answer, timestamp }, idx) => (
                <Paper
                  key={idx}
                  elevation={0}
                  sx={{
                    p: 2,
                    mb: 1,
                    bgcolor: darkMode ? "#242424" : "#fafafa",
                    borderRadius: "10px",
                    border: darkMode ? "1px solid #444" : "1px solid #eee",
                  }}
                >
                  <Typography fontWeight="bold" gutterBottom>
                    Q: {question}
                  </Typography>
                  <Typography sx={{ whiteSpace: "pre-wrap", mb: 1, fontSize: "0.95rem" }}>{answer}</Typography>
                  <Typography variant="caption" color="text.secondary" userSelect="none">
                    {new Date(timestamp).toLocaleString()}
                  </Typography>
                </Paper>
              ))}
            </Box>
          </>
        )}
      </Box>
    </Container>
  );
}
