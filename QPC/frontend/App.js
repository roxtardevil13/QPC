import { useState, useEffect } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [question, setQuestion] = useState("");
  const [questions, setQuestions] = useState([
    { _id: 1, questionText: "What is the capital of France?", plagiarismScore: 2 },
    { _id: 2, questionText: "Explain Newton's laws of motion.", plagiarismScore: 5 },
    { _id: 3, questionText: "What are the main differences between Python and Java?", plagiarismScore: 3 },
    { _id: 4, questionText: "Describe the process of photosynthesis.", plagiarismScore: 4 },
    { _id: 5, questionText: "What are the key principles of Object-Oriented Programming?", plagiarismScore: 6 }
  ]);

  useEffect(() => {
    fetchQuestions();
  }, []);

  const fetchQuestions = async () => {
    try {
      const res = await axios.get("/api/questions");
      setQuestions([...res.data, ...questions]);
    } catch (err) {
      console.error("Error fetching questions", err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!question.trim()) return toast.error("Question cannot be empty");

    try {
      const res = await axios.post("/api/questions", {
        questionText: question,
      });
      setQuestions([res.data, ...questions]);
      setQuestion("");
      toast.success("Question added successfully!");
    } catch (err) {
      toast.error("Error adding question");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="max-w-2xl mx-auto bg-white p-6 rounded-lg shadow-lg">
        <h1 className="text-xl font-bold mb-4">Question Creator</h1>
        <form onSubmit={handleSubmit} className="mb-4">
          <textarea
            className="w-full p-2 border rounded-lg"
            rows="3"
            placeholder="Enter your question..."
            value={question}
            onChange={(e) => setQuestion(e.target.value)}
          ></textarea>
          <button
            type="submit"
            className="mt-2 px-4 py-2 bg-blue-500 text-white rounded-lg"
          >
            Submit Question
          </button>
        </form>

        <h2 className="text-lg font-semibold mb-2">Previous Questions</h2>
        {questions.length > 0 ? (
          <ul className="space-y-3">
            {questions.map((q) => (
              <li
                key={q._id}
                className="p-3 border rounded-lg shadow-sm bg-gray-50"
              >
                <p>{q.questionText}</p>
                <p className="text-sm text-gray-600">
                  Plagiarism Score: {q.plagiarismScore || "N/A"}%
                </p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No questions added yet.</p>
        )}
      </div>
      <ToastContainer />
    </div>
  );
}

export default App;